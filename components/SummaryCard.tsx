import { View } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'

interface Props {
    totalIncome: number
    totalExpenses: number
}

export default function SummaryCards({ totalIncome, totalExpenses }: Props) {
    return (
        <View style={tw`flex-row gap-3 px-5 mt-5`}>
            <View style={tw`flex-1 bg-emerald-500 rounded-2xl p-4`}>
                <Text style={tw`text-emerald-100 text-xs mb-1`}>
                    Total Income
                </Text>
                <Text weight='bold' style={tw`text-white text-xl`}>
                    ₦{totalIncome.toLocaleString()}
                </Text>
            </View>

            <View style={tw`flex-1 bg-rose-500 rounded-2xl p-4`}>
                <Text style={tw`text-rose-100 text-xs mb-1`}>
                    Total Expenses
                </Text>
                <Text weight='bold' style={tw`text-white text-xl`}>
                    ₦{totalExpenses.toLocaleString()}
                </Text>
            </View>
        </View>
    )
}