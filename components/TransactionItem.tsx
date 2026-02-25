import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Alert, Pressable, View } from 'react-native'
import { Text } from '@/components/AppText'
import { Swipeable } from 'react-native-gesture-handler'
import tw from 'twrnc'
import { Transaction } from '../types/transactions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { useThemeStore } from '../store/useThemeStore'
import { ReactNode } from 'react'

type Props = {
    item: Transaction
    onDelete: (id: string) => void
    onEdit: (item: Transaction) => void
}

export default function TransactionItem({ item, onDelete, onEdit }: Props) {
    const { isDark } = useThemeStore()
    const categoryData = EXPENSE_CATEGORIES.find((cat) => cat.label === item.category)
        || INCOME_CATEGORIES.find((cat) => cat.label === item.category)

    const cardBg = isDark ? '#1a1a1a' : '#ffffff'
    const borderColor = isDark ? '#2a2a2a' : '#f3f4f6'
    const textPrimary = isDark ? '#ffffff' : '#1f2937'
    const textSecondary = isDark ? '#9ca3af' : '#6b7280'

    const renderRightActions = () => (
        <View style={tw`flex-row items-center gap-2 mb-3 ml-2`}>
            {/* Edit button */}
            <Pressable
                onPress={() => onEdit(item)}
                style={tw`bg-blue-50 w-14 h-full justify-center items-center rounded-xl`}
            >
                <AntDesign name="edit" size={22} color="#3b82f6" />
            </Pressable>

            {/* Delete button */}
            <Pressable
                onPress={() => {
                    Alert.alert(
                        'Delete Transaction',
                        `Are you sure you want to delete "${item.title}"?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) }
                        ]
                    )
                }}
                style={tw`bg-[#FEEAEA] w-14 h-full justify-center items-center rounded-xl`}
            >
                <AntDesign name="delete" size={22} color="red" />
            </Pressable>
        </View>
    )

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={[
                tw`rounded-xl p-4 mb-3 flex-row items-center gap-3`,
                { backgroundColor: cardBg, borderWidth: 1, borderColor }
            ]}>
                {/* Category Icon */}
                <View style={[
                    tw`w-11 h-11 rounded-full items-center justify-center`,
                    { backgroundColor: categoryData?.color ?? '#f3f4f6' }
                ]}>
                    {categoryData ? (categoryData.icon as ReactNode) : (
                        <MaterialCommunityIcons name="tag-outline" size={20} color="#9ca3af" />
                    )}
                </View>

                {/* Content */}
                <View style={tw`flex-1`}>
                    <View style={tw`flex-row justify-between items-center mb-1`}>
                        <Text weight='medium' style={[tw`text-base`, { color: textPrimary }]}>
                            {item.title}
                        </Text>
                        <Text weight='semibold' style={[
                            tw`text-base`,
                            { color: item.type === 'income' ? '#16a34a' : '#ef4444' }
                        ]}>
                            {item.type === 'income' ? '+' : '-'}₦{Math.abs(item.amount).toLocaleString()}
                        </Text>
                    </View>
                    <View style={tw`flex-row justify-between items-center`}>
                        <Text style={[tw`text-xs`, { color: textSecondary }]}>
                            {item.category || 'Uncategorized'}
                        </Text>
                        <Text style={[tw`text-xs`, { color: textSecondary }]}>
                            {item.date?.slice(0, 10)}
                        </Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    )
}