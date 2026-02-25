import { View } from 'react-native'
import { Text } from '@/components/AppText'
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
            <Text weight='bold' style={[tw`text-2xl`, { color: textPrimary }]}>
                Reports
            </Text>
            <Text style={[tw`text-sm mt-1`, { color: textSecondary }]}>
                Overview of your spending
            </Text>
        </View>
    )
}