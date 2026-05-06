export type Role = 'Admin' | 'Viewer';

export type TransactionType = 'Income' | 'Expense';

export type ThemeMode = 'dark' | 'light';

export interface Transaction {
  id: string;
  date: string;
  name: string;
  category: string;
  type: TransactionType;
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface Account {
  id: string;
  name: string;
  type: 'Credit Card' | 'Debit Card' | 'Bank Account' | 'Wallet';
  balance: number;
  lastFour: string;
  color: string;
  isDefault?: boolean;
}

export interface FinanceState {
  role: Role;
  theme: ThemeMode;
  transactions: Transaction[];
  accounts: Account[];
  selectedAccountId: string | null;
  setRole: (role: Role) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSelectedAccountId: (id: string | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  setDefaultAccount: (id: string) => void;
}
