import { View } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import { PieChart } from 'react-native-gifted-charts'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'

const COLORS = [
  '#f97316', // Food - orange
  '#eab308', // Bills/Utilities - yellow
  '#ec4899', // Family - pink
  '#ef4444', // Healthcare - red
  '#6b7280', // Fuel - gray
  '#3b82f6', // Phone/Internet - blue
  '#8b5cf6', // Education - violet
  '#f43f5e', // Entertainment - rose
  '#10b981', // Shopping - emerald
  '#0ea5e9', // Travel - sky
  '#a855f7', // Socializing - purple
  '#0284c7', // Transportation - light blue
  '#ca8a04', // Housing - amber
  '#9ca3af', // Miscellaneous - cool gray
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
        <Text weight='bold' style={[tw`text-lg`, { color: textPrimary }]}>
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
                  <Text 
                    weight='bold' 
                    style={[tw`text-2xl`, 
                      { color: textPrimary }]}>
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

          <Text weight='bold' style={[tw`text-base mb-4`, { color: textPrimary }]}>
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
                  <Text weight='medium' style={[tw`text-sm`, { color: textPrimary }]}>
                    {item.label}
                  </Text>
                </View>

                <View style={tw`flex-row items-center gap-3`}>
                  <Text style={[tw`text-xs`, { color: textSecondary }]}>
                    {item.percentage}%
                  </Text>
                  <Text weight='semibold' style={[tw`text-sm`, { color: textPrimary }]}>
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