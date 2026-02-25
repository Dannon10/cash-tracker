import { useAuthStore } from '../store/useAuthStore'

const mockGetSession = jest.fn()
const mockOnAuthStateChange = jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }))
const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()
const mockSignOut = jest.fn()

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
      signInWithPassword: (args: any) => mockSignInWithPassword(args),
      signUp: (args: any) => mockSignUp(args),
      signOut: () => mockSignOut(),
    },
  },
}))


const mockUser = { id: 'user-1', email: 'test@example.com' } as any
const mockSession = { user: mockUser, access_token: 'token-123' } as any

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null, loading: true })
    jest.clearAllMocks()
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    })
  })


  describe('initialize', () => {
    it('sets user and session from existing session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: mockSession } })

      await useAuthStore.getState().initialize()

      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().session).toEqual(mockSession)
      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('sets user and session to null when no session exists', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })

      await useAuthStore.getState().initialize()

      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().session).toBeNull()
      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('sets loading to false even with no session', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })

      await useAuthStore.getState().initialize()

      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('subscribes to auth state changes', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })

      await useAuthStore.getState().initialize()

      expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1)
    })

    it('ignores INITIAL_SESSION event from auth state change listener', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })
      mockOnAuthStateChange.mockImplementation((cb: any) => {
        cb('INITIAL_SESSION', mockSession)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      await useAuthStore.getState().initialize()

      // user should still be null because INITIAL_SESSION was ignored
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('updates state on subsequent auth state change events', async () => {
      mockGetSession.mockResolvedValue({ data: { session: null } })
      mockOnAuthStateChange.mockImplementation((cb: any) => {
        cb('SIGNED_IN', mockSession)
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      await useAuthStore.getState().initialize()

      expect(useAuthStore.getState().user).toEqual(mockUser)
    })
  })


  describe('signIn', () => {
    it('sets user and session on successful sign in', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const result = await useAuthStore.getState().signIn('test@example.com', 'password123')

      expect(result).toBeNull()
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().session).toEqual(mockSession)
    })

    it('returns error message on failed sign in', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      })

      const result = await useAuthStore.getState().signIn('test@example.com', 'wrongpassword')

      expect(result).toBe('Invalid credentials')
      expect(useAuthStore.getState().user).toBeNull()
    })
  })


  describe('signUp', () => {
    it('sets user on successful sign up', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const result = await useAuthStore.getState().signUp('new@example.com', 'password123', 'John')

      expect(result).toBeNull()
      expect(useAuthStore.getState().user).toEqual(mockUser)
    })

    it('passes full_name in options', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      })

      await useAuthStore.getState().signUp('new@example.com', 'password123', 'John Doe')

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: { data: { full_name: 'John Doe' } },
      })
    })

    it('returns error message on failed sign up', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already registered' },
      })

      const result = await useAuthStore.getState().signUp('existing@example.com', 'pass', 'Jane')

      expect(result).toBe('Email already registered')
      expect(useAuthStore.getState().user).toBeNull()
    })
  })


  describe('signOut', () => {
    it('clears user and session on sign out', async () => {
      useAuthStore.setState({ user: mockUser, session: mockSession })
      mockSignOut.mockResolvedValue({})

      await useAuthStore.getState().signOut()

      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().session).toBeNull()
    })

    it('calls supabase signOut', async () => {
      mockSignOut.mockResolvedValue({})

      await useAuthStore.getState().signOut()

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })
})