import { create } from 'zustand'
import { Transaction } from '../types/transactions'
import { supabase } from '../lib/supabase'

interface TransactionState {
    transactions: Transaction[]
    loading: boolean
    fetchTransactions: () => Promise<void>
    addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>
    updateTransaction: (id: string, tx: Partial<Omit<Transaction, 'id'>>) => Promise<void>
    deleteTransaction: (id: string) => Promise<void>
    setTransactions: (txs: Transaction[]) => void
    totalIncome: () => number
    totalExpenses: () => number
    balance: () => number
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    loading: false,

    setTransactions: (txs) => set({ transactions: txs }),

    fetchTransactions: async () => {
        set({ loading: true })
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching transactions:', error.message)
            set({ loading: false })
            return
        }

        const mapped: Transaction[] = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            amount: row.amount,
            date: row.date,
            category: row.category,
            type: row.type,
        }))

        set({ transactions: mapped, loading: false })
    },

    addTransaction: async (tx) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                title: tx.title,
                amount: tx.amount,
                date: tx.date,
                category: tx.category,
                type: tx.type,
            })
            .select()
            .single()

        if (error) {
            console.error('Error adding transaction:', error.message)
            return
        }

        set((state) => ({
            transactions: [{ id: data.id, title: data.title, amount: data.amount, date: data.date, category: data.category, type: data.type }, ...state.transactions],
        }))
    },

    updateTransaction: async (id, tx) => {
        const { data, error } = await supabase
            .from('transactions')
            .update({
                ...(tx.title !== undefined && { title: tx.title }),
                ...(tx.amount !== undefined && { amount: tx.amount }),
                ...(tx.date !== undefined && { date: tx.date }),
                ...(tx.category !== undefined && { category: tx.category }),
                ...(tx.type !== undefined && { type: tx.type }),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating transaction:', error.message)
            return
        }

        set((state) => ({
            transactions: state.transactions.map((t) =>
                t.id === id
                    ? { ...t, title: data.title, amount: data.amount, date: data.date, category: data.category, type: data.type }
                    : t
            ),
        }))
    },

    deleteTransaction: async (id) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting transaction:', error.message)
            return
        }

        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
        }))
    },

    totalIncome: () =>
        get().transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),

    totalExpenses: () =>
        get().transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),

    balance: () => {
        const income = get().transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expenses = get().transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        return income - expenses
    },
}))