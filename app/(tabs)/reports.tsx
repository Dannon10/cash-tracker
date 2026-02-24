// import { View, Text, Dimensions, FlatList } from 'react-native'
// import tw from 'twrnc'
// import { PieChart, BarChart } from 'react-native-gifted-charts'
// import { aggregateByCategory } from '../utils/aggregateByCategory'
// import { useTransactionStore } from '../../store/useTransactionStore'
// import { useThemeStore } from '../../store/useThemeStore'
// import EvilIcons from '@expo/vector-icons/EvilIcons'
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
// import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
// import FontAwesome from '@expo/vector-icons/FontAwesome'

// const { width } = Dimensions.get('window')
// const COLORS = 
// [
//     '#6366f1', 
//     '#f43f5e', 
//     '#10b981', 
//     '#f59e0b', 
//     '#3b82f6', 
//     '#ec4899', 
//     '#14b8a6'
// ]

// function getMonthlyBarData(transactions: any[]) {
//     const months: Record<string, { income: number; expense: number }> = {}
//     transactions.forEach((tx) => {
//         const date = new Date(tx.date)
//         const key = date.toLocaleString('default', { month: 'short' })
//         if (!months[key]) months[key] = { income: 0, expense: 0 }
//         if (tx.type === 'income') months[key].income += tx.amount
//         else months[key].expense += Math.abs(tx.amount)
//     })
//     const barData: any[] = []
//     Object.entries(months).forEach(([month, vals]) => {
//         barData.push({ value: vals.expense, label: month, frontColor: '#f43f5e', gradientColor: '#fda4af', spacing: 6, roundedTop: true })
//         barData.push({ value: vals.income, frontColor: '#10b981', gradientColor: '#6ee7b7', roundedTop: true })
//     })
//     return barData
// }

// function getDailyAverage(transactions: any[], type: 'expense' | 'income') {
//     const filtered = transactions.filter(tx => tx.type === type)
//     if (!filtered.length) return 0
//     const dates = filtered.map(tx => new Date(tx.date).toDateString())
//     const uniqueDays = new Set(dates).size
//     const total = filtered.reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
//     return Math.round(total / uniqueDays)
// }

// function getBiggestExpense(transactions: any[]) {
//     const expenses = transactions.filter(tx => tx.type === 'expense')
//     if (!expenses.length) return null
//     return expenses.reduce((max, tx) => Math.abs(tx.amount) > Math.abs(max.amount) ? tx : max, expenses[0])
// }

// function getVsLastMonth(transactions: any[]) {
//     const now = new Date()
//     const thisMonth = now.getMonth()
//     const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
//     const thisMonthTotal = transactions.filter(tx => tx.type === 'expense' && new Date(tx.date).getMonth() === thisMonth).reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
//     const lastMonthTotal = transactions.filter(tx => tx.type === 'expense' && new Date(tx.date).getMonth() === lastMonth).reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
//     if (!lastMonthTotal) return null
//     return Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
// }

// export default function ReportsScreen() {
//     const transactions = useTransactionStore((state) => state.transactions)
//     const { isDark } = useThemeStore()
//     const aggregated = aggregateByCategory(transactions)

//     const totalExpenses = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
//     const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
//     const netBalance = totalIncome - totalExpenses

//     const data = aggregated.map((item, index) => ({
//         value: item.value, color: COLORS[index % COLORS.length],
//         label: item.category, percentage: item.percentage, text: `${item.percentage}%`,
//     }))

//     const hasData = data.length > 0
//     const barData = getMonthlyBarData(transactions)
//     const hasBarData = barData.length > 0
//     const dailyAvg = getDailyAverage(transactions, 'expense')
//     const biggestExpense = getBiggestExpense(transactions)
//     const vsLastMonth = getVsLastMonth(transactions)

//     const bg = isDark ? '#0f0f0f' : '#f9fafb'
//     const cardBg = isDark ? '#1a1a1a' : '#ffffff'
//     const textPrimary = isDark ? '#ffffff' : '#111827'
//     const textSecondary = isDark ? '#9ca3af' : '#6b7280'
//     const dividerColor = isDark ? '#2a2a2a' : '#f3f4f6'
//     const iconColor = isDark ? '#ffffff' : '#000000'

//     const renderContent = () => (
//         <View style={tw`pb-10`}>

//             {/* Header */}
//             <View style={[tw`px-6 pt-14 pb-6`, { backgroundColor: cardBg, borderBottomWidth: 1, borderBottomColor: dividerColor }]}>
//                 <Text style={[tw`text-2xl font-bold`, { color: textPrimary }]}>Reports</Text>
//                 <Text style={[tw`text-sm mt-1`, { color: textSecondary }]}>Overview of your spending</Text>
//             </View>

//             {/* Summary Cards */}
//             <View style={tw`flex-row gap-3 px-5 mt-5`}>
//                 <View style={tw`flex-1 bg-emerald-500 rounded-2xl p-4`}>
//                     <Text style={tw`text-emerald-100 text-xs font-medium mb-1`}>Total Income</Text>
//                     <Text style={tw`text-white text-xl font-bold`}>₦{totalIncome.toLocaleString()}</Text>
//                 </View>
//                 <View style={tw`flex-1 bg-rose-500 rounded-2xl p-4`}>
//                     <Text style={tw`text-rose-100 text-xs font-medium mb-1`}>Total Expenses</Text>
//                     <Text style={tw`text-white text-xl font-bold`}>₦{totalExpenses.toLocaleString()}</Text>
//                 </View>
//             </View>

//             {/* Net Balance */}
//             <View 
//                 style={tw`mx-5 mt-3 rounded-2xl p-4 ${netBalance >= 0 ? 'bg-indigo-500' : 'bg-orange-500'}`}>
//                 <Text 
//                     style={tw`text-indigo-100 text-xs font-medium mb-1`}>Net Balance</Text>
//                 <View 
//                     style={tw`flex-row items-center justify-between`}>
//                     <Text 
//                         style={tw`text-white text-2xl font-bold`}>
//                         {netBalance >= 0 ? '+' : '-'}₦{Math.abs(netBalance).toLocaleString()}
//                     </Text>
//                     {netBalance >= 0
//                         ? <FontAwesome name="line-chart" size={24} color="white" />
//                         : <Text style={tw`text-2xl`}>📉</Text>}
//                 </View>
//             </View>

//             {/* Donut Chart + Breakdown */}
//             <View style={[tw`mx-5 mt-5 rounded-3xl p-6`, { backgroundColor: cardBg }]}>
//                 <View style={tw`flex-row items-center gap-2 mb-1`}>
//                     <SimpleLineIcons name="pie-chart" size={20} color={iconColor} />
//                     <Text style={[tw`text-lg font-bold`, { color: textPrimary }]}>Expenses by Category</Text>
//                 </View>
//                 <Text style={[tw`text-xs mb-6`, { color: textSecondary }]}>
//                     {hasData ? `${data.length} categories tracked` : 'No transactions yet'}
//                 </Text>

//                 {hasData ? (
//                     <>
//                         <View style={tw`items-center`}>
//                             <PieChart
//                                 data={data}
//                                 donut
//                                 innerRadius={60}
//                                 radius={150}
//                                 showText
//                                 textSize={12}
//                                 textColor="#fff"
//                                 fontWeight="bold"
//                                 innerCircleColor={isDark ? '#0f0f0f' : '#ffffff'}
//                                 centerLabelComponent={() => (
//                                     <View
//                                         style={[
//                                             tw`items-center justify-center`,
//                                             {
//                                                 width: 120,
//                                                 height: 120,
//                                                 borderRadius: 60,
//                                                 backgroundColor: isDark ? '#0f0f0f' : '#ffffff',
//                                             },
//                                         ]}
//                                     >
//                                         <Text style={[tw`text-2xl font-bold`, { color: isDark ? '#ffffff' : '#111827' }]}>
//                                             ₦{totalExpenses.toLocaleString()}
//                                         </Text>
//                                         <Text style={[tw`text-xs mt-1`, { color: textSecondary }]}>Total Spent</Text>
//                                     </View>
//                                 )}
//                             />
//                         </View>

//                         <View style={[tw`h-px my-5`, { backgroundColor: dividerColor }]} />

//                         <Text style={[tw`text-base font-bold mb-4`, { color: textPrimary }]}>Breakdown</Text>
//                         {data.map((item, index) => (
//                             <View key={index} style={tw`mb-4`}>
//                                 <View style={tw`flex-row justify-between items-center mb-1`}>
//                                     <View style={tw`flex-row items-center gap-2`}>
//                                         <View style={[tw`w-3 h-3 rounded-full`, { backgroundColor: item.color }]} />
//                                         <Text style={[tw`text-sm font-medium`, { color: textPrimary }]}>{item.label}</Text>
//                                     </View>
//                                     <View style={tw`flex-row items-center gap-3`}>
//                                         <Text style={[tw`text-xs`, { color: textSecondary }]}>{item.percentage}%</Text>
//                                         <Text style={[tw`text-sm font-semibold`, { color: textPrimary }]}>₦{item.value.toLocaleString()}</Text>
//                                     </View>
//                                 </View>
//                                 <View style={[tw`h-1.5 rounded-full overflow-hidden`, { backgroundColor: dividerColor }]}>
//                                     <View style={[tw`h-full rounded-full`, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
//                                 </View>
//                             </View>
//                         ))}
//                     </>
//                 ) : (
//                     <View style={tw`items-center py-10`}>
//                         <EvilIcons name="chart" size={60} color={textSecondary} />
//                         <Text style={[tw`text-sm text-center mt-2`, { color: textSecondary }]}>
//                             Add some transactions to{'\n'}see your spending breakdown
//                         </Text>
//                     </View>
//                 )}
//             </View>

//             {/* Insights */}
//             {(dailyAvg > 0 || biggestExpense || vsLastMonth !== null) && (
//                 <View style={tw`px-5 mt-5 gap-3`}>
//                     <Text style={[tw`text-base font-bold`, { color: textPrimary }]}>Insights</Text>
//                     <View style={tw`flex-row gap-3`}>
//                         {dailyAvg > 0 && (
//                             <View style={[tw`flex-1 rounded-2xl p-4`, { backgroundColor: cardBg }]}>
//                                 <EvilIcons name="calendar" size={40} color={iconColor} />
//                                 <Text style={[tw`text-xs mb-1 mt-1`, { color: textSecondary }]}>Daily Avg Spend</Text>
//                                 <Text style={[tw`text-base font-bold`, { color: textPrimary }]}>₦{dailyAvg.toLocaleString()}</Text>
//                             </View>
//                         )}
//                         {vsLastMonth !== null && (
//                             <View style={[tw`flex-1 rounded-2xl p-4`, { backgroundColor: cardBg }]}>
//                                 <Text style={tw`text-2xl mb-1`}>{vsLastMonth > 0 ? '🔺' : '🔻'}</Text>
//                                 <Text style={[tw`text-xs mb-1`, { color: textSecondary }]}>vs Last Month</Text>
//                                 <Text style={tw`text-base font-bold ${vsLastMonth > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
//                                     {vsLastMonth > 0 ? '+' : ''}{vsLastMonth}%
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                     {biggestExpense && (
//                         <View style={[tw`rounded-2xl p-4 flex-row items-center justify-between`, { backgroundColor: cardBg }]}>
//                             <View style={tw`flex-row items-center gap-3`}>
//                                 <FontAwesome5 name="money-bill-alt" size={24} color={iconColor} />
//                                 <View>
//                                     <Text style={[tw`text-xs`, { color: textSecondary }]}>Biggest Expense</Text>
//                                     <Text style={[tw`text-sm font-semibold`, { color: textPrimary }]}>{biggestExpense.title}</Text>
//                                     <Text style={[tw`text-xs`, { color: textSecondary }]}>{biggestExpense.category}</Text>
//                                 </View>
//                             </View>
//                             <Text style={tw`text-base font-bold text-rose-500`}>₦{Math.abs(biggestExpense.amount).toLocaleString()}</Text>
//                         </View>
//                     )}
//                 </View>
//             )}

//             {/* Monthly Trend */}
//             {hasBarData && (
//                 <View style={[tw`mx-5 mt-5 rounded-3xl p-6`, { backgroundColor: cardBg }]}>
//                     <View style={tw`flex-row items-center gap-2 mb-1`}>
//                         <SimpleLineIcons name="chart" size={20} color={iconColor} />
//                         <Text style={[tw`text-lg font-bold`, { color: textPrimary }]}>Monthly Trend</Text>
//                     </View>
//                     <View style={tw`flex-row gap-4 mb-5`}>
//                         <View style={tw`flex-row items-center gap-1.5`}>
//                             <View style={tw`w-3 h-3 rounded-full bg-rose-400`} />
//                             <Text style={[tw`text-xs`, { color: textSecondary }]}>Expenses</Text>
//                         </View>
//                         <View style={tw`flex-row items-center gap-1.5`}>
//                             <View style={tw`w-3 h-3 rounded-full bg-emerald-400`} />
//                             <Text style={[tw`text-xs`, { color: textSecondary }]}>Income</Text>
//                         </View>
//                     </View>
//                     <BarChart
//                         data={barData} barWidth={18} spacing={20} hideRules
//                         xAxisThickness={0} yAxisThickness={0}
//                         yAxisTextStyle={{ color: textSecondary, fontSize: 12 }}
//                         xAxisLabelTextStyle={{ color: textSecondary }}
//                         noOfSections={4}
//                         maxValue={Math.max(...barData.map(b => b.value)) * 1.2}
//                         isAnimated showGradient width={width - 100} height={180}
//                         backgroundColor={cardBg}
//                     />
//                 </View>
//             )}
//         </View>
//     )

//     return (
//         <FlatList
//             style={[tw`flex-1`, { backgroundColor: bg }]}
//             data={[]} keyExtractor={() => 'key'} renderItem={null}
//             ListHeaderComponent={renderContent} showsVerticalScrollIndicator={false}
//         />
//     )
// }






import { FlatList, View, Text } from 'react-native'
import tw from 'twrnc'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useThemeStore } from '../../store/useThemeStore'
import { aggregateByCategory } from '../utils/aggregateByCategory'
import ReportsHeader from '../../components/ReportsHeader'
import SummaryCards from '../../components/SummaryCard'
import NetBalanceCard from '../../components/NetBalanceCard'
import CategoryDonut from '../../components/PieCharts'
import InsightsSection from '../../components/InsightsSection'
import MonthlyTrend from '../../components/MonthlyTrend'

export default function ReportsScreen() {
    const transactions = useTransactionStore((state) => state.transactions)
    const { isDark } = useThemeStore()

    const aggregated = aggregateByCategory(transactions)

    const totalExpenses = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0)

    const netBalance = totalIncome - totalExpenses

    const dailyAvg = (() => {
        const expenses = transactions.filter(tx => tx.type === 'expense')
        if (!expenses.length) return 0

        const uniqueDays = new Set(
            expenses.map(tx => new Date(tx.date).toDateString())
        ).size

        const total = expenses.reduce(
            (sum, tx) => sum + Math.abs(tx.amount),
            0
        )

        return Math.round(total / uniqueDays)
    })()

    const biggestExpense = (() => {
        const expenses = transactions.filter(tx => tx.type === 'expense')
        if (!expenses.length) return null

        return expenses.reduce((max, tx) =>
            Math.abs(tx.amount) > Math.abs(max.amount) ? tx : max
        )
    })()

    const vsLastMonth = (() => {
        const now = new Date()
        const thisMonth = now.getMonth()
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1

        const thisMonthTotal = transactions
            .filter(
                tx =>
                    tx.type === 'expense' &&
                    new Date(tx.date).getMonth() === thisMonth
            )
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

        const lastMonthTotal = transactions
            .filter(
                tx =>
                    tx.type === 'expense' &&
                    new Date(tx.date).getMonth() === lastMonth
            )
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

        if (!lastMonthTotal) return null

        return Math.round(
            ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        )
    })()


    const barData = (() => {
        const months: Record<string, { income: number; expense: number }> = {}

        transactions.forEach(tx => {
            const date = new Date(tx.date)
            const key = date.toLocaleString('default', { month: 'short' })

            if (!months[key]) months[key] = { income: 0, expense: 0 }

            if (tx.type === 'income') {
                months[key].income += tx.amount
            } else {
                months[key].expense += Math.abs(tx.amount)
            }
        })

        const result: any[] = []

        Object.entries(months).forEach(([month, vals]) => {
            result.push({
                value: vals.expense,
                label: month,
                frontColor: '#f43f5e',
                gradientColor: '#fda4af',
                spacing: 6,
                roundedTop: true,
            })

            result.push({
                value: vals.income,
                frontColor: '#10b981',
                gradientColor: '#6ee7b7',
                roundedTop: true,
            })
        })

        return result
    })()

    const bg = isDark ? '#0f0f0f' : '#f9fafb'
    const cardBg = isDark ? '#1a1a1a' : '#ffffff'
    const textPrimary = isDark ? '#ffffff' : '#111827'
    const textSecondary = isDark ? '#9ca3af' : '#6b7280'
    const dividerColor = isDark ? '#2a2a2a' : '#f3f4f6'

    return (
        <FlatList
            style={[tw`flex-1`, { backgroundColor: bg }]}
            data={[]}
            renderItem={null}
            ListHeaderComponent={
                <View style={tw`pb-10`}>

                    {/* <ReportsHeader
                        cardBg={cardBg}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        dividerColor={dividerColor}
                    /> */}

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

                    <SummaryCards
                        totalIncome={totalIncome}
                        totalExpenses={totalExpenses}
                    />

                    <NetBalanceCard netBalance={netBalance} />

                    <CategoryDonut
                        aggregated={aggregated}
                        totalExpenses={totalExpenses}
                        isDark={isDark}
                        theme={{ cardBg, textPrimary, textSecondary, dividerColor }}
                    />

                    <InsightsSection
                        dailyAvg={dailyAvg}
                        biggestExpense={biggestExpense}
                        vsLastMonth={vsLastMonth}
                        theme={{ cardBg, textPrimary, textSecondary }}
                    />

                    <MonthlyTrend
                        barData={barData}
                        isDark={isDark}
                        theme={{ cardBg, textPrimary, textSecondary }}
                    />
                </View>
            }
            showsVerticalScrollIndicator={false}
        />
    )
}