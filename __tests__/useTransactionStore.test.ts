import { useTransactionStore } from '../store/useTransactionStore'


const mockSingle = jest.fn()
const mockSelect = jest.fn(() => ({ single: mockSingle }))
const mockOrder = jest.fn(() => ({ select: mockSelect }))
const mockEq = jest.fn(() => ({ select: mockSelect, single: mockSingle }))
const mockInsert = jest.fn(() => ({ select: mockSelect }))
const mockUpdate = jest.fn(() => ({ eq: mockEq }))
const mockDelete = jest.fn(() => ({ eq: mockEq }))
const mockFrom = jest.fn(() => ({
  select: jest.fn(() => ({ order: mockOrder })),
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
}))

const mockGetUser = jest.fn()

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    auth: {
      getUser: () => mockGetUser(),
    },
  },
}))


const sampleTransaction = {
  id: 'tx-1',
  title: 'Salary',
  amount: 5000,
  date: '2024-01-01',
  category: 'income',
  type: 'income' as const,
}

const expenseTransaction = {
  id: 'tx-2',
  title: 'Rent',
  amount: 1500,
  date: '2024-01-02',
  category: 'housing',
  type: 'expense' as const,
}


describe('useTransactionStore', () => {
  beforeEach(() => {
    useTransactionStore.setState({ transactions: [], loading: false })
    jest.clearAllMocks()
  })


  describe('computed values', () => {
    it('calculates totalIncome correctly', () => {
      useTransactionStore.setState({ transactions: [sampleTransaction, expenseTransaction] })
      expect(useTransactionStore.getState().totalIncome()).toBe(5000)
    })

    it('calculates totalExpenses correctly', () => {
      useTransactionStore.setState({ transactions: [sampleTransaction, expenseTransaction] })
      expect(useTransactionStore.getState().totalExpenses()).toBe(1500)
    })

    it('calculates balance as income minus expenses', () => {
      useTransactionStore.setState({ transactions: [sampleTransaction, expenseTransaction] })
      expect(useTransactionStore.getState().balance()).toBe(3500)
    })

    it('returns 0 balance when no transactions', () => {
      useTransactionStore.setState({ transactions: [] })
      expect(useTransactionStore.getState().balance()).toBe(0)
    })

    it('handles multiple income and expense entries', () => {
      useTransactionStore.setState({
        transactions: [
          { ...sampleTransaction, id: 'a', amount: 3000 },
          { ...sampleTransaction, id: 'b', amount: 2000 },
          { ...expenseTransaction, id: 'c', amount: 500 },
          { ...expenseTransaction, id: 'd', amount: 700 },
        ],
      })
      expect(useTransactionStore.getState().totalIncome()).toBe(5000)
      expect(useTransactionStore.getState().totalExpenses()).toBe(1200)
      expect(useTransactionStore.getState().balance()).toBe(3800)
    })
  })


  describe('setTransactions', () => {
    it('replaces transactions in state', () => {
      useTransactionStore.getState().setTransactions([sampleTransaction])
      expect(useTransactionStore.getState().transactions).toHaveLength(1)
      expect(useTransactionStore.getState().transactions[0].id).toBe('tx-1')
    })
  })


  describe('fetchTransactions', () => {
    it('fetches and maps transactions from supabase', async () => {
      const mockRow = { ...sampleTransaction }
      mockFrom.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => ({ data: [mockRow], error: null })),
        })),
      })

      await useTransactionStore.getState().fetchTransactions()

      expect(useTransactionStore.getState().transactions).toHaveLength(1)
      expect(useTransactionStore.getState().transactions[0].title).toBe('Salary')
      expect(useTransactionStore.getState().loading).toBe(false)
    })

    it('sets loading false and logs error on failure', async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn(() => ({
          order: jest.fn(() => ({ data: null, error: { message: 'DB error' } })),
        })),
      })

      await useTransactionStore.getState().fetchTransactions()

      expect(useTransactionStore.getState().transactions).toHaveLength(0)
      expect(useTransactionStore.getState().loading).toBe(false)
    })
  })


  describe('addTransaction', () => {
    it('adds transaction to state on success', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockInsert.mockReturnValueOnce({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: sampleTransaction, error: null })),
        })),
      })

      await useTransactionStore.getState().addTransaction({
        title: 'Salary',
        amount: 5000,
        date: '2024-01-01',
        category: 'income',
        type: 'income',
      })

      expect(useTransactionStore.getState().transactions).toHaveLength(1)
      expect(useTransactionStore.getState().transactions[0].id).toBe('tx-1')
    })

    it('does nothing if no user is logged in', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      await useTransactionStore.getState().addTransaction({
        title: 'Salary',
        amount: 5000,
        date: '2024-01-01',
        category: 'income',
        type: 'income',
      })

      expect(useTransactionStore.getState().transactions).toHaveLength(0)
    })

    it('does not update state on supabase error', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockInsert.mockReturnValueOnce({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: null, error: { message: 'Insert failed' } })),
        })),
      })

      await useTransactionStore.getState().addTransaction({
        title: 'Salary',
        amount: 5000,
        date: '2024-01-01',
        category: 'income',
        type: 'income',
      })

      expect(useTransactionStore.getState().transactions).toHaveLength(0)
    })
  })


  describe('deleteTransaction', () => {
    it('removes transaction from state on success', async () => {
      useTransactionStore.setState({ transactions: [sampleTransaction] })
      mockDelete.mockReturnValueOnce({
        eq: jest.fn(() => ({ error: null })),
      })

      await useTransactionStore.getState().deleteTransaction('tx-1')

      expect(useTransactionStore.getState().transactions).toHaveLength(0)
    })

    it('keeps transaction in state if supabase delete fails', async () => {
      useTransactionStore.setState({ transactions: [sampleTransaction] })
      mockDelete.mockReturnValueOnce({
        eq: jest.fn(() => ({ error: { message: 'Delete failed' } })),
      })

      await useTransactionStore.getState().deleteTransaction('tx-1')

      expect(useTransactionStore.getState().transactions).toHaveLength(1)
    })
  })


  describe('updateTransaction', () => {
    it('updates transaction in state on success', async () => {
      useTransactionStore.setState({ transactions: [sampleTransaction] })
      const updated = { ...sampleTransaction, title: 'Bonus', amount: 8000 }
      mockUpdate.mockReturnValueOnce({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: updated, error: null })),
          })),
        })),
      })

      await useTransactionStore.getState().updateTransaction('tx-1', {
        title: 'Bonus',
        amount: 8000,
      })

      expect(useTransactionStore.getState().transactions[0].title).toBe('Bonus')
      expect(useTransactionStore.getState().transactions[0].amount).toBe(8000)
    })

    it('keeps original transaction if update fails', async () => {
      useTransactionStore.setState({ transactions: [sampleTransaction] })
      mockUpdate.mockReturnValueOnce({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: null, error: { message: 'Update failed' } })),
          })),
        })),
      })

      await useTransactionStore.getState().updateTransaction('tx-1', { title: 'Bonus' })

      expect(useTransactionStore.getState().transactions[0].title).toBe('Salary')
    })
  })
})