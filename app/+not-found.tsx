import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import tw from 'twrnc'
import { useThemeStore } from '../store/useThemeStore'

export default function NotFoundScreen() {
  const { isDark } = useThemeStore()
  const bg = isDark ? 'bg-gray-900' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-black'
  const linkColor = isDark ? '#60a5fa' : '#2e78b7'

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={tw`flex-1 items-center justify-center p-5 ${bg}`}>
        <Text style={tw`text-lg font-bold ${textColor}`}>This screen doesn't exist.</Text>

        <Link href="/" style={tw`mt-4 py-4`}>
          <Text style={[tw`text-sm`, { color: linkColor }]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
