import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useState, useEffect } from 'react'
import { Modal, Pressable, View, ActivityIndicator } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import { useTransactionStore } from '../store/useTransactionStore'
import { useThemeStore } from '../store/useThemeStore'
import { Transaction } from '../types/transactions'
import TransactionInput from './TransactionInput'
import CategoryPicker from './CategoryPicker'

interface EditTransactionModalProps {
    visible: boolean
    transaction: Transaction | null
    onClose: () => void
}

export default function EditTransactionModal({ visible, transaction, onClose }: EditTransactionModalProps) {
    const { isDark } = useThemeStore()
    const { updateTransaction } = useTransactionStore()

    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [type, setType] = useState<'income' | 'expense'>('expense')
    const [categoryPickerVisible, setCategoryPickerVisible] = useState(false)
    const [saving, setSaving] = useState(false)

    // Pre-fill form when transaction changes
    useEffect(() => {
        if (transaction) {
            setTitle(transaction.title)
            setAmount(String(transaction.amount))
            setCategory(transaction.category || '')
            setType(transaction.type ?? 'expense')
        }
    }, [transaction])

    const modalBg = isDark ? '#1a1a1a' : '#ffffff'
    const textPrimary = isDark ? '#ffffff' : '#111827'
    const textSecondary = isDark ? '#9ca3af' : '#6b7280'
    const inputBorder = isDark ? '#2a2a2a' : '#d1d5db'

    const handleSave = async () => {
        if (!title || !amount || !transaction) return
        setSaving(true)
        await updateTransaction(transaction.id, {
            title,
            amount: Number(amount),
            category,
            type,
        })
        setSaving(false)
        onClose()
    }

    return (
        <>
            <Modal visible={visible} transparent animationType="slide">
                <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
                    <View style={[tw`p-5 rounded-t-3xl`, { backgroundColor: modalBg }]}>

                        {/* Header */}
                        <View style={tw`flex-row justify-between items-start mb-6`}>
                            <View>
                                <Text weight='bold' style={[tw`text-3xl mb-2`, { color: textPrimary }]}>
                                    Edit Transaction
                                </Text>
                                <Text style={[tw`text-base`, { color: textSecondary }]}>
                                    Update the details below.
                                </Text>
                            </View>
                            <Pressable onPress={onClose}>
                                <Ionicons name="close-circle-sharp" size={24} color={textPrimary} />
                            </Pressable>
                        </View>

                        {/* Form */}
                        <TransactionInput
                            label="Title"
                            placeholder="Enter transaction title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TransactionInput
                            label="Amount"
                            placeholder="Enter amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />

                        {/* Category */}
                        <Text weight='medium' style={[tw`text-sm mb-1 mt-2`, { color: textSecondary }]}>Category</Text>
                        <Pressable
                            onPress={() => setCategoryPickerVisible(true)}
                            style={[
                                tw`rounded-lg px-4 py-4 mb-3 flex-row justify-between items-center`,
                                { borderWidth: 1, borderColor: inputBorder }
                            ]}
                        >
                            <Text style={[tw`text-base`, { color: category ? textPrimary : textSecondary }]}>
                                {category || 'Select a category'}
                            </Text>
                            <MaterialCommunityIcons name="chevron-down" size={20} color={textSecondary} />
                        </Pressable>

                        {/* Type Selector */}
                        <View style={tw`flex-row justify-around mt-2 mb-6`}>
                            <Pressable
                                onPress={() => setType('income')}
                                style={tw`${type === 'income' ? 'bg-green-500' : 'bg-gray-200'} px-6 py-2 rounded-full`}
                            >
                                <Text weight='medium' style={tw`${type === 'income' ? 'text-white' : 'text-black'}`}>Income</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setType('expense')}
                                style={tw`${type === 'expense' ? 'bg-red-500' : 'bg-gray-200'} px-6 py-2 rounded-full`}
                            >
                                <Text weight='medium' style={tw`${type === 'expense' ? 'text-white' : 'text-black'}`}>Expense</Text>
                            </Pressable>
                        </View>

                        {/* Save Button */}
                        <Pressable
                            onPress={handleSave}
                            disabled={saving}
                            style={[
                                tw`rounded-xl px-6 py-4 mb-8 items-center justify-center flex-row gap-2`,
                                { backgroundColor: saving ? '#6b7280' : '#0B0B0B' }
                            ]}
                        >
                            {saving && <ActivityIndicator size="small" color="white" />}
                            <Text weight='semibold' style={tw`text-white text-xl`}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>

            <CategoryPicker
                visible={categoryPickerVisible}
                selected={category}
                onSelect={(cat) => setCategory(cat)}
                onClose={() => setCategoryPickerVisible(false)}
                type={type}
                onTypeChange={(t) => { if (t) setType(t) }}
                // onTypeChange={(t) => setType(t)}
            />
        </>
    )
}