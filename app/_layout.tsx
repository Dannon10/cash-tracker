import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import ErrorBoundary from '../components/ErrorBoundary';
export { ErrorBoundary } 

export const unstable_settings = {
    initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const patchTextDefault = () => {
    const applyFont = (origin: any, fontFamily: string) => {
        if (!origin) return origin
        const existingStyle = Array.isArray(origin.props.style)
            ? origin.props.style
            : [origin.props.style]
        const hasFontFamily = existingStyle.some(
            (s: any) => s && typeof s === 'object' && s.fontFamily
        )
        if (hasFontFamily) return origin
        return {
            ...origin,
            props: {
                ...origin.props,
                style: [...existingStyle, { fontFamily }],
            },
        }
    }

    const oldTextRender = (Text as any).render
    ;(Text as any).render = function (...args: any[]) {
        return applyFont(oldTextRender.call(this, ...args), 'ClashGrotesk-Regular')
    }

    const oldInputRender = (TextInput as any).render
    ;(TextInput as any).render = function (...args: any[]) {
        return applyFont(oldInputRender.call(this, ...args), 'Outfit-Regular')
    }
}

export default function RootLayout() {

    const [loaded, error] = useFonts({
    ClashGrotesk: require('../assets/fonts/ClashGrotesk-Regular.ttf'),
    ClashGroteskMedium: require('../assets/fonts/ClashGrotesk-Medium.ttf'),
    ClashGroteskSemiBold: require('../assets/fonts/ClashGrotesk-Semibold.ttf'),
    ClashGroteskBold: require('../assets/fonts/ClashGrotesk-Bold.ttf'),
    ...FontAwesome.font,
});

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            patchTextDefault()
            SplashScreen.hideAsync()
        }
    }, [loaded]);

    if (!loaded) return null;

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const { isDark } = useThemeStore()
    const { initialize, user, loading } = useAuthStore()
    const router = useRouter()
    const segments = useSegments() as string[]
    const [onboardingChecked, setOnboardingChecked] = useState(false)
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

    useEffect(() => {
        initialize()
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('hasSeenOnboarding').then((value) => {
            setHasSeenOnboarding(value === 'true')
            setOnboardingChecked(true)
        })
    }, [])

    useEffect(() => {
        if (loading || !onboardingChecked) return

        const inAuthGroup = segments[0] === 'auth'
        const inWelcome = segments[0] === 'index' || segments[0] === undefined
        const inApp = segments[0] === '(tabs)'

        if (user && (inAuthGroup || inWelcome)) {
            router.replace('/(tabs)/transactions')
        } else if (!user && inApp) {
            router.replace('/auth/login')
        } else if (!user && inWelcome && hasSeenOnboarding) {
            router.replace('/auth/login')
        }
    }, [user, loading, segments, onboardingChecked, hasSeenOnboarding])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
