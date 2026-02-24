import { View, Text } from 'react-native'
import tw from 'twrnc'

interface Props {
    cardBg: string
    textPrimary: string
    textSecondary: string
    dividerColor: string
}

export default function ReportsHeader({
    cardBg,
    textPrimary,
    textSecondary,
    dividerColor,
}: Props) {
    return (
        <View
            style={[
                tw`px-6 pt-14 pb-6`,
                { backgroundColor: cardBg, borderBottomWidth: 1, borderBottomColor: dividerColor },
            ]}
        >
            <Text style={[tw`text-2xl font-bold`, { color: textPrimary }]}>
                Reports
            </Text>
            <Text style={[tw`text-sm mt-1`, { color: textSecondary }]}>
                Overview of your spending
            </Text>
        </View>
    )
}