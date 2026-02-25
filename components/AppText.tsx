import { Text as RNText, TextProps } from 'react-native'

type Weight = 'regular' | 'medium' | 'semibold' | 'bold'

const fontMap: Record<Weight, string> = {
    regular: 'ClashGrotesk',
    medium: 'ClashGroteskMedium',
    semibold: 'ClashGroteskSemiBold',
    bold: 'ClashGroteskBold',
}

interface AppTextProps extends TextProps {
    weight?: Weight
}

export function Text({ style, weight = 'regular', ...props }: AppTextProps) {
    return (
        <RNText
            {...props}
            style={[{ fontFamily: fontMap[weight] }, style]}
        />
    )
}