// types/transaction.ts

export type Transaction = {
  id: string
  title: string
  amount: number
  date: string
  category: string
  type?: 'income' | 'expense'
}

