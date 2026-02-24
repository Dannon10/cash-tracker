import { View, Text, Pressable } from 'react-native'
import tw from 'twrnc'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import TransactionInput from './TransactionInput'

interface ManualInputProps {
    title: string
    setTitle: (t: string) => void
    amount: string
    setAmount: (a: string) => void
    category: string
    setCategory: (c: string) => void
    type: 'income' | 'expense'
    setType: (t: 'income' | 'expense') => void
    categoryPickerVisible: boolean
    setCategoryPickerVisible: (v: boolean) => void
}

export default function ManualInput({
    title, setTitle, amount, setAmount,
    category, setCategory, type, setType,
    categoryPickerVisible, setCategoryPickerVisible
}: ManualInputProps) {
    return (
        <View style={tw`mb-6`}>
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

            <Text
                style={tw`text-sm font-medium mb-1 mt-2`}>
                Category
            </Text>
            <Pressable
                onPress={() =>
                    setCategoryPickerVisible(true)}
                style={tw`rounded-lg px-4 py-4 mb-3 flex-row justify-between items-center border border-gray-300`}>
                <Text
                    style={tw`text-base`}>
                    {category || 'Select a category'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="gray" />
            </Pressable>

            <View style={tw`flex-row justify-around mt-2 mb-4`}>
                <Pressable
                    onPress={() => setType('income')}
                    style={tw`${type === 'income' ? 'bg-green-500' : 'bg-gray-200'} px-4 py-2 rounded-full`}>
                    <Text
                        style={tw`${type === 'income' ? 'text-white' : 'text-black'}`}>Income</Text>
                </Pressable>
                <Pressable onPress={() =>
                    setType('expense')}
                    style={tw`${type === 'expense' ? 'bg-red-500' : 'bg-gray-200'} px-4 py-2 rounded-full`}>
                    <Text
                        style={tw`${type === 'expense' ? 'text-white' : 'text-black'}`}>Expense</Text>
                </Pressable>
            </View>
        </View>
    )
}