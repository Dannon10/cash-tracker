import { View, Text, Dimensions } from 'react-native'
import tw from 'twrnc'
import { BarChart } from 'react-native-gifted-charts'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'

const { width } = Dimensions.get('window')

interface Props {
    barData: any[]
    isDark: boolean
    theme: {
        cardBg: string
        textPrimary: string
        textSecondary: string
    }
}

export default function MonthlyTrend({
    barData,
    isDark,
    theme,
}: Props) {
    const { cardBg, textPrimary, textSecondary } = theme

    if (!barData.length) return null

    return (
        <View style={[tw`mx-5 mt-5 rounded-3xl p-6`, { backgroundColor: cardBg }]}>
            <View style={tw`flex-row items-center gap-2 mb-1`}>
                <SimpleLineIcons name="chart" size={20} color={textPrimary} />
                <Text style={[tw`text-lg font-bold`, { color: textPrimary }]}>
                    Monthly Trend
                </Text>
            </View>

            <BarChart
                data={barData}
                barWidth={18}
                spacing={20}
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: textSecondary }}
                xAxisLabelTextStyle={{ color: textSecondary }}
                noOfSections={4}
                maxValue={Math.max(...barData.map(b => b.value)) * 1.2}
                isAnimated
                showGradient
                width={width - 100}
                height={180}
                backgroundColor={cardBg}
            />
        </View>
    )
}