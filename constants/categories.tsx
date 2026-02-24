import { ReactNode } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export interface Category {
    label: string
    icon: ReactNode
    color: string
    type: 'income' | 'expense'
}

export const EXPENSE_CATEGORIES: Category[] = [
    {
        label: 'Food',
        icon: <MaterialCommunityIcons name="food" size={28} color="#f97316" />,
        color: '#fff7ed',
        type: 'expense',
    },
    {
        label: 'Bills/Utilities',
        icon: <MaterialCommunityIcons name="lightning-bolt" size={28} color="#eab308" />,
        color: '#fefce8',
        type: 'expense',
    },
    {
        label: 'Family',
        icon: <MaterialCommunityIcons name="human-male-female-child" size={28} color="#ec4899" />,
        color: '#fdf2f8',
        type: 'expense',
    },
    {
        label: 'Healthcare',
        icon: <MaterialCommunityIcons name="hospital-box" size={28} color="#ef4444" />,
        color: '#fef2f2',
        type: 'expense',
    },
    {
        label: 'Fuel',
        icon: <MaterialCommunityIcons name="gas-station" size={28} color="#6b7280" />,
        color: '#f9fafb',
        type: 'expense',
    },
    {
        label: 'Phone/Internet',
        icon: <MaterialCommunityIcons name="wifi" size={28} color="#3b82f6" />,
        color: '#eff6ff',
        type: 'expense',
    },
    {
        label: 'Education',
        icon: <MaterialCommunityIcons name="school" size={28} color="#8b5cf6" />,
        color: '#f5f3ff',
        type: 'expense',
    },
    {
        label: 'Entertainment',
        icon: <MaterialCommunityIcons name="television-play" size={28} color="#f43f5e" />,
        color: '#fff1f2',
        type: 'expense',
    },
    {
        label: 'Shopping',
        icon: <MaterialCommunityIcons name="shopping" size={28} color="#10b981" />,
        color: '#f0fdf4',
        type: 'expense',
    },
    {
        label: 'Travel',
        icon: <MaterialCommunityIcons name="airplane" size={28} color="#0ea5e9" />,
        color: '#f0f9ff',
        type: 'expense',
    },
    {
        label: 'Socializing',
        icon: <MaterialCommunityIcons name="glass-cocktail" size={28} color="#a855f7" />,
        color: '#faf5ff',
        type: 'expense',
    },
    {
        label: 'Transportation',
        icon: <MaterialCommunityIcons name="bus" size={28} color="#0284c7" />,
        color: '#f0f9ff',
        type: 'expense',
    },
    {
        label: 'Housing',
        icon: <MaterialCommunityIcons name="home" size={28} color="#ca8a04" />,
        color: '#fefce8',
        type: 'expense',
    },
    {
        label: 'Miscellaneous',
        icon: <MaterialCommunityIcons name="dots-horizontal-circle" size={28} color="#9ca3af" />,
        color: '#f9fafb',
        type: 'expense',
    },
]

export const INCOME_CATEGORIES: Category[] = [
    {
        label: 'Salary',
        icon: <MaterialCommunityIcons name="briefcase" size={28} color="#10b981" />,
        color: '#f0fdf4',
        type: 'income',
    },
    {
        label: 'Business',
        icon: <MaterialCommunityIcons name="store" size={28} color="#16a34a" />,
        color: '#f0fdf4',
        type: 'income',
    },
    {
        label: 'Freelance',
        icon: <MaterialCommunityIcons name="laptop" size={28} color="#059669" />,
        color: '#ecfdf5',
        type: 'income',
    },
    {
        label: 'Investments',
        icon: <MaterialCommunityIcons name="chart-line" size={28} color="#22c55e" />,
        color: '#f0fdf4',
        type: 'income',
    },
    {
        label: 'Refund',
        icon: <MaterialCommunityIcons name="cash-refund" size={28} color="#14b8a6" />,
        color: '#f0fdfa',
        type: 'income',
    },
    {
        label: 'Side Hustle',
        icon: <MaterialCommunityIcons name="briefcase-plus" size={28} color="#15803d" />,
        color: '#f0fdf4',
        type: 'income',
    },
    {
        label: 'Gift/Bonus',
        icon: <MaterialCommunityIcons name="gift" size={28} color="#22c55e" />,
        color: '#f0fdf4',
        type: 'income',
    },
    {
        label: 'Rental Income',
        icon: <MaterialCommunityIcons name="home-outline" size={28} color="#16a34a" />,
        color: '#f0fdf4',
        type: 'income',
    },
]