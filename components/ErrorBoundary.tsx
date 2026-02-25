import { View, Text, Pressable } from 'react-native'
import tw from 'twrnc'
import { useThemeStore } from '../store/useThemeStore'

interface Props {
    error: Error
    retry: () => void
}

export default function ErrorBoundary({ error, retry }: Props) {
    const { isDark } = useThemeStore()
    const bgColor = isDark ? 'bg-gray-900' : 'bg-white'
    const textColor = isDark ? 'text-white' : 'text-black'

    return (
        <View style={tw`flex-1 justify-center items-center p-6 ${bgColor}`}>
            <Text style={tw`text-xl mb-3 font-semibold ${textColor}`}>
                Something went wrong 🚨
            </Text>
            <Text style={tw`text-center mb-5 opacity-70 ${textColor}`}>
                {error?.message}
            </Text>
            <Pressable
                onPress={retry}
                style={tw`px-5 py-3 bg-blue-600 rounded-lg`}
            >
                <Text style={tw`text-white`}>Try Again</Text>
            </Pressable>
        </View>
    )
}