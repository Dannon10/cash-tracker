import React from 'react'
import { render, waitFor } from '@testing-library/react-native'

const mockReplace = jest.fn()

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }))

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}))

jest.mock('@expo/vector-icons/FontAwesome', () => {
  const { View } = require('react-native')
  const Mock = () => <View />
  Mock.font = {}
  return Mock
})

jest.mock('@react-navigation/native', () => {
  return {
    DarkTheme: {},
    DefaultTheme: {},
    ThemeProvider: ({ children }: any) => children,
  }
})

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSegments: () => ['index'],
  Stack: Object.assign(
    ({ children }: any) => children,
    { Screen: () => null }
  ),
}))

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
)

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native')
  return {
    GestureHandlerRootView: ({ children }: any) => children,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    Directions: {},
  }
})

jest.mock('../store/useAuthStore', () => ({
  useAuthStore: () => ({
    initialize: jest.fn(),
    user: { id: 'u1' },
    loading: false,
  }),
}))

jest.mock('../store/useThemeStore', () => ({
  useThemeStore: () => ({ isDark: false }),
}))

jest.mock('../components/ErrorBoundary', () => {
  const { View } = require('react-native')
  return ({ children }: any) => <View>{children}</View>
})

import RootLayout from '../app/_layout'

describe('RootLayout navigation behavior', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('redirects logged-in user from welcome to app', async () => {
    render(<RootLayout />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/transactions')
    })
  })
})