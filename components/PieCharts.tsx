import { View, Text } from 'react-native'
import tw from 'twrnc'
import { PieChart } from 'react-native-gifted-charts'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'

const COLORS = [
  '#6366f1',
  '#f43f5e',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
]

interface Props {
  aggregated: any[]
  totalExpenses: number
  isDark: boolean
  theme: {
    cardBg: string
    textPrimary: string
    textSecondary: string
    dividerColor: string
  }
}

export default function PieCharts({
  aggregated,
  totalExpenses,
  isDark,
  theme,
}: Props) {
  const { cardBg, textPrimary, textSecondary, dividerColor } = theme

  const data = aggregated.map((item, index) => ({
    value: item.value,
    color: COLORS[index % COLORS.length],
    label: item.category,
    percentage: item.percentage,
    text: `${item.percentage}%`,
  }))

  const hasData = data.length > 0

  return (
    <View style={[tw`mx-5 mt-5 rounded-3xl p-6`, { backgroundColor: cardBg }]}>
      <View style={tw`flex-row items-center gap-2 mb-1`}>
        <SimpleLineIcons name="pie-chart" size={20} color={textPrimary} />
        <Text style={[tw`text-lg font-bold`, { color: textPrimary }]}>
          Expenses by Category
        </Text>
      </View>

      <Text style={[tw`text-xs mb-6`, { color: textSecondary }]}>
        {hasData ? `${data.length} categories tracked` : 'No transactions yet'}
      </Text>

      {hasData ? (
        <>
          <View style={tw`items-center`}>
            <PieChart
              data={data}
              donut
              innerRadius={60}
              radius={140}
              showText
              textColor="#fff"
              innerCircleColor={isDark ? '#0f0f0f' : '#ffffff'}
              centerLabelComponent={() => (
                <View style={tw`items-center`}>
                  <Text style={[tw`text-2xl font-bold`, { color: textPrimary }]}>
                    ₦{totalExpenses.toLocaleString()}
                  </Text>
                  <Text style={[tw`text-xs mt-1`, { color: textSecondary }]}>
                    Total Spent
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={[tw`h-px my-5`, { backgroundColor: dividerColor }]} />

          <Text style={[tw`text-base font-bold mb-4`, { color: textPrimary }]}>
            Breakdown
          </Text>

          {data.map((item, index) => (
            <View key={index} style={tw`mb-4`}>
              <View style={tw`flex-row justify-between items-center mb-1`}>
                <View style={tw`flex-row items-center gap-2`}>
                  <View
                    style={[
                      tw`w-3 h-3 rounded-full`,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={[tw`text-sm font-medium`, { color: textPrimary }]}>
                    {item.label}
                  </Text>
                </View>

                <View style={tw`flex-row items-center gap-3`}>
                  <Text style={[tw`text-xs`, { color: textSecondary }]}>
                    {item.percentage}%
                  </Text>
                  <Text style={[tw`text-sm font-semibold`, { color: textPrimary }]}>
                    ₦{item.value.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  tw`h-1.5 rounded-full overflow-hidden`,
                  { backgroundColor: dividerColor },
                ]}
              >
                <View
                  style={[
                    tw`h-full rounded-full`,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </>
      ) : (
        <View style={tw`items-center py-10`}>
          <EvilIcons name="chart" size={60} color={textSecondary} />
          <Text style={[tw`text-sm text-center mt-2`, { color: textSecondary }]}>
            Add some transactions to{'\n'}see your spending breakdown
          </Text>
        </View>
      )}
    </View>
  )
}