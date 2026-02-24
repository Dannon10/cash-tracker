import { create } from 'zustand'
import { Appearance } from 'react-native'

interface ThemeState {
    isDark: boolean
    toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    // isDark: Appearance.getColorScheme() === 'dark',
    isDark: false,
    toggleTheme: () => {
        const newValue = !get().isDark
        set({ isDark: newValue })
        Appearance.setColorScheme(newValue ? 'dark' : 'light')
    },
}))