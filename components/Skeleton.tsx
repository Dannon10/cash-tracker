import { View, ViewStyle } from 'react-native'
import tw from 'twrnc'
import { useThemeStore } from '../store/useThemeStore'

type Props = {
    width?: number | string
    height?: number | string
    style?: ViewStyle | ViewStyle[]
    borderRadius?: number
}

export default function Skeleton({ width = '100%', height = 16, style, borderRadius = 6 }: Props) {
    const { isDark } = useThemeStore()
    const bg = isDark ? '#2a2a2a' : '#e5e7eb'

    return (
        <View
            style={[
                { width, height, backgroundColor: bg, borderRadius },
                tw`animate-pulse`,
                style as any,
            ]}
        />
    )
}
