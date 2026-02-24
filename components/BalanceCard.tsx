import { View, Text } from 'react-native'
import tw from 'twrnc'
import { useTransactionStore } from '../store/useTransactionStore'
import { useThemeStore } from '../store/useThemeStore'
import Skeleton from './Skeleton'

export default function BalanceCard() {
    const transactions = useTransactionStore((state) => state.transactions)
    const loading = useTransactionStore((state) => state.loading)
    const { isDark } = useThemeStore()

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses

    const cardBg = isDark ? '#1a1a1a' : '#0B0B0B'
    const cardBorder = isDark ? '#2a2a2a' : 'transparent'

    if (loading) {
        return (
            <View style={[
                tw`rounded-3xl p-6 gap-2 shadow-md w-full h-[200px]`,
                { backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }
            ]}>
                <Skeleton width={120} height={14} />
                <Skeleton width={'70%'} height={40} />

                <View style={tw`flex-row justify-between mt-4`}> 
                    <View>
                        <Skeleton width={100} height={12} />
                        <Skeleton width={90} height={16} style={{ marginTop: 8 }} />
                    </View>
                    <View style={tw`items-end`}>
                        <Skeleton width={110} height={12} />
                        <Skeleton width={90} height={16} style={{ marginTop: 8 }} />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={[
            tw`rounded-3xl p-6 gap-2 shadow-md w-full h-[200px]`,
            { backgroundColor: cardBg, borderWidth: 1, borderColor: cardBorder }
        ]}>
            <Text style={tw`text-gray-400 text-sm font-medium`}>Total Balance</Text>
            <Text style={tw`text-white text-5xl font-bold mt-1`}>
                ₦{balance.toLocaleString()}
            </Text>

            <View style={tw`flex-row justify-between mt-4`}>
                <View>
                    <Text style={tw`text-gray-500 text-xs mb-0.5`}>Income</Text>
                    <Text style={tw`text-emerald-400 text-sm font-semibold`}>
                        +₦{totalIncome.toLocaleString()}
                    </Text>
                </View>
                <View style={tw`items-end`}>
                    <Text style={tw`text-gray-500 text-xs mb-0.5`}>Spent so far</Text>
                    <Text style={tw`text-rose-400 text-sm font-semibold`}>
                        -₦{totalExpenses.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    )
}