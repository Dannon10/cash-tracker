import { View, Pressable, Switch, Alert } from 'react-native'
import tw from 'twrnc'
import { Text } from '@/components/AppText'
import { useAuthStore } from '../../store/useAuthStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function SettingsScreen() {
    const { user, signOut } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const router = useRouter();

    const fullName = user?.user_metadata?.full_name || ''
    const displayName = fullName.trim().split(' ')[0] || 'User';

    const handleSignOut = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/auth/login');
                    },
                },
            ]
        );
    };

    const bg = isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'
    const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white'
    const textPrimary = isDark ? 'text-white' : 'text-gray-900'
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500'
    const borderColor = isDark ? '#2a2a2a' : '#f3f4f6'

    return (
        <View style={tw`flex-1 ${bg}`}>
            <View style={tw`flex-row items-center justify-between px-6 pt-4`}>
            </View>

            {/* Header */}
            <View style={tw`px-6 pt-16 pb-6 flex-row items-center justify-between`}>
                <View>
                    <Text weight='bold' style={tw`text-2xl ${textPrimary}`}>Settings</Text>
                    <Text style={tw`text-sm ${textSecondary} mt-1`}> Manage your account and preferences </Text>
                </View>
                {/* Back Button */}
            <Pressable onPress={() => router.back()} style={tw`mr-4 flex-row items-center`} >
                <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
                <Text style={tw`${textPrimary} ml-2`}>Go back</Text>
            </Pressable>
            </View>

            {/* Profile Card */}
            <View style={tw`mx-5 mb-4 ${cardBg} rounded-2xl p-5`}>
                <View style={tw`flex-row items-center gap-4`}>
                    <View style={tw`w-14 h-14 rounded-full bg-black items-center justify-center`}>
                        <Text weight='bold' style={tw`text-white text-xl`}>
                            {displayName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={tw`flex-1`}>
                        <Text weight='bold' style={tw`text-base ${textPrimary}`}>{displayName}</Text>
                        <Text style={tw`text-sm ${textSecondary}`}>{user?.email}</Text>
                    </View>
                </View>
            </View>

            {/* Preferences Section */}
            <Text weight='bold' style={tw`text-xs ${textSecondary} uppercase tracking-widest px-6 mb-2`}>
                Preferences
            </Text>

            <View style={tw`mx-5 mb-4 ${cardBg} rounded-2xl overflow-hidden`}>
                {/* Dark Mode Toggle */}
                <View style={[
                    tw`flex-row items-center justify-between px-5 py-4`,
                    { borderBottomWidth: 1, borderBottomColor: borderColor }
                ]}>
                    <View style={tw`flex-row items-center gap-3`}>
                        <View style={tw`w-9 h-9 rounded-full bg-indigo-100 items-center justify-center`}>
                            <MaterialCommunityIcons
                                name={isDark ? 'moon-waning-crescent' : 'white-balance-sunny'}
                                size={18}
                                color="#6366f1"
                            />
                        </View>
                        <View>
                            <Text weight='semibold' style={tw`text-sm ${textPrimary}`}>Dark Mode</Text>
                            <Text style={tw`text-xs ${textSecondary}`}>
                                {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#e5e7eb', true: '#0B0B0B' }}
                        thumbColor="white"
                    />
                </View>

                {/* Notifications placeholder */}
                <View style={tw`flex-row items-center justify-between px-5 py-4`}>
                    <View style={tw`flex-row items-center gap-3`}>
                        <View style={tw`w-9 h-9 rounded-full bg-amber-100 items-center justify-center`}>
                            <Ionicons name="notifications-outline" size={18} color="#f59e0b" />
                        </View>
                        <View>
                            <Text weight='semibold' style={tw`text-sm ${textPrimary}`}>Notifications</Text>
                            <Text style={tw`text-xs ${textSecondary}`}>Coming soon</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={isDark ? '#4b5563' : '#9ca3af'} />
                </View>
            </View>

            {/* Account Section */}
            <Text weight='semibold' style={tw`text-xs ${textSecondary} uppercase tracking-widest px-6 mb-2`}>
                Account
            </Text>

            <View style={tw`mx-5 ${cardBg} rounded-2xl overflow-hidden`}>
                <Pressable
                    onPress={handleSignOut}
                    style={tw`flex-row items-center gap-3 px-5 py-4`}
                >
                    <View style={tw`w-9 h-9 rounded-full bg-red-100 items-center justify-center`}>
                        <MaterialCommunityIcons name="logout" size={18} color="#ef4444" />
                    </View>
                    <Text weight='semibold' style={tw`text-sm text-red-500`}>Sign Out</Text>
                </Pressable>
            </View>

        </View>
    )
}