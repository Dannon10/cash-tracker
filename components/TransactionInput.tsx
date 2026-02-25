import { View, TextInput, TextInputProps } from 'react-native'
import { Text } from '@/components/AppText'
import tw from 'twrnc'
import { useThemeStore } from '../store/useThemeStore'

interface TransactionInputProps extends TextInputProps {
    label: string
    error?: string
    numericOnly?: boolean   // ✅ NEW
}

export default function TransactionInput({
    label,
    error,
    numericOnly,
    onChangeText,
    ...props
}: TransactionInputProps) {

    const { isDark } = useThemeStore()

    const textPrimary = isDark ? '#ffffff' : '#111827'
    const textSecondary = isDark ? '#9ca3af' : '#374151'
    const borderColor = error ? '#ef4444' : isDark ? '#2a2a2a' : '#d1d5db'
    const inputBg = isDark ? '#0f0f0f' : '#ffffff'

    const handleChange = (text: string) => {
        if (numericOnly) {
            // ✅ Allow only numbers and optional decimal point
            const filtered = text.replace(/[^0-9.]/g, '')

            // Prevent multiple decimal points
            const parts = filtered.split('.')
            if (parts.length > 2) return

            onChangeText?.(filtered)
        } else {
            onChangeText?.(text)
        }
    }

    return (
        <View style={tw`mb-3`}>
            <Text
                weight='semibold'
                style={[tw`text-lg mb-3`, { color: textSecondary }]}>
                {label}
            </Text>

            <TextInput
                style={[
                    tw`rounded-lg p-4 mb-4`,
                    {
                        borderWidth: 1,
                        borderColor,
                        backgroundColor: inputBg,
                        color: textPrimary
                    }
                ]}
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                keyboardType={numericOnly ? 'numeric' : 'default'}
                onChangeText={handleChange}
                {...props}
            />

            {error && (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                    {error}
                </Text>
            )}
        </View>
    )
}