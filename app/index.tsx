import { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Dimensions, Animated, Image } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";

const { width } = Dimensions.get("window")

// --- Typewriter hook ---
function TypewriterText({ text, style }: { text: string; style: any }) {
    const [displayed, setDisplayed] = useState("")

    useEffect(() => {
        setDisplayed("")
        let i = 0
        const interval = setInterval(() => {
            i++
            setDisplayed(text.slice(0, i))
            if (i >= text.length) clearInterval(interval)
        }, 40)
        return () => clearInterval(interval)
    }, [text])

    return <Text style={style}>{displayed}</Text>
}

// --- Auto-switching image component ---
function FadingImage({ images }: { images: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const opacity = useRef(new Animated.Value(1)).current

    useEffect(() => {
        if (images.length <= 1) return

        const interval = setInterval(() => {
            // Fade out
            Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length)
                // Fade in
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start()
            })
        }, 2800)

        return () => clearInterval(interval)
    }, [images.length])

    return (
        <Animated.Image
            source={images[currentIndex]}
            style={[
                {
                    width: '100%',
                    height: '100%',
                    borderRadius: 16,
                    resizeMode: 'cover',
                },
                { opacity }
            ]}
        />
    )
}

// --- Phone frame wrapper ---
function PhoneFrame({ images, label }: { images: any[]; label?: string }) {
    return (
        <View style={tw`items-center`}>
            {/* Phone frame */}
            <View style={[
                tw`rounded-3xl overflow-hidden`,
                {
                    width: width * 0.62,
                    height: width * 0.62 * 1.85,
                    backgroundColor: '#1a1a1a',
                    borderWidth: 3,
                    borderColor: '#333333',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 20 },
                    shadowOpacity: 0.6,
                    shadowRadius: 30,
                    elevation: 20,
                }
            ]}>
                {/* Notch */}
                <View style={tw`items-center pt-2 pb-1`}>
                    <View style={[tw`rounded-full`, { width: 60, height: 6, backgroundColor: '#333' }]} />
                </View>

                {/* Screen content */}
                <View style={tw`flex-1 overflow-hidden`}>
                    <FadingImage images={images} />
                </View>
            </View>

            {/* Optional label below frame */}
            {label && (
                <View style={tw`flex-row items-center gap-2 mt-3`}>
                    <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: '#ffffff50' }]} />
                    <Text style={tw`text-xs text-gray-500`}>{label}</Text>
                    <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: '#ffffff50' }]} />
                </View>
            )}
        </View>
    )
}

// --- Slides config ---
const SLIDES = [
    {
        type: 'text',
        emoji: '💰',
        headline: "Know where your\nmoney goes",
        subtitle: "Stop guessing. Start tracking every naira with clarity and ease.",
        typewriter: true,
    },
    {
        type: 'image',
        images: [
            require('../assets/images/onboarding-add-manual.jpg'),
            require('../assets/images/onboarding-add-voice1.jpg'),
        ],
        frameLabel: 'Manual & Voice input',
        headline: "Add transactions\nin seconds",
        subtitle: "Type it manually or speak it — logging expenses has never been faster.",
        typewriter: false,
    },
    {
        type: 'image',
        images: [
            require('../assets/images/onboarding-report.jpg'),
        ],
        frameLabel: 'Reports & Insights',
        headline: "See your spending\npatterns",
        subtitle: "Beautiful charts and smart insights to help you spend better every month.",
        typewriter: false,
    },
]

export default function Index() {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current
    const flatListRef = useRef<any>(null)

    const goToNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            const next = currentIndex + 1
            flatListRef.current?.scrollToIndex({ index: next, animated: true })
            setCurrentIndex(next)
        } else {
            router.replace('/auth/login')
        }
    }

    const isLast = currentIndex === SLIDES.length - 1

    return (
        <View style={tw`flex-1 bg-[#0B0B0B]`}>

            {/* Skip */}
            <View style={tw`items-end pt-16 px-8`}>
                <TouchableOpacity onPress={() => router.replace('/auth/login')} style={tw`px-4 py-2`}>
                    <Text style={tw`text-base text-gray-400`}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Slides */}
            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width)
                    setCurrentIndex(index)
                }}
                renderItem={({ item, index }: { item: any; index: number }) => (
                    <View style={[tw`items-center justify-center px-8`, { width }]}>

                        {/* Visual area */}
                        {item.type === 'text' ? (
                            <>
                                <Text style={tw`text-5xl font-bold text-white mb-6`}>Cash Tracker</Text>
                                <Text style={{ fontSize: 90, marginBottom: 32 }}>{item.emoji}</Text>
                            </>
                        ) : (
                            <View style={tw`mb-6`}>
                                <PhoneFrame images={item.images} label={item.frameLabel} />
                            </View>
                        )}

                        {/* Headline */}
                        <View style={tw`mb-4 items-center`}>
                            {item.typewriter && index === currentIndex ? (
                                <TypewriterText
                                    text={item.headline}
                                    style={tw`text-2xl font-bold text-white text-center`}
                                />
                            ) : (
                                <Text style={tw`text-3xl font-bold text-white text-center`}>
                                    {item.headline}
                                </Text>
                            )}
                        </View>

                        {/* Subtitle */}
                        <Text style={tw`text-sm text-gray-400 text-center leading-relaxed px-2`}>
                            {item.subtitle}
                        </Text>

                    </View>
                )}
            />

            {/* Bottom */}
            <View style={tw`px-8 pb-14 items-center gap-6`}>

                {/* Dots */}
                <View style={tw`flex-row gap-2`}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [8, 24, 8],
                            extrapolate: 'clamp',
                        })
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        })
                        return (
                            <Animated.View
                                key={i}
                                style={[tw`h-2 rounded-full bg-white`, { width: dotWidth, opacity }]}
                            />
                        )
                    })}
                </View>

                {/* CTA */}
                <TouchableOpacity
                    onPress={goToNext}
                    style={tw`w-full bg-white py-4 rounded-2xl items-center`}
                >
                    <Text style={tw`text-[#0B0B0B] text-lg font-bold`}>
                        {isLast ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}