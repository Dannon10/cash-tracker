import BalanceCard from '@/components/BalanceCard'
import TransactionsList from '@/components/TransactionsList'
import MonthFilterPicker from '@/components/MonthFilterPicker'
import { View, ScrollView, RefreshControl, Platform } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useState, useMemo, useEffect } from 'react'
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

    useEffect(() => {
        if (user) fetchTransactions()
    }, [user])

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchTransactions()
        setRefreshing(false)
    }

    const activeMonths = useMemo(() => {
        const monthSet = new Set<number>()
        transactions.forEach((tx) => {
            monthSet.add(new Date(tx.date).getMonth())
        })
        return monthSet
    }, [transactions])

    const filteredTransactions = useMemo(() => {
        if (selectedMonth === null) return transactions
        return transactions.filter((tx) => new Date(tx.date).getMonth() === selectedMonth)
    }, [transactions, selectedMonth])

    return (
        <View style={[tw`flex-1 ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`, { flex: 1 }]}>
            <ScrollView
                style={{ flex: 1 }}
                nestedScrollEnabled={true}
                contentContainerStyle={[
                    tw`py-10 px-5 pb-32`,
                    // @ts-ignore
                    Platform.OS === 'web' && { minHeight: '100%' }
                ]}
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
                <Text weight='bold' style={tw`text-3xl ${isDark ? 'text-white' : 'text-black'}`}>
                    Hello 👋, {displayName}
                </Text>

                <Text style={tw`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                    Track your everyday expenses
                </Text>

                <BalanceCard />

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