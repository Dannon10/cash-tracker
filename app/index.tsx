import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Dimensions, Animated, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Text } from '@/components/AppText'
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";

const { width, height } = Dimensions.get("window")

const STATUSBAR_H = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44
const SKIP_H = STATUSBAR_H + 48
const BOTTOM_H = 130
const SLIDE_H = height - SKIP_H - BOTTOM_H

const isSmall = height < 700
const isMedium = height < 850

const phoneFrameWidth = isSmall ? width * 0.5 : isMedium ? width * 0.56 : width * 0.62
const phoneFrameHeight = phoneFrameWidth * 1.85
const emojiSize = isSmall ? 52 : isMedium ? 68 : 84
const headlineSize = isSmall ? 18 : isMedium ? 22 : 26
const subtitleSize = isSmall ? 11 : 13
const gapSm = isSmall ? 8 : 16

async function completeOnboarding(router: any) {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true')
    router.replace('/auth/login')
}

function TypewriterText({ text, size }: { text: string; size: number }) {
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
    return (
        <Text
            weight="bold"
            style={{ fontSize: size, color: '#fff', textAlign: 'center' }}
        >
            {displayed}
        </Text>
    )
}

function FadingImage({ images }: { images: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const opacity = useRef(new Animated.Value(1)).current
    useEffect(() => {
        if (images.length <= 1) return
        const interval = setInterval(() => {
            Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
                setCurrentIndex(prev => (prev + 1) % images.length)
                Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start()
            })
        }, 2800)
        return () => clearInterval(interval)
    }, [images.length])
    return (
        <Animated.Image
            source={images[currentIndex]}
            style={[tw`w-full h-full rounded-2xl`, 
                { resizeMode: 'cover', opacity }]}
        />
    )
}

function PhoneFrame({ images, label }: { images: any[]; label?: string }) {
    return (
        <View style={tw`items-center`}>
            <View style={[tw`rounded-3xl overflow-hidden`, {
                width: phoneFrameWidth,
                height: phoneFrameHeight,
                backgroundColor: '#1a1a1a',
                borderWidth: 3,
                borderColor: '#333',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.5,
                shadowRadius: 24,
                elevation: 16,
            }]}>
                <View style={tw`items-center pt-2 pb-1`}>
                    <View style={[tw`rounded-full`, { width: 52, height: 5, backgroundColor: '#333' }]} />
                </View>
                <View style={tw`flex-1 overflow-hidden`}>
                    <FadingImage images={images} />
                </View>
            </View>
            {label && (
                <View style={tw`flex-row items-center gap-2 mt-2`}>
                    <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: '#ffffff30' }]} />
                    <Text style={tw`text-xs text-gray-500`}>{label}</Text>
                    <View style={[tw`w-1.5 h-1.5 rounded-full`, { backgroundColor: '#ffffff30' }]} />
                </View>
            )}
        </View>
    )
}

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
            require('../assets/images/onboarding-manual.jpg'),
            require('../assets/images/onboarding-voice.jpg'),
        ],
        frameLabel: 'Manual & Voice input',
        headline: "Add transactions\nin seconds",
        subtitle: "Type it manually or speak it — logging expenses has never been faster.",
        typewriter: false,
    },
    {
        type: 'image',
        images: [require('../assets/images/onboarding-report1.jpg')],
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
            completeOnboarding(router)
        }
    }

    return (
        <View style={tw`flex-1 bg-[#0B0B0B]`}>

            {/* Skip */}
            <View style={[tw`items-end justify-end px-8 pb-2`, { height: SKIP_H }]}>
                <TouchableOpacity onPress={() => completeOnboarding(router)} style={tw`px-4 py-2`}>
                    <Text style={tw`text-gray-400 text-base`}>Skip</Text>
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
                style={{ width, height: SLIDE_H }}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width)
                    setCurrentIndex(index)
                }}
                renderItem={({ item, index }: { item: any; index: number }) => (
                    <View style={{
                        width,
                        height: SLIDE_H,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 32,
                    }}>
                        {/* Visual */}
                        {item.type === 'text' ? (
                            <View style={{ alignItems: 'center', marginBottom: gapSm }}>
                                <Text weight="bold" style={tw`text-4xl text-white mb-2 text-center`}>
                                    Cash Tracker
                                </Text>
                                <Text style={{ fontSize: emojiSize }}>{item.emoji}</Text>
                            </View>
                        ) : (
                            <View style={{ marginBottom: gapSm }}>
                                <PhoneFrame images={item.images} label={item.frameLabel} />
                            </View>
                        )}

                        {/* Headline */}
                        <View style={{ alignItems: 'center', marginBottom: gapSm }}>
                            {item.typewriter && index === currentIndex ? (
                                <TypewriterText text={item.headline} size={headlineSize} />
                            ) : (
                                    <Text weight="bold" style={tw`text-3xl text-white mb-2 text-center`}>
                                    {item.headline}
                                </Text>
                            )}
                        </View>

                        {/* Subtitle */}
                        <Text style={{ fontSize: subtitleSize, color: '#9ca3af', textAlign: 'center', lineHeight: subtitleSize * 1.65, paddingHorizontal: 4 }}>
                            {item.subtitle}
                        </Text>
                    </View>
                )}
            />

            {/* Bottom */}
            <View 
                style={[tw`px-8 justify-center gap-4`, 
                    { height: BOTTOM_H }]}>
                <View 
                    style={tw`flex-row justify-center gap-2`}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' })
                        const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' })
                        return (
                            <Animated.View
                                key={i}
                                style={[tw`h-2 rounded-full bg-white`, 
                                    { width: dotWidth, opacity: dotOpacity }]}
                            />
                        )
                    })}
                </View>

                <TouchableOpacity 
                    onPress={goToNext} 
                    style={tw`w-full bg-white py-4 rounded-2xl items-center`}>
                    <Text 
                        weight="bold"   
                            style={tw`text-[#0B0B0B] text-lg`}>
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}