// utils/aggregateByCategory.ts
import { Transaction } from '@/types/transactions'

export function aggregateByCategory(transactions: Transaction[]) {
    const result: Record<string, number> = {}

    transactions.forEach((tx) => {
        if (!result[tx.category]) {
            result[tx.category] = 0
        }
        result[tx.category] += Math.abs(tx.amount) // use absolute value for chart
    })

    const total = Object.values(result).reduce((a, b) => a + b, 0)

    return Object.keys(result).map((category) => ({
        category,
        value: result[category],
        percentage: Math.round((result[category] / total) * 100),
    }))
}
