import BalanceCard from '@/components/BalanceCard'
import TransactionsList from '@/components/TransactionsList'
import MonthFilterPicker from '@/components/MonthFilterPicker'
import { View, Text, ScrollView, RefreshControl } from 'react-native'
import tw from 'twrnc'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useState, useMemo } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useThemeStore } from '../../store/useThemeStore'

export default function TransactionsScreen() {
    const { user } = useAuthStore()
    const { isDark } = useThemeStore()
    const transactions = useTransactionStore((state) => state.transactions)
    const { fetchTransactions } = useTransactionStore()
    const [refreshing, setRefreshing] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth())

    const fullName = user?.user_metadata?.full_name || ''
    const displayName = fullName.trim().split(' ')[0] || ''

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchTransactions()
        setRefreshing(false)
    }

    // Months that have at least one transaction
    const activeMonths = useMemo(() => {
        const monthSet = new Set<number>()
        transactions.forEach((tx) => {
            monthSet.add(new Date(tx.date).getMonth())
        })
        return monthSet
    }, [transactions])

    // Filtered list
    const filteredTransactions = useMemo(() => {
        if (selectedMonth === null) return transactions
        return transactions.filter((tx) => new Date(tx.date).getMonth() === selectedMonth)
    }, [transactions, selectedMonth])

    return (
        <View style={tw`flex-1 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
            <ScrollView
                contentContainerStyle={tw`py-10 px-5`}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={isDark ? '#ffffff' : '#0B0B0B'}
                        colors={['#0B0B0B']}
                    />
                }
            >
                <Text style={tw`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    Hello 👋, {displayName}
                </Text>

                <Text style={tw`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                    Track your everyday expenses
                </Text>

                <BalanceCard />

                {/* Month filter — single pill with dropdown */}
                <MonthFilterPicker
                    selectedMonth={selectedMonth}
                    activeMonths={activeMonths}
                    onSelect={setSelectedMonth}
                />

                <TransactionsList transactions={filteredTransactions} />
            </ScrollView>
        </View>
    )
}