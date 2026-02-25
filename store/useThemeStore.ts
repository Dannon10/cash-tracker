import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'

interface ThemeState {
    isDark: boolean
    toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            isDark: false,

            toggleTheme: () => {
                const newValue = !get().isDark
                set({ isDark: newValue })
                Appearance.setColorScheme(newValue ? 'dark' : 'light')
            },
        }),
        {
            name: 'theme-storage', 
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)