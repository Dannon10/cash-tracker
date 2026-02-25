import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ErrorBoundary from '../components/ErrorBoundary'

describe('ErrorBoundary component (functional)', () => {
  it('renders error message and calls retry on press', () => {
    const retry = jest.fn()
    const { getByText } = render(<ErrorBoundary error={new Error('boom')} retry={retry} />)

    expect(getByText('Something went wrong 🚨')).toBeTruthy()
    expect(getByText('boom')).toBeTruthy()

    const btn = getByText('Try Again')
    fireEvent.press(btn)
    expect(retry).toHaveBeenCalled()
  })
})
