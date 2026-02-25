import { ReactNode, useState, useEffect } from 'react'
import { Modal, View, Pressable, ScrollView } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { useThemeStore } from '../store/useThemeStore'

interface CategoryPickerProps {
    visible: boolean
    selected: string
    onSelect: (category: string) => void
    onClose: () => void
    type?: 'income' | 'expense'
    onTypeChange?: (type: 'income' | 'expense') => void
}

export default function CategoryPicker({ visible, selected, onSelect, onClose, type = 'expense', onTypeChange }: CategoryPickerProps) {
    const { isDark } = useThemeStore()
    const [currentType, setCurrentType] = useState<'income' | 'expense'>(type)

    useEffect(() => { setCurrentType(type) }, [type])

    const categories = currentType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

    const handleTypeSwitch = (t: 'income' | 'expense') => {
        setCurrentType(t)
        onTypeChange?.(t)
    }

    const sheetBg = isDark ? '#1a1a1a' : '#ffffff'
    const textPrimary = isDark ? '#ffffff' : '#111827'
    const textSecondary = isDark ? '#9ca3af' : '#6b7280'
    const toggleInactive = isDark ? '#2a2a2a' : '#f3f4f6'

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={tw`flex-1 justify-end bg-black bg-opacity-60`}>
                <View style={[tw`rounded-t-3xl p-5`, { backgroundColor: sheetBg }]}>

                    {/* Header */}
                    <View style={tw`flex-row justify-between items-center mb-3`}>
                        <Text 
                            weight='bold' 
                            style={[tw`text-xl`, 
                            { color: isDark ? textPrimary : textSecondary }]}>Select Category</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close-circle-sharp" size={28} color={isDark ? '#ffffff' : '#000000'} />
                        </Pressable>
                    </View>

                    {/* Type Toggle */}
                    <View style={tw`flex-row justify-center items-center gap-3 mb-4`}>
                        <Pressable
                            onPress={() => handleTypeSwitch('expense')}
                            style={[
                                tw`px-3 py-2 rounded-full flex-row items-center gap-2`,
                                { backgroundColor: currentType === 'expense' ? '#fee2e2' : toggleInactive }
                            ]}
                        >
                            <View style={tw`w-2 h-2 rounded-full bg-red-500`} />
                            <Text style={{ color: currentType === 'expense' ? '#dc2626' : textSecondary, fontWeight: '500' }}>
                                Expense
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handleTypeSwitch('income')}
                            style={[
                                tw`px-3 py-2 rounded-full flex-row items-center gap-2`,
                                { backgroundColor: currentType === 'income' ? '#dcfce7' : toggleInactive }
                            ]}
                        >
                            <View style={tw`w-2 h-2 rounded-full bg-green-600`} />
                            <Text style={{ color: currentType === 'income' ? '#16a34a' : textSecondary, fontWeight: '500' }}>
                                Income
                            </Text>
                        </Pressable>
                    </View>

                    {/* Category Grid */}
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 440 }} contentContainerStyle={{ paddingBottom: 40 }}>
                        <View style={tw`flex-row flex-wrap justify-center gap-3`}>
                            {categories.map((cat) => {
                                const isSelected = selected === cat.label
                                return (
                                    <Pressable
                                        key={cat.label}
                                        onPress={() => { onSelect(cat.label); onClose() }}
                                        style={[
                                            tw`items-center justify-center rounded-2xl p-3 m-1`,
                                            {
                                                backgroundColor: isSelected ? '#0B0B0B' : isDark ? '#2a2a2a' : cat.color,
                                                width: '28%',
                                                borderWidth: 1,
                                                borderColor: isSelected ? '#0B0B0B' : isDark ? '#3a3a3a' : '#e5e7eb',
                                            }
                                        ]}
                                    >
                                        <View style={[
                                            tw`w-12 h-12 rounded-full items-center justify-center mb-2`,
                                            { backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : isDark ? '#1a1a1a' : 'white' }
                                        ]}>
                                            {cat.icon as ReactNode}
                                        </View>

                                        <Text
                                            numberOfLines={2}
                                            weight='medium'
                                            style={[
                                                tw`text-xs text-center`,
                                                { color: isSelected ? 'white' : isDark ? '#e5e7eb' : '#374151' }
                                            ]}
                                        >
                                            {cat.label}
                                        </Text>

                                        <View style={tw`absolute top-2 right-2`}>
                                            <View style={[tw`w-2 h-2 rounded-full`, { backgroundColor: currentType === 'income' ? '#16a34a' : '#ef4444' }]} />
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}