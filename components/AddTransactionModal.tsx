import { useState, useRef, useEffect } from 'react'
import {
    Modal,
    View,
    Pressable,
    Animated,
    Easing,
    Dimensions,
    PanResponder,
} from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useTransactionStore } from '../store/useTransactionStore'
import { useThemeStore } from '../store/useThemeStore'
import ManualInput from './ManualInput'
import VoiceInput from './VoiceInput'
import CategoryPicker from './CategoryPicker'

interface AddTransactionModalProps {
    visible: boolean
    onClose: () => void
}

export default function AddTransactionModal({
    visible,
    onClose,
}: AddTransactionModalProps) {
    const { isDark } = useThemeStore()
    const addTransaction = useTransactionStore((state) => state.addTransaction)

    const [mode, setMode] = useState<'manual' | 'voice'>('manual')
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [type, setType] = useState<'income' | 'expense'>('expense')
    const [categoryPickerVisible, setCategoryPickerVisible] = useState(false)
    const [parsedVoice, setParsedVoice] = useState<any>(null)

    const modalBg = isDark ? '#1a1a1a' : '#ffffff'
    const textPrimary = isDark ? '#ffffff' : '#111827'

    const resetForm = () => {
        setTitle('')
        setAmount('')
        setCategory('')
        setType('expense')
        setParsedVoice(null)
    }

    const screenHeight = Dimensions.get('window').height
    const slideAnim = useRef(new Animated.Value(screenHeight)).current
    const backdropOpacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [visible])

    const closeModal = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose()
        })
    }
    
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onMoveShouldSetPanResponder: (_, gesture) => {
                return Math.abs(gesture.dy) > 5
            },

            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    slideAnim.setValue(gesture.dy)
                }
            },

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 120) {
                    closeModal()
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start()
                }
            },
            onPanResponderTerminationRequest: () => false,
        })
    ).current

    const handleAddTransaction = () => {
        if (mode === 'manual') {
            if (!title || !amount) return
            addTransaction({
                title,
                amount: Number(amount),
                date: new Date().toISOString(),
                category,
                type,
            })
        } else if (mode === 'voice' && parsedVoice?.amount) {
            addTransaction({
                ...parsedVoice,
                date: new Date().toISOString(),
            })
        }
        resetForm()
        closeModal()
    }

    return (
        <Modal visible={visible} transparent animationType="none">
            {/* BACKDROP */}
            <Animated.View
                style={[
                    tw`flex-1 bg-black`,
                    {
                        opacity: backdropOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5],
                        }),
                    },
                ]}>
                <Pressable style={tw`flex-1`} onPress={closeModal} />
            </Animated.View>

            {/* MODAL CONTENT */}
            <Animated.View
                style={[
                    tw`absolute left-0 right-0 bottom-0 p-5 rounded-t-3xl`,
                    {
                        backgroundColor: modalBg,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}>
                {/* DRAG HANDLE */}
                <View 
                {...panResponder.panHandlers}
                style={tw`items-center mb-3`}>
                    <View style={tw`w-12 h-1.5 bg-gray-400 rounded-full`} />
                </View>

                {/* HEADER */}
                    <Text weight='bold'
                        style={[tw`text-3xl text-center mb-6 mt-4`, { color: textPrimary }]}>
                        Add New Transaction
                    </Text>

                {/* MODE TOGGLE */}
                <View style={tw`flex-row justify-around mb-8`}>
                    <Pressable
                        onPress={() => setMode('manual')}
                        style={[
                            tw`flex-row px-4 py-2 items-center`,
                            mode === 'manual'
                                ? {
                                    backgroundColor: isDark
                                        ? '#2a2a2a'
                                        : '#e5e7eb',
                                    borderRadius: 999,
                                }
                                : {},
                        ]}
                    >
                        <Text
                        weight='medium'
                            style={[
                                tw`text-lg`,
                                { color: textPrimary },
                            ]}>
                            Manual
                        </Text>
                        <AntDesign name="form" size={22} color={textPrimary} />
                    </Pressable>

                    <Pressable
                        onPress={() => setMode('voice')}
                        style={[
                            tw`flex-row px-4 py-2 items-center`,
                            mode === 'voice'
                                ? {
                                    backgroundColor: isDark
                                        ? '#2a2a2a'
                                        : '#e5e7eb',
                                    borderRadius: 999,
                                }
                                : {},
                        ]}
                    >
                        <Text
                            weight='medium'
                            style={[
                            tw`text-lg`,
                            { color: textPrimary },
                        ]}>
                            Voice
                        </Text>
                        <MaterialCommunityIcons name="microphone-outline" size={22} color={textPrimary} />
                    </Pressable>
                </View>

                {/* INPUTS */}
                {mode === 'manual' && (
                    <ManualInput
                        title={title}
                        setTitle={setTitle}
                        amount={amount}
                        setAmount={setAmount}
                        category={category}
                        setCategory={setCategory}
                        type={type}
                        setType={setType}
                        categoryPickerVisible={categoryPickerVisible}
                        setCategoryPickerVisible={
                            setCategoryPickerVisible
                        }
                    />
                )}

                {mode === 'voice' && (
                    <VoiceInput parsedVoice={parsedVoice} setParsedVoice={setParsedVoice} />
                )}

                {/* SUBMIT */}
                <Pressable
                    onPress={handleAddTransaction}
                    style={[
                        tw`rounded-xl px-6 py-4 mb-6 items-center justify-center`,
                        { backgroundColor: '#0B0B0B' },
                    ]}
                >
                    <Text weight='semibold' style={tw`text-white text-xl`}>Add Transaction</Text>
                </Pressable>
            </Animated.View>

            {/* CATEGORY PICKER */}
            <CategoryPicker
                visible={categoryPickerVisible}
                selected={category}
                onSelect={(cat) => setCategory(cat)}
                onClose={() => setCategoryPickerVisible(false)}
                type={type}
                onTypeChange={(t) => setType(t)}
            />
        </Modal>
    )
}