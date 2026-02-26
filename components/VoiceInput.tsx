import { useState, useRef } from 'react'
import { View, Pressable, Alert } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import { Audio } from 'expo-av'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import WaveformVisualizer from './WaveformVisualizer'
import { useThemeStore } from '../store/useThemeStore'

interface VoiceInputProps {
    parsedVoice: any
    setParsedVoice: (v: any) => void
}

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY

export default function VoiceInput({ parsedVoice, setParsedVoice }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const recordingRef = useRef<Audio.Recording | null>(null)
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const SILENCE_TIMEOUT = 2000
    const MAX_DURATION = 8000
    const { isDark } = useThemeStore()

    const startRecording = async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync()
            if (!granted) {
                Alert.alert('Permission denied', 'Microphone access is required')
                return
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            })

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
                (status) => {
                    if (status.isRecording && status.metering !== undefined) {
                        const db = status.metering
                        const SILENCE_THRESHOLD = -40

                        if (db < SILENCE_THRESHOLD) {
                            if (!silenceTimerRef.current) {
                                silenceTimerRef.current = setTimeout(() => {
                                    stopAndProcess()
                                }, SILENCE_TIMEOUT)
                            }
                        } else {
                            if (silenceTimerRef.current) {
                                clearTimeout(silenceTimerRef.current)
                                silenceTimerRef.current = null
                            }
                        }
                    }
                },
                100
            )

            maxDurationTimerRef.current = setTimeout(() => {
                stopAndProcess()
            }, MAX_DURATION)

            recordingRef.current = recording
            setIsListening(true)
        } catch (err) {
            console.error('Failed to start recording:', err)
            Alert.alert('Error', 'Could not start recording')
        }
    }

    const stopAndProcess = async () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = null
        }
        if (maxDurationTimerRef.current) {
            clearTimeout(maxDurationTimerRef.current)
            maxDurationTimerRef.current = null
        }

        try {
            setIsListening(false)
            setIsProcessing(true)

            const recording = recordingRef.current
            if (!recording) {
                console.log('❌ No recording found in ref')
                return
            }

            await recording.stopAndUnloadAsync()
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false })

            const uri = recording.getURI()
            console.log('🎙️ Recording URI:', uri)
            if (!uri) throw new Error('No recording URI')

            recordingRef.current = null

            const formData = new FormData()

            if (uri.startsWith('blob:')) {
                const blobRes = await fetch(uri)
                const blob = await blobRes.blob()
                const file = new File([blob], 'recording.m4a', { type: 'audio/m4a' })
                formData.append('file', file)
            } else {
                formData.append('file', {
                    uri,
                    name: 'recording.m4a',
                    type: 'audio/m4a',
                } as any)
            }

            formData.append('model', 'whisper-large-v3-turbo')

            const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: formData,
            })

            const whisperData = await whisperRes.json()
            const transcript = whisperData.text

            if (!transcript) throw new Error('No transcript returned')

            const chatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a financial transaction parser. 
Extract transaction details from the user's speech and return ONLY valid JSON in this exact shape:
{
  "title": string,
  "amount": number,
  "type": "income" | "expense",
  "category": string
}
Rules:
- amount must be a plain number (no currency symbols)
- If the user says "spent", "paid", "bought" → type is "expense"
- If the user says "received", "earned", "got paid" → type is "income"

Amount parsing rules:
- "k" or "K" means thousand → "5k" = 5000, "50k" = 50000
- "m", "M", "mil", "million", "meter", "metre", "ms" means million → "2m" = 2000000, "1.5m" = 1500000
- "b", "B", "billion" means billion → "1b" = 1000000000
- Always convert shorthand to the full number before returning
- Examples:
  - "spent 5k on food" → amount: 5000
  - "received 2m salary" → amount: 2000000
  - "paid 1.5k for data" → amount: 1500
  - "earned 500k from freelance" → amount: 500000

For EXPENSE, category MUST be one of: Food, Bills/Utilities, Family, Healthcare, Fuel, Phone/Internet, Education, Entertainment, Shopping, Travel, Socializing, Transportation, Housing, Miscellaneous
For INCOME, category MUST be one of: Salary, Business, Freelance, Investments, Refund, Side Hustle, Gift/Bonus, Rental Income

Category rules:
- Food → eating, restaurants, groceries, snacks
- Bills/Utilities → electricity, water, gas bills
- Healthcare → hospital, medicine, doctor
- Fuel → petrol, diesel, gas station
- Phone/Internet → data, airtime, subscription
- Transportation → bus, uber, taxi, ride
- Travel → flights, hotels, trips
- Socializing → hangouts, drinks, outings
- Housing → rent, repairs, furniture
- Salary → income from a job or employer
- Freelance → client work, contracts, gigs
- Investments → stocks, crypto, dividends, returns
- Side Hustle → small business, extra income streams
- Gift/Bonus → money received as a gift or bonus
- Rental Income → money from renting out property
- Business → income from running a business
- Refund → money returned or reimbursed
- If unclear → use Miscellaneous for expenses, Business for income

Return ONLY the JSON object, no extra text`,
                        },
                        {
                            role: 'user',
                            content: transcript,
                        },
                    ],
                }),
            })

            const chatData = await chatRes.json()
            const raw = chatData.choices?.[0]?.message?.content

            if (!raw) throw new Error('No response from LLM')

            const cleaned = raw.replace(/```json|```/g, '').trim()
            const parsed = JSON.parse(cleaned)
            setParsedVoice(parsed)

        } catch (err) {
            console.error('Processing error:', err)
            Alert.alert('Error', 'Could not process your voice input. Try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleMicPress = () => {
        if (isListening) {
            stopAndProcess()
        } else {
            startRecording()
        }
    }

    const handleRetake = () => {
        setParsedVoice(null)
    }

    const statusText = isProcessing
        ? 'Processing...'
        : isListening
            ? 'Listening... tap to stop'
            : 'Tap the mic and say something like:\n"Spent 5k on food"'

    return (
        <View style={tw`items-center my-8`}>
            {!parsedVoice && (
                <>
                    <Text style={tw`mb-6 text-base text-center ${isDark ? 'text-white' : 'text-black'}`}>
                        {statusText}
                    </Text>

                    {isListening && (
                        <WaveformVisualizer
                            isListening={isListening}
                            barCount={20}
                            color={isDark ? '#fff' : '#000'}
                        />
                    )}

                    <Pressable
                        onPress={handleMicPress}
                        disabled={isProcessing}
                        style={[
                            tw`mt-4 w-20 h-20 rounded-full items-center justify-center`,
                            {
                                backgroundColor: isListening
                                    ? '#ef4444'
                                    : isProcessing
                                        ? '#d1d5db'
                                        : '#f3f4f6',
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={isListening ? 'microphone' : 'microphone-outline'}
                            size={40}
                            color={isListening ? '#fff' : '#000'}
                        />
                    </Pressable>
                </>
            )}

            {parsedVoice && (
                <View style={tw`mt-6 w-full`}>
                    {/* Detected transaction card */}
                    <View style={[
                        tw`rounded-xl p-4`,
                        { backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6' }
                    ]}>
                        <Text weight='semibold' style={[
                            tw`text-base mb-3`,
                            { color: isDark ? '#ffffff' : '#111827' }
                        ]}>
                            Detected Transaction:
                        </Text>
                        <Text style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                            Title: {parsedVoice.title}
                        </Text>
                        <Text style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                            Amount: ₦{parsedVoice.amount?.toLocaleString()}
                        </Text>
                        <Text style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                            Type: {parsedVoice.type}
                        </Text>
                        <Text style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                            Category: {parsedVoice.category}
                        </Text>
                    </View>

                    {/* Retake button */}
                    <Pressable
                        onPress={handleRetake}
                        style={[
                            tw`mt-3 flex-row items-center justify-center gap-2 py-3 rounded-xl border`,
                            { borderColor: isDark ? '#4b5563' : '#d1d5db' }
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="microphone-off"
                            size={18}
                            color={isDark ? '#9ca3af' : '#6b7280'}
                        />
                        <Text style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 14 }}>
                            Not right? Retake
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    )
}












// import { useState, useRef } from 'react'
// import { View, Pressable, Alert } from 'react-native'
// import { Text } from '@/components/AppText'
// import tw from 'twrnc'
// import { Audio } from 'expo-av'
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
// import WaveformVisualizer from './WaveformVisualizer'
// import { useThemeStore } from '../store/useThemeStore'

// interface VoiceInputProps {
//     parsedVoice: any
//     setParsedVoice: (v: any) => void
// }

// const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY

// export default function VoiceInput({ parsedVoice, setParsedVoice }: VoiceInputProps) {
//     const [isListening, setIsListening] = useState(false)
//     const [isProcessing, setIsProcessing] = useState(false)
//     const recordingRef = useRef<Audio.Recording | null>(null)
//     const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
//     const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
//     const SILENCE_TIMEOUT = 2000  // stop after 2s of quiet
//     const MAX_DURATION = 8000    // 8s
//     const { isDark } = useThemeStore()

//     const startRecording = async () => {
//         try {
//             const { granted } = await Audio.requestPermissionsAsync()
//             if (!granted) {
//                 Alert.alert('Permission denied', 'Microphone access is required')
//                 return
//             }

//             await Audio.setAudioModeAsync({
//                 allowsRecordingIOS: true,
//                 playsInSilentModeIOS: true,
//             })

//             const { recording } = await Audio.Recording.createAsync(
//                 Audio.RecordingOptionsPresets.HIGH_QUALITY,
//                 (status) => {
//                     // Comment out this entire block to disable silence detection
//                     if (status.isRecording && status.metering !== undefined) {
//                         const db = status.metering  // value in dB, e.g. -160 is silence
//                         const SILENCE_THRESHOLD = -40  // tweak: lower = more sensitive

//                         if (db < SILENCE_THRESHOLD) {
//                             if (!silenceTimerRef.current) {
//                                 silenceTimerRef.current = setTimeout(() => {
//                                     stopAndProcess()
//                                 }, SILENCE_TIMEOUT)
//                             }
//                         } else {
//                             if (silenceTimerRef.current) {
//                                 clearTimeout(silenceTimerRef.current)
//                                 silenceTimerRef.current = null
//                             }
//                         }
//                     }
//                 },
//                 100
//             )

//             // Comment out these 3 lines to disable max duration
//             maxDurationTimerRef.current = setTimeout(() => {
//                 stopAndProcess()
//             }, MAX_DURATION)

//             recordingRef.current = recording
//             setIsListening(true)
//         } catch (err) {
//             console.error('Failed to start recording:', err)
//             Alert.alert('Error', 'Could not start recording')
//         }
//     }

//     const stopAndProcess = async () => {

//         if (silenceTimerRef.current) {
//             clearTimeout(silenceTimerRef.current)
//             silenceTimerRef.current = null
//         }
//         if (maxDurationTimerRef.current) {
//             clearTimeout(maxDurationTimerRef.current)
//             maxDurationTimerRef.current = null
//         }

//         try {
//             setIsListening(false)
//             setIsProcessing(true)

//             const recording = recordingRef.current
//             if (!recording) {
//                 console.log('❌ No recording found in ref')
//                 return
//             }

//             await recording.stopAndUnloadAsync()
//             await Audio.setAudioModeAsync({ allowsRecordingIOS: false })

//             const uri = recording.getURI()
//             console.log('🎙️ Recording URI:', uri)
//             if (!uri) throw new Error('No recording URI')

//             recordingRef.current = null

//             const formData = new FormData()

//             if (uri.startsWith('blob:')) {
//                 const blobRes = await fetch(uri)
//                 const blob = await blobRes.blob()
//                 const file = new File([blob], 'recording.m4a', { type: 'audio/m4a' })
//                 formData.append('file', file)
//             } else {
//                 formData.append('file', {
//                     uri,
//                     name: 'recording.m4a',
//                     type: 'audio/m4a',
//                 } as any)
//             }

//             formData.append('model', 'whisper-large-v3-turbo')

//             const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${GROQ_API_KEY}`,
//                 },
//                 body: formData,
//             })

//             const whisperData = await whisperRes.json()
//             const transcript = whisperData.text

//             if (!transcript) throw new Error('No transcript returned')

//             const chatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${GROQ_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     model: 'llama-3.1-8b-instant',
//                     messages: [
//                         {
//                             role: 'system',
//                             content: `You are a financial transaction parser. 
// Extract transaction details from the user's speech and return ONLY valid JSON in this exact shape:
// {
//   "title": string,
//   "amount": number,
//   "type": "income" | "expense",
//   "category": string
// }
// Rules:
// - amount must be a plain number (no currency symbols)
// - If the user says "spent", "paid", "bought" → type is "expense"
// - If the user says "received", "earned", "got paid" → type is "income"

// For EXPENSE, category MUST be one of: Food, Bills/Utilities, Family, Healthcare, Fuel, Phone/Internet, Education, Entertainment, Shopping, Travel, Socializing, Transportation, Housing, Miscellaneous
// For INCOME, category MUST be one of: Salary, Business, Freelance, Investments, Refund, Side Hustle, Gift/Bonus, Rental Income

// Category rules:
// - Food → eating, restaurants, groceries, snacks
// - Bills/Utilities → electricity, water, gas bills
// - Healthcare → hospital, medicine, doctor
// - Fuel → petrol, diesel, gas station
// - Phone/Internet → data, airtime, subscription
// - Transportation → bus, uber, taxi, ride
// - Travel → flights, hotels, trips
// - Socializing → hangouts, drinks, outings
// - Housing → rent, repairs, furniture
// - Salary → income from a job or employer
// - Freelance → client work, contracts, gigs
// - Investments → stocks, crypto, dividends, returns
// - Side Hustle → small business, extra income streams
// - Gift/Bonus → money received as a gift or bonus
// - Rental Income → money from renting out property
// - Business → income from running a business
// - Refund → money returned or reimbursed
// - If unclear → use Miscellaneous for expenses, Business for income

// Return ONLY the JSON object, no extra text`,
//                         },
//                         {
//                             role: 'user',
//                             content: transcript,
//                         },
//                     ],
//                 }),
//             })

//             const chatData = await chatRes.json()
//             const raw = chatData.choices?.[0]?.message?.content

//             if (!raw) throw new Error('No response from LLM')

//             // Strip markdown code fences if model wraps JSON in them
//             const cleaned = raw.replace(/```json|```/g, '').trim()
//             const parsed = JSON.parse(cleaned)
//             setParsedVoice(parsed)

//         } catch (err) {
//             console.error('Processing error:', err)
//             Alert.alert('Error', 'Could not process your voice input. Try again.')
//         } finally {
//             setIsProcessing(false)
//         }
//     }

//     const handleMicPress = () => {
//         if (isListening) {
//             stopAndProcess()
//         } else {
//             startRecording()
//         }
//     }

//     const statusText = isProcessing
//         ? 'Processing...'
//         : isListening
//             ? 'Listening... tap to stop'
//             : 'Tap the mic and say something like:\n"Spent 5k on food"'

//     return (
//         <View style={tw`items-center my-8`}>
//             <Text style={tw`mb-6 text-base text-center ${isDark ? 'text-white' : 'text-black'}`}>
//                 {statusText}
//             </Text>

//             {isListening && (
//                 <WaveformVisualizer
//                     isListening={isListening}
//                     barCount={20}
//                     color={isDark ? '#fff' : '#000'}
//                 />
//             )}

//             <Pressable
//                 onPress={handleMicPress}
//                 disabled={isProcessing}
//                 style={[
//                     tw`mt-4 w-20 h-20 rounded-full items-center justify-center`,
//                     {
//                         backgroundColor: isListening
//                             ? '#ef4444'
//                             : isProcessing
//                                 ? '#d1d5db'
//                                 : '#f3f4f6',
//                     },
//                 ]}
//             >
//                 <MaterialCommunityIcons
//                     name={isListening ? 'microphone' : 'microphone-outline'}
//                     size={40}
//                     color={isListening ? '#fff' : '#000'}
//                 />
//             </Pressable>

//             {parsedVoice && (
//                 <View style={tw`mt-6 w-full rounded-xl p-4 bg-gray-100`}>
//                     <Text weight='semibold' style={tw`text-base mb-2`}>Detected Transaction:</Text>
//                     <Text>Title: {parsedVoice.title}</Text>
//                     <Text>Amount: ₦{parsedVoice.amount?.toLocaleString()}</Text>
//                     <Text>Type: {parsedVoice.type}</Text>
//                     <Text>Category: {parsedVoice.category}</Text>
//                 </View>
//             )}
//         </View>
//     )
// }