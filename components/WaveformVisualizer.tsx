import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    cancelAnimation,
    Easing,
} from 'react-native-reanimated'
import tw from 'twrnc'

const BAR_MIN_HEIGHT = 6
const BAR_MAX_HEIGHT = 48

interface WaveBarProps {
    isListening: boolean
    delay: number
    maxHeight: number
    duration: number
    color: string
}

function WaveBar({ isListening, delay, maxHeight, duration, color }: WaveBarProps) {
    const height = useSharedValue(BAR_MIN_HEIGHT)

    useEffect(() => {
        if (isListening) {
            height.value = withDelay(
                delay,
                withRepeat(
                    withTiming(maxHeight, {
                        duration,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    -1,
                    true
                )
            )
        } else {
            cancelAnimation(height)
            height.value = withTiming(BAR_MIN_HEIGHT, { duration: 300 })
        }
    }, [isListening])

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }))

    return (
        <Animated.View
            style={[
                tw`w-1 rounded-full mx-0.5`,
                { backgroundColor: color },
                animatedStyle,
            ]}
        />
    )
}

interface WaveformVisualizerProps {
    isListening: boolean
    barCount?: number
    color?: string
}

function WaveformVisualizer({
    isListening,
    barCount = 20,
    color = '#000000',
}: WaveformVisualizerProps) {
    const barsConfig = useRef(
        Array.from({ length: barCount }, (_, i) => ({
            id: i,
            delay: i * 40,
            maxHeight: BAR_MAX_HEIGHT * (0.4 + Math.random() * 0.6),
            duration: 300 + Math.random() * 300,
        }))
    ).current

    return (
        <View style={tw`flex-row items-center justify-center px-2 h-16`}>
            {barsConfig.map((bar) => (
                <WaveBar
                    key={bar.id}
                    isListening={isListening}
                    delay={bar.delay}
                    maxHeight={bar.maxHeight}
                    duration={bar.duration}
                    color={color}
                />
            ))}
        </View>
    )
}

export default WaveformVisualizer