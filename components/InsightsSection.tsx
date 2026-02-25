import { View } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

interface Props {
    dailyAvg: number
    biggestExpense: any
    vsLastMonth: number | null
    theme: {
        cardBg: string
        textPrimary: string
        textSecondary: string
    }
}

export default function InsightsSection({
    dailyAvg,
    biggestExpense,
    vsLastMonth,
    theme,
}: Props) {
    const { cardBg, textPrimary, textSecondary } = theme

    if (!dailyAvg && !biggestExpense && vsLastMonth === null) return null

    return (
        <View style={tw`px-5 mt-5 gap-3`}>
            <Text weight='bold' style={[tw`text-base`, { color: textPrimary }]}>
                Insights
            </Text>

            <View style={tw`flex-row gap-3`}>
                {dailyAvg > 0 && (
                    <View style={[tw`flex-1 rounded-2xl p-4`, { backgroundColor: cardBg }]}>
                        <EvilIcons name="calendar" size={40} color={textPrimary} />
                        <Text weight='medium' style={[tw`text-xs mt-1`, { color: textSecondary }]}>
                            Daily Avg Spend
                        </Text>
                        <Text weight='bold' style={[tw`text-base`, { color: textPrimary }]}>
                            ₦{dailyAvg.toLocaleString()}
                        </Text>
                    </View>
                )}

                {vsLastMonth !== null && (
                    <View style={[tw`flex-1 rounded-2xl p-4`, { backgroundColor: cardBg }]}>
                        <Text style={tw`text-2xl`}>
                            {vsLastMonth > 0 ? '🔺' : '🔻'}
                        </Text>
                        <Text style={[tw`text-xs`, { color: textSecondary }]}>
                            vs Last Month
                        </Text>
                        <Text
                            weight='bold'
                            style={tw`text-base ${vsLastMonth > 0 ? 'text-rose-500' : 'text-emerald-500'
                                }`}>
                            {vsLastMonth > 0 ? '+' : ''}
                            {vsLastMonth}%
                        </Text>
                    </View>
                )}
            </View>

            {biggestExpense && (
                <View
                    style={[
                        tw`rounded-2xl p-4 flex-row items-center justify-between`,
                        { backgroundColor: cardBg },
                    ]}
                >
                    <View style={tw`flex-row items-center gap-3`}>
                        <FontAwesome5 name="money-bill-alt" size={24} color={textPrimary} />
                        <View>
                            <Text style={[tw`text-xs`, { color: textSecondary }]}>
                                Biggest Expense
                            </Text>
                            <Text weight='semibold' style={[tw`text-sm`, { color: textPrimary }]}>
                                {biggestExpense.title}
                            </Text>
                            <Text style={[tw`text-xs`, { color: textSecondary }]}>
                                {biggestExpense.category}
                            </Text>
                        </View>
                    </View>

                    <Text weight='bold' style={tw`text-base text-rose-500`}>
                        ₦{Math.abs(biggestExpense.amount).toLocaleString()}
                    </Text>
                </View>
            )}
        </View>
    )
}