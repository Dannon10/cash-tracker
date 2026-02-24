import { View, Text, TextInput, TextInputProps } from 'react-native'
import tw from 'twrnc'
import { useThemeStore } from '../store/useThemeStore'

interface TransactionInputProps extends TextInputProps {
    label: string
    error?: string
}

export default function TransactionInput({ label, error, ...props }: TransactionInputProps) {
    const { isDark } = useThemeStore()

    const textPrimary = isDark ? '#ffffff' : '#111827'
    const textSecondary = isDark ? '#9ca3af' : '#374151'
    const borderColor = error ? '#ef4444' : isDark ? '#2a2a2a' : '#d1d5db'
    const inputBg = isDark ? '#0f0f0f' : '#ffffff'

    return (
        <View style={tw`mb-3`}>
            <Text style={[tw`text-lg mb-3 font-semibold`, { color: textSecondary }]}>{label}</Text>
            <TextInput
                style={[
                    tw`rounded-lg p-4 mb-4`,
                    { borderWidth: 1, borderColor, backgroundColor: inputBg, color: textPrimary }
                ]}
                placeholderTextColor={isDark ? '#4b5563' : '#9ca3af'}
                {...props}
            />
            {error && <Text style={tw`text-red-500 text-sm mt-1`}>{error}</Text>}
        </View>
    )
}