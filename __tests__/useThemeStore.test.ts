import AsyncStorage from '@react-native-async-storage/async-storage'
import { act } from '@testing-library/react-native'
import { useThemeStore } from '../store/useThemeStore'

describe('useThemeStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    useThemeStore.setState({ isDark: false })
  })

  it('toggles theme and persists change', async () => {
    useThemeStore.setState({ isDark: false })

    await act(async () => {
      useThemeStore.getState().toggleTheme()
    })

    await new Promise(r => setTimeout(r, 0))

    expect(useThemeStore.getState().isDark).toBe(true)

    const stored = await AsyncStorage.getItem('theme-storage') // adjust if different
    const parsed = JSON.parse(stored ?? '{}')
    expect(parsed.state.isDark).toBe(true)
  })
})