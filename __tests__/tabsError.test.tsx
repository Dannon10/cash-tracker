import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import TabsError from '../app/(tabs)/error'

jest.mock('../store/useThemeStore', () => ({ useThemeStore: () => ({ isDark: false }) }))

describe('tabs error screen', () => {
  it('shows message and triggers retry', () => {
    const retry = jest.fn()
    const { getByText } = render(<TabsError error={{ message: 'fail' } as any} retry={retry} />)

    expect(getByText('Tabs failed to load 😅')).toBeTruthy()
    expect(getByText('fail')).toBeTruthy()

    fireEvent.press(getByText('Try Again'))
    expect(retry).toHaveBeenCalled()
  })
})
