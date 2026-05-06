import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinanceState, Transaction, Account, Role, ThemeMode } from '../types';

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-03-28T10:00:00Z', name: 'Apple Store', category: 'Electronics', type: 'Expense', amount: 1299.00, status: 'Successful' },
  { id: '2', date: '2024-03-27T14:30:00Z', name: 'Salary Deposit', category: 'Income', type: 'Income', amount: 5000.00, status: 'Successful' },
  { id: '3', date: '2024-03-26T09:15:00Z', name: 'Starbucks', category: 'Food', type: 'Expense', amount: 12.50, status: 'Successful' },
  { id: '4', date: '2024-03-25T18:45:00Z', name: 'Netflix Subscription', category: 'Entertainment', type: 'Expense', amount: 15.99, status: 'Successful' },
  { id: '5', date: '2024-03-24T12:00:00Z', name: 'Amazon Prime', category: 'Shopping', type: 'Expense', amount: 14.99, status: 'Successful' },
  { id: '6', date: '2024-03-23T11:20:00Z', name: 'Uber Ride', category: 'Transport', type: 'Expense', amount: 24.50, status: 'Successful' },
  { id: '7', date: '2024-03-22T20:10:00Z', name: 'Whole Foods', category: 'Groceries', type: 'Expense', amount: 145.20, status: 'Successful' },
  { id: '8', date: '2024-03-21T08:00:00Z', name: 'Gym Membership', category: 'Health', type: 'Expense', amount: 60.00, status: 'Successful' },
];

const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Main Savings', type: 'Bank Account', balance: 12456.50, lastFour: '4352', color: '#10b981', isDefault: true },
  { id: 'acc2', name: 'Visa Platinum', type: 'Credit Card', balance: -1124.00, lastFour: '6902', color: '#3b82f6' },
  { id: 'acc3', name: 'Crypto Wallet', type: 'Wallet', balance: 2456.00, lastFour: '8821', color: '#f59e0b' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: 'Admin',
  theme: 'dark',
      transactions: mockTransactions,
      accounts: mockAccounts,
  selectedAccountId: mockAccounts.find((a) => a.isDefault)?.id ?? mockAccounts[0]?.id ?? null,
      setRole: (role: Role) => set({ role }),
  setTheme: (theme: ThemeMode) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: Math.random().toString(36).substr(2, 9) }, ...state.transactions]
      })),
      updateTransaction: (id, updatedTransaction) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: Math.random().toString(36).substr(2, 9) }]
      })),
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(a => a.id !== id),
        selectedAccountId:
          state.selectedAccountId === id
            ? state.accounts.find((a) => a.id !== id)?.id ?? null
            : state.selectedAccountId,
      })),
      setDefaultAccount: (id) => set((state) => ({
        accounts: state.accounts.map(a => ({ ...a, isDefault: a.id === id })),
        selectedAccountId: id,
      })),
    }),
    {
      name: 'finance-storage',
    }
  )
);
