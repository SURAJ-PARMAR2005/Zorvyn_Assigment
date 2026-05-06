import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { useFinanceStore } from '../store/useFinanceStore';
import { cn } from '../lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Instagram,
  Music,
  Twitter,
  Send,
  Apple
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CurrencyValue } from '../components/CurrencyValue';

const revenueData = [
  { name: 'Apr', value: 15000 },
  { name: 'May', value: 7000 },
  { name: 'Jun', value: 19000 },
  { name: 'Jul', value: 1200 },
  { name: 'Aug', value: 22400 },
];

type SplitDatum = { name: string; value: number; color: string };
type TrendDatum = { name: string; value: number };
type RevenueDatum = { name: string; value: number };

type CardDashboardMock = {
  expenseSplit: SplitDatum[];
  balanceTrend: TrendDatum[];
  recentTransactions: { name: string; category: string; type: 'Income' | 'Expense'; amount: number; status: 'Successful' | 'Pending' | 'Failed' }[];
  totalBalance: number;
  balanceDeltaText: string;
  incomeThisWeek: number;
  incomeDeltaPct: number;
  expenseThisWeek: number;
  expenseDeltaPct: number;
  revenueFlow: RevenueDatum[];
};

const revenuePresets: Record<string, RevenueDatum[]> = {
  card1: [
    { name: 'Apr', value: 15000 },
    { name: 'May', value: 7000 },
    { name: 'Jun', value: 19000 },
    { name: 'Jul', value: 1200 },
    { name: 'Aug', value: 22400 },
  ],
  card2: [
    { name: 'Apr', value: 9200 },
    { name: 'May', value: 13800 },
    { name: 'Jun', value: 8600 },
    { name: 'Jul', value: 17600 },
    { name: 'Aug', value: 11200 },
  ],
  card3: [
    { name: 'Apr', value: 6400 },
    { name: 'May', value: 5400 },
    { name: 'Jun', value: 11200 },
    { name: 'Jul', value: 9800 },
    { name: 'Aug', value: 15100 },
  ],
  card4: [
    { name: 'Apr', value: 18200 },
    { name: 'May', value: 16200 },
    { name: 'Jun', value: 21400 },
    { name: 'Jul', value: 19400 },
    { name: 'Aug', value: 23800 },
  ],
};

const dashboardMocks: Record<'card1' | 'card2' | 'card3' | 'card4', CardDashboardMock> = {
  card1: {
    totalBalance: 120456,
    balanceDeltaText: '+2,456 revenue from last month',
    incomeThisWeek: 2456,
    incomeDeltaPct: 15.7,
    expenseThisWeek: 1124,
    expenseDeltaPct: -10.7,
    revenueFlow: revenuePresets.card1,
    expenseSplit: [
      { name: 'Shopping', value: 38, color: '#10b981' },
      { name: 'Bills', value: 22, color: '#064e3b' },
      { name: 'Food', value: 18, color: '#065f46' },
      { name: 'Travel', value: 12, color: '#047857' },
      { name: 'Health', value: 10, color: '#059669' },
    ],
    balanceTrend: [
      { name: 'W1', value: 96 },
      { name: 'W2', value: 102 },
      { name: 'W3', value: 108 },
      { name: 'W4', value: 112 },
    ],
    recentTransactions: [
      { name: 'Spotify', category: 'Entertainment', type: 'Expense', amount: 12.99, status: 'Successful' },
      { name: 'Salary', category: 'Income', type: 'Income', amount: 2400, status: 'Successful' },
      { name: 'Uber', category: 'Transport', type: 'Expense', amount: 24.5, status: 'Successful' },
      { name: 'Amazon', category: 'Shopping', type: 'Expense', amount: 98.2, status: 'Pending' },
    ],
  },
  card2: {
    totalBalance: 88420,
    balanceDeltaText: '+1,120 revenue from last month',
    incomeThisWeek: 1820,
    incomeDeltaPct: 9.2,
    expenseThisWeek: 1670,
    expenseDeltaPct: -4.1,
    revenueFlow: revenuePresets.card2,
    expenseSplit: [
      { name: 'Rent', value: 30, color: '#10b981' },
      { name: 'Shopping', value: 24, color: '#064e3b' },
      { name: 'Food', value: 18, color: '#065f46' },
      { name: 'Bills', value: 16, color: '#047857' },
      { name: 'Other', value: 12, color: '#059669' },
    ],
    balanceTrend: [
      { name: 'W1', value: 88 },
      { name: 'W2', value: 94 },
      { name: 'W3', value: 91 },
      { name: 'W4', value: 98 },
    ],
    recentTransactions: [
      { name: 'Apple', category: 'Shopping', type: 'Expense', amount: 249, status: 'Successful' },
      { name: 'Freelance', category: 'Income', type: 'Income', amount: 520, status: 'Successful' },
      { name: 'Netflix', category: 'Entertainment', type: 'Expense', amount: 15.49, status: 'Successful' },
      { name: 'Groceries', category: 'Food', type: 'Expense', amount: 84.7, status: 'Successful' },
    ],
  },
  card3: {
    totalBalance: 143200,
    balanceDeltaText: '+4,890 revenue from last month',
    incomeThisWeek: 3890,
    incomeDeltaPct: 22.4,
    expenseThisWeek: 940,
    expenseDeltaPct: -12.9,
    revenueFlow: revenuePresets.card3,
    expenseSplit: [
      { name: 'Invest', value: 28, color: '#10b981' },
      { name: 'Food', value: 22, color: '#064e3b' },
      { name: 'Bills', value: 18, color: '#065f46' },
      { name: 'Travel', value: 16, color: '#047857' },
      { name: 'Other', value: 16, color: '#059669' },
    ],
    balanceTrend: [
      { name: 'W1', value: 110 },
      { name: 'W2', value: 104 },
      { name: 'W3', value: 118 },
      { name: 'W4', value: 125 },
    ],
    recentTransactions: [
      { name: 'ETF Buy', category: 'Investment', type: 'Expense', amount: 300, status: 'Successful' },
      { name: 'Dividend', category: 'Income', type: 'Income', amount: 85, status: 'Successful' },
      { name: 'Coffee', category: 'Food', type: 'Expense', amount: 6.8, status: 'Successful' },
      { name: 'Flight', category: 'Travel', type: 'Expense', amount: 420, status: 'Failed' },
    ],
  },
  card4: {
    totalBalance: 201880,
    balanceDeltaText: '+7,420 revenue from last month',
    incomeThisWeek: 7420,
    incomeDeltaPct: 31.8,
    expenseThisWeek: 2120,
    expenseDeltaPct: -6.6,
    revenueFlow: revenuePresets.card4,
    expenseSplit: [
      { name: 'Rent', value: 34, color: '#10b981' },
      { name: 'Food', value: 16, color: '#064e3b' },
      { name: 'Bills', value: 14, color: '#065f46' },
      { name: 'Travel', value: 12, color: '#047857' },
      { name: 'Health', value: 10, color: '#059669' },
      { name: 'Misc', value: 14, color: '#10b981' },
    ],
    balanceTrend: [
      { name: 'W1', value: 104 },
      { name: 'W2', value: 109 },
      { name: 'W3', value: 113 },
      { name: 'W4', value: 117 },
      { name: 'W5', value: 115 },
      { name: 'W6', value: 121 },
      { name: 'W7', value: 128 },
    ],
    recentTransactions: [
      { name: 'Airbnb', category: 'Travel', type: 'Expense', amount: 280.0, status: 'Successful' },
      { name: 'Dividend Payout', category: 'Income', type: 'Income', amount: 640.0, status: 'Successful' },
      { name: 'Electricity', category: 'Bills', type: 'Expense', amount: 88.5, status: 'Successful' },
      { name: 'Restaurant', category: 'Food', type: 'Expense', amount: 54.25, status: 'Pending' },
    ],
  },
};

const expenseSplitPresets: Record<string, SplitDatum[]> = {
  visa: [
    { name: 'Food', value: 28, color: '#10b981' },
    { name: 'Health', value: 12, color: '#064e3b' },
    { name: 'Bills', value: 18, color: '#065f46' },
    { name: 'Entertainment', value: 9, color: '#047857' },
    { name: 'Transportation', value: 18, color: '#059669' },
    { name: 'Miscellaneous', value: 15, color: '#10b981' },
  ],
  mastercard: [
    { name: 'Food', value: 22, color: '#10b981' },
    { name: 'Health', value: 9, color: '#064e3b' },
    { name: 'Bills', value: 26, color: '#065f46' },
    { name: 'Entertainment', value: 14, color: '#047857' },
    { name: 'Transportation', value: 12, color: '#059669' },
    { name: 'Miscellaneous', value: 17, color: '#10b981' },
  ],
  paypal: [
    { name: 'Food', value: 18, color: '#10b981' },
    { name: 'Health', value: 11, color: '#064e3b' },
    { name: 'Bills', value: 16, color: '#065f46' },
    { name: 'Entertainment', value: 22, color: '#047857' },
    { name: 'Transportation', value: 15, color: '#059669' },
    { name: 'Miscellaneous', value: 18, color: '#10b981' },
  ],
};

const balanceTrendPresets: Record<string, TrendDatum[]> = {
  visa: [
    { name: 'W1', value: 108 },
    { name: 'W2', value: 112 },
    { name: 'W3', value: 110 },
    { name: 'W4', value: 118 },
    { name: 'W5', value: 122 },
    { name: 'W6', value: 120 },
    { name: 'W7', value: 126 },
  ],
  mastercard: [
    { name: 'W1', value: 96 },
    { name: 'W2', value: 102 },
    { name: 'W3', value: 99 },
    { name: 'W4', value: 108 },
    { name: 'W5', value: 111 },
    { name: 'W6', value: 109 },
    { name: 'W7', value: 114 },
  ],
  paypal: [
    { name: 'W1', value: 120 },
    { name: 'W2', value: 118 },
    { name: 'W3', value: 123 },
    { name: 'W4', value: 121 },
    { name: 'W5', value: 128 },
    { name: 'W6', value: 132 },
    { name: 'W7', value: 129 },
  ],
};

const transactionsPresets: Record<string, { name: string; category: string; type: 'Income' | 'Expense'; amount: number; status: 'Successful' | 'Pending' | 'Failed' }[]> = {
  visa: [
    { name: 'Apple Store', category: 'Electronics', type: 'Expense', amount: 1299, status: 'Successful' },
    { name: 'Salary Deposit', category: 'Income', type: 'Income', amount: 5000, status: 'Successful' },
    { name: 'Starbucks', category: 'Food', type: 'Expense', amount: 12.5, status: 'Successful' },
    { name: 'Netflix Subscription', category: 'Entertainment', type: 'Expense', amount: 15.99, status: 'Successful' },
  ],
  mastercard: [
    { name: 'Uber Ride', category: 'Transport', type: 'Expense', amount: 24.5, status: 'Successful' },
    { name: 'Freelance Payout', category: 'Income', type: 'Income', amount: 2200, status: 'Successful' },
    { name: 'Whole Foods', category: 'Groceries', type: 'Expense', amount: 145.2, status: 'Successful' },
    { name: 'Gym Membership', category: 'Health', type: 'Expense', amount: 60, status: 'Successful' },
  ],
  paypal: [
    { name: 'Steam Store', category: 'Entertainment', type: 'Expense', amount: 39.99, status: 'Successful' },
    { name: 'Client Transfer', category: 'Income', type: 'Income', amount: 1250, status: 'Successful' },
    { name: 'Spotify', category: 'Music', type: 'Expense', amount: 9.99, status: 'Successful' },
    { name: 'Flight Ticket', category: 'Travel', type: 'Expense', amount: 340, status: 'Pending' },
  ],
};

function getAccountFlavor(name: string, type: string) {
  const n = name.toLowerCase();
  if (n.includes('visa')) return 'visa';
  if (n.includes('master')) return 'mastercard';
  if (n.includes('paypal')) return 'paypal';
  if (type === 'Credit Card' || type === 'Debit Card') return 'visa';
  return 'visa';
}

export const Home = () => {
  const { transactions, accounts, selectedAccountId, setSelectedAccountId } = useFinanceStore();
  const navigate = useNavigate();

  // Maintain a local order so the stack can cycle through *all* accounts on double-click.
  const [cardOrder, setCardOrder] = React.useState<string[]>([]);

  React.useEffect(() => {
    setCardOrder((prev) => {
      const stillThere = prev.filter((id) => accounts.some((a) => a.id === id));
      const missing = accounts.map((a) => a.id).filter((id) => !stillThere.includes(id));
      return [...stillThere, ...missing];
    });
  }, [accounts, setSelectedAccountId]);

  const orderedAccounts = React.useMemo(() => {
    const byId = new Map(accounts.map((a) => [a.id, a] as const));
    const ids = cardOrder.length ? cardOrder : accounts.map((a) => a.id);
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean) as typeof accounts;
    return ordered.length ? ordered : accounts;
  }, [accounts, cardOrder]);

  const cycleCardStack = React.useCallback(() => {
    setCardOrder((prev) => {
      const list = prev.length ? [...prev] : accounts.map((a) => a.id);
      if (list.length <= 1) return list;
      const first = list.shift();
      if (first) list.push(first);

  // After cycling, select the new top so dashboard mock data swaps too.
  setSelectedAccountId(list[0] ?? null);
  return list;
    });
  }, [accounts]);

  const swapToIndex = React.useCallback(
    (index: number) => {
      setCardOrder((prev) => {
        const list = prev.length ? [...prev] : accounts.map((a) => a.id);
        if (!list.length) return list;

        const normalizedIndex = ((index % list.length) + list.length) % list.length;
        const head = list.slice(normalizedIndex);
        const tail = list.slice(0, normalizedIndex);
        const next = [...head, ...tail];

        // Selecting the new top card makes the dashboard mock data swap instantly.
        setSelectedAccountId(next[0] ?? null);
        return next;
      });
    },
    [accounts, setSelectedAccountId]
  );
  const selectedAccount = React.useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId) ?? accounts.find((a) => a.isDefault) ?? accounts[0];
  }, [accounts, selectedAccountId]);

  const activeMockKey = React.useMemo<keyof typeof dashboardMocks>(() => {
    // Map the currently-top card (orderedAccounts[0]) to one of the 4 mock dashboards.
    const topId = orderedAccounts[0]?.id;
    const idx = topId ? accounts.findIndex((a) => a.id === topId) : 0;
    const clamped = Number.isFinite(idx) && idx >= 0 ? Math.min(3, idx) : 0;
  return `card${(clamped + 1) as 1 | 2 | 3 | 4}`;
  }, [accounts, orderedAccounts]);

  const flavorKey = React.useMemo(() => {
    if (!selectedAccount) return 'visa';
    return getAccountFlavor(selectedAccount.name, selectedAccount.type);
  }, [selectedAccount]);

  const mock = React.useMemo(() => dashboardMocks[activeMockKey] ?? dashboardMocks.card1, [activeMockKey]);

  const expenseSplitData = React.useMemo(() => mock.expenseSplit, [mock]);
  const balanceTrendData = React.useMemo(() => mock.balanceTrend, [mock]);

  const mockRecentTransactions = React.useMemo(() => {
    const items = mock.recentTransactions;
    const now = Date.now();
  return items.map((t: (typeof items)[number], idx: number) => ({
      id: `${activeMockKey}-${idx}`,
      date: new Date(now - idx * 86400000).toISOString(),
      ...t,
    }));
  }, [activeMockKey, mock]);

  const recentTransactions = React.useMemo(() => {
    // UX goal: card selection changes the visible dashboard data.
    // We still keep the store transactions for the Transactions page.
    return mockRecentTransactions;
  }, [mockRecentTransactions]);

  const handleCardDoubleClick = (id: string) => {
    setSelectedAccountId(id);
  };
  
  return (
    <div className="space-y-6">
  <h1 className="text-4xl font-bold text-white mb-6 [html[data-theme='light']_&]:text-slate-950">My Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Row: Balance & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <GlassCard className="md:col-span-7 glass-balance-panel glow-green-large relative overflow-hidden min-h-[280px] flex flex-col justify-between" hoverEffect={false}>
              <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-6 flex-1">
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total balance</p>
                    <h2 className="text-5xl font-bold text-white tracking-tight translate-y-[20px] [html[data-theme='light']_&]:text-slate-950">
                      <CurrencyValue value={mock.totalBalance} />
                    </h2>
                    <p className="text-xs text-slate-500 mt-6 translate-y-[25px]">{mock.balanceDeltaText}</p>
                  </div>

                  <div className="flex gap-4 mt-12 translate-y-[-5px]">
                    <motion.button 
                      whileHover={{ y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap"
                    >
                      Transfer
                    </motion.button>
                    <motion.button 
                      whileHover={{ y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all whitespace-nowrap [html[data-theme='light']_&]:bg-black/[0.06] [html[data-theme='light']_&]:text-slate-900 [html[data-theme='light']_&]:hover:bg-black/[0.10]"
                    >
                      Top Up
                    </motion.button>
                  </div>
                </div>

                {/* Premium sparkline */}
                <div className="hidden sm:flex w-full sm:w-56 md:w-64 lg:w-72 flex-col self-stretch justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Balance trend</p>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full">+12.4%</span>
                  </div>
                  <div className="h-40 md:h-[12rem] rounded-3xl bg-black/20 border border-white/5 overflow-hidden [html[data-theme='light']_&]:bg-black/[0.04] [html[data-theme='light']_&]:border-black/10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={balanceTrendData} margin={{ top: 22, right: 16, left: 16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="balanceTrendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fill="url(#balanceTrendFill)"
                          dot={false}
                          isAnimationActive={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </GlassCard>

      <div className="md:col-span-5 flex flex-col gap-6">
              <GlassCard className="flex-1 glass-stat-panel">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Income</p>
  <h3 className="text-3xl font-bold text-white [html[data-theme='light']_&]:text-slate-950">
            <CurrencyValue value={mock.incomeThisWeek} />
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">This week's income</p>
                  </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+{mock.incomeDeltaPct}%</span>
                </div>
              </GlassCard>

              <GlassCard className="flex-1 glass-stat-panel">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Expense</p>
                    <h3 className="text-3xl font-bold text-white [html[data-theme='light']_&]:text-slate-950">
            <CurrencyValue value={-Math.abs(mock.expenseThisWeek)} />
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">This week's income</p>
                  </div>
          <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full">{mock.expenseDeltaPct}%</span>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Middle Row: Revenue Flow & Expense Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="h-[380px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white [html[data-theme='light']_&]:text-slate-950">Revenue flow</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 [html[data-theme='light']_&]:bg-black/[0.05] [html[data-theme='light']_&]:text-slate-700">Monthly</button>
                  <button className="p-1.5 rounded-full bg-white/5 text-slate-400 [html[data-theme='light']_&]:bg-black/[0.05] [html[data-theme='light']_&]:text-slate-700"><ArrowUpRight size={14} /></button>
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mock.revenueFlow}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{ backgroundColor: '#000', borderColor: '#ffffff10', borderRadius: '12px' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981" 
                      radius={[20, 20, 20, 20]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="min-h-[420px] md:h-[380px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white [html[data-theme='light']_&]:text-slate-950">Expense split</h3>
                <button className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 [html[data-theme='light']_&]:bg-black/[0.05] [html[data-theme='light']_&]:text-slate-700">Aug</button>
              </div>
              <div className="flex flex-1 items-center justify-center gap-8 lg:gap-10 flex-col sm:flex-row px-2 sm:px-0">
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 lg:w-44 lg:h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseSplitData}
      innerRadius={58}
      outerRadius={84}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseSplitData.map((entry: (typeof expenseSplitData)[number], index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
                    <span className="text-2xl font-bold text-white [html[data-theme='light']_&]:text-slate-950">{Math.abs(mock.expenseThisWeek).toLocaleString()}<span className="text-xs ml-0.5 text-primary">₹</span></span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-5 sm:gap-y-6">
                  {expenseSplitData.map((item: (typeof expenseSplitData)[number]) => (
                    <div key={item.name} className="space-y-1">
                      <p className="text-xs text-slate-500 font-medium">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-base font-bold text-white [html[data-theme='light']_&]:text-slate-950">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

    {/* Sidebar: Card Stack & Subscriptions */}
  <div className="lg:col-span-4 space-y-6">
          <GlassCard className="h-full flex flex-col" hoverEffect={false}>
      <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white [html[data-theme='light']_&]:text-slate-950">My cards <span className="text-slate-500 font-normal ml-1">{accounts.length}</span></h3>
              <div className="flex p-1 bg-white/5 rounded-full">
                <button
                  onClick={() => navigate('/accounts')}
                  className="px-4 py-1 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-colors [html[data-theme='light']_&]:text-slate-600 [html[data-theme='light']_&]:hover:text-slate-950"
                >
                  Add
                </button>
                <button
                  onClick={() => navigate('/accounts')}
                  className="p-1 rounded-full text-slate-400 hover:text-white transition-colors [html[data-theme='light']_&]:text-slate-600 [html[data-theme='light']_&]:hover:text-slate-950"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Card Stack (driven by Accounts) */}
            <div
              className="relative h-64 sm:h-72 perspective-[1000px] mb-10 cursor-pointer"
              onClick={() => {
                // Clicking anywhere in the My Cards box cycles the stack.
                cycleCardStack();
              }}
            >
              <AnimatePresence mode="popLayout">
                {orderedAccounts
                  .slice(0, 3)
                  .map((acc, index) => (
                    <motion.div
                    key={acc.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ 
                      opacity: index === 0 ? 1 : index === 1 ? 0.6 : 0.4,
                      scale: index === 0 ? 1 : index === 1 ? 0.95 : 0.9,
                      y: index === 0 ? 48 : index === 1 ? 16 : 0,
                      rotateX: index === 0 ? 10 : 0,
                      // index 0 is the “front” card (lowered), so it must win pointer hit-testing.
                      zIndex: index === 0 ? 30 : index === 1 ? 20 : 10
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      // Desired UX: click any card -> current top goes to back, next comes forward.
                      cycleCardStack();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Desired UX: click any card -> current top goes to back, next comes forward.
                      cycleCardStack();
                    }}
                    className={cn(
                      "absolute top-0 left-0 w-full h-48 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between p-6 overflow-hidden cursor-pointer select-none pointer-events-auto text-white [html[data-theme='light']_&]:text-black [html[data-theme='light']_&]:[&_\*]:text-black",
                      acc.id === selectedAccount?.id ? "ring-1 ring-emerald-400/40" : ""
                    )}
                    style={{
                      background:
                        `linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.80) 55%, ${acc.color}40 100%)`,
                    }}
                  >
                    {/* Light-theme background override: remove ALL dark gradients */}
                    <div
                      className="absolute inset-0 hidden [html[data-theme='light']_&]:block pointer-events-none"
                      style={{
                        background:
                          `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.76) 55%, ${acc.color}22 100%)`,
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-70 pointer-events-none"
                      style={{
                        background:
                          `radial-gradient(700px 280px at 20% 20%, ${acc.color}30 0%, transparent 55%), radial-gradient(420px 220px at 90% 10%, rgba(16,185,129,0.12) 0%, transparent 60%)`,
                      }}
                    />
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "font-black italic text-white text-sm sm:text-base relative [html[data-theme='light']_&]:text-black",
                      )}>{acc.name}</span>
                      <span className="text-xs text-slate-400 [html[data-theme='light']_&]:text-black">**** {acc.lastFour}</span>
                    </div>
                    {index === 0 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base font-medium tracking-[0.2em] text-emerald-500/80 [html[data-theme='light']_&]:text-black">
                          •••• •••• •••• {acc.lastFour}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] text-slate-500 uppercase font-bold [html[data-theme='light']_&]:text-black">Card Holder</p>
                            <p className="text-xs font-bold text-white [html[data-theme='light']_&]:text-black">Micky Larson</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-500 uppercase font-bold [html[data-theme='light']_&]:text-black">Expires</p>
                            <p className="text-xs font-bold text-white [html[data-theme='light']_&]:text-black">07/25</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-35 pointer-events-none"
                      style={{ backgroundColor: acc.color }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Subscriptions */}
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white [html[data-theme='light']_&]:text-slate-950">Subscriptions <span className="text-slate-500 font-normal ml-1">5</span></h3>
                <button className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-white transition-colors [html[data-theme='light']_&]:hover:text-slate-950">
                  Manage <ChevronRight size={12} />
                </button>
              </div>

              <div className="flex gap-3 mb-8">
                {[Instagram, Apple, Music, Twitter, Send].map((Icon, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer [html[data-theme='light']_&]:bg-black/[0.05] [html[data-theme='light']_&]:border-black/10 [html[data-theme='light']_&]:text-slate-900 [html[data-theme='light']_&]:hover:bg-black/[0.08]"
                  >
                    <Icon size={18} />
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { name: 'iCloud', date: 'Next 15 July', amount: '249', icon: Apple },
                  { name: 'Discord Nitro', date: 'Next 19 July', amount: '749', icon: Music },
                ].map((sub, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] transition-all group cursor-pointer [html[data-theme='light']_&]:bg-black/[0.03] [html[data-theme='light']_&]:border-black/[0.08]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-black/10 [html[data-theme='light']_&]:text-slate-900 [html[data-theme='light']_&]:shadow-[inset_0_1px_1px_rgba(2,6,23,0.06)]">
                        <sub.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white [html[data-theme='light']_&]:text-slate-950">{sub.name}</p>
                        <p className="text-[10px] text-slate-400">{sub.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-white [html[data-theme='light']_&]:text-slate-950"><CurrencyValue value={sub.amount} /></span>
                      <button className="text-slate-500 group-hover:text-white transition-colors [html[data-theme='light']_&]:group-hover:text-slate-950"><MoreHorizontal size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Horizontal Recent Transactions Footer */}
      <GlassCard className="p-6 mt-12 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white [html[data-theme='light']_&]:text-slate-950">Recent transactions <span className="text-slate-500 font-normal ml-1">234</span></h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-white transition-colors [html[data-theme='light']_&]:hover:text-slate-950"
          >
            See All <ChevronRight size={12} />
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((tx: (typeof recentTransactions)[number]) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-all cursor-pointer"
              onClick={() => navigate('/transactions')}
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  {tx.type === 'Income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white [html[data-theme='light']_&]:text-slate-950">{tx.name}</p>
                  <p className="text-[10px] text-slate-400">{tx.category}</p>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full border text-[10px] font-bold",
                  tx.status === 'Successful' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                  tx.status === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                  "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                  {tx.status}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-16 flex-1 justify-center">
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                  {new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">—</p>
              </div>

              <div className="flex items-center gap-6 flex-1 justify-end">
                <p className={cn(
                  "text-xl font-bold",
                  tx.type === 'Income' ? "text-emerald-400" : "text-white [html[data-theme='light']_&]:text-slate-950"
                )}>
                  {tx.type === 'Income' ? '+' : '-'}<CurrencyValue value={tx.amount} />
                </p>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors [html[data-theme='light']_&]:hover:text-slate-950 [html[data-theme='light']_&]:hover:bg-black/[0.06]"><MoreHorizontal size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
  </div>
  );
};
