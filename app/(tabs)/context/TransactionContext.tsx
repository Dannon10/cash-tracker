import { createContext, ReactNode, useContext, useState } from 'react'
import { Transaction } from '../../../types/transactions'

type TransactionContextType = {
    transactions: Transaction[]
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: '1',
            title: 'Netflix Subscription',
            amount: -4500,
            date: 'Feb 18, 2026',
            category: 'Entertainment'
        },
        {
            id: '2',
            title: 'Salary',
            amount: 250000,
            date: 'Feb 15, 2026',
            category: 'Salary'
        },
        {
            id: '3',
            title: 'Transfer to John',
            amount: -20000,
            date: 'Feb 12, 2026',
            category: 'Fuel'
        },
    ])

    return (
        <TransactionContext.Provider value={{ transactions, setTransactions }}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionContext)
    if (!context) throw new Error('useTransactions must be used inside TransactionProvider')
    return context
}
