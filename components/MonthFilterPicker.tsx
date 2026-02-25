import { useState } from 'react'
import { Modal, Pressable, View, ScrollView } from 'react-native'
import { Text } from '@/components/AppText'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import tw from 'twrnc'
import { useThemeStore } from '../store/useThemeStore'

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

interface MonthFilterPickerProps {
    selectedMonth: number | null
    activeMonths: Set<number>
    onSelect: (month: number | null) => void
}

export default function MonthFilterPicker({
        selectedMonth, activeMonths, onSelect 
    }: MonthFilterPickerProps) {
        
    const { isDark } = useThemeStore()
    const [open, setOpen] = useState(false)

    const pillBg = isDark ? '#1a1a1a' : '#f3f4f6'
    const pillText = isDark ? '#ffffff' : '#111827'
    const modalBg = isDark ? '#1a1a1a' : '#ffffff'
    const textPrimary = isDark ? '#ffffff' : '#111827'
    const textSecondary = isDark ? '#9ca3af' : '#6b7280'
    const dividerColor = isDark ? '#2a2a2a' : '#f3f4f6'
    const activeRowBg = isDark ? '#2a2a2a' : '#f9fafb'

    const label = selectedMonth === null ? 'All' : MONTHS[selectedMonth]

    const options: { label: string; value: number | null }[] = [
        { label: 'All', value: null },
        ...Array.from(activeMonths)
            .sort((a, b) => a - b)
            .map((m) => ({ label: MONTHS[m], value: m })),
    ]

    return (
        <>
            {/* Pill trigger */}
            <Pressable
                onPress={() => setOpen(true)}
                style={[
                    tw`flex-row items-center gap-1 px-4 py-2 rounded-full self-start mt-5`,
                    { backgroundColor: pillBg }
                ]}
            >
                <Text weight='semibold' style={[tw`text-sm`, { color: pillText }]}>{label}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color={pillText} />
            </Pressable>

            {/* Dropdown modal */}
            <Modal visible={open} transparent animationType="slide">
                <View style={tw`flex-1 justify-end bg-black bg-opacity-40`}>
                    <View style={[tw`rounded-t-3xl p-5`, { backgroundColor: modalBg }]}>

                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text weight='bold' style={[tw`text-lg`, { color: textPrimary }]}>Filter by Month</Text>
                            <Pressable onPress={() => setOpen(false)}>
                                <Ionicons name="close-circle-sharp" size={26} color={textPrimary} />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {options.map((opt, index) => {
                                const isSelected = selectedMonth === opt.value
                                return (
                                    <Pressable
                                        key={opt.label}
                                        onPress={() => {
                                            onSelect(opt.value)
                                            setOpen(false)
                                        }}
                                        style={[
                                            tw`flex-row items-center justify-between px-4 py-4 rounded-xl mb-1`,
                                            { backgroundColor: isSelected ? activeRowBg : 'transparent' }
                                        ]}
                                    >
                                        <Text style={[
                                            tw`text-base`,
                                            { color: isSelected ? textPrimary : textSecondary, fontWeight: isSelected ? '600' : '400' }
                                        ]}>
                                            {opt.label}
                                        </Text>
                                        {isSelected && (
                                            <MaterialCommunityIcons name="check" size={20} color={isDark ? '#ffffff' : '#0B0B0B'} />
                                        )}
                                    </Pressable>
                                )
                            })}
                        </ScrollView>

                        <View style={[tw`h-px my-3`, { backgroundColor: dividerColor }]} />

                        <Pressable
                            onPress={() => setOpen(false)}
                            style={tw`py-4 items-center`}
                        >
                            <Text weight='semibold' style={[tw`text-base`, { color: textSecondary }]}>Cancel</Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>
        </>
    )
}