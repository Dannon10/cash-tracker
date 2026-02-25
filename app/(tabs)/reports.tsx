import { FlatList, View } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useThemeStore } from '../../store/useThemeStore'
import { aggregateByCategory } from '../../utils/aggregateByCategory'
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