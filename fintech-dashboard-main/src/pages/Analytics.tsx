import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  AlertCircle,
  ShoppingBag,
  Coffee,
  Home as HomeIcon,
  Film
} from 'lucide-react';
import { CurrencyValue } from '../components/CurrencyValue';
import { PremiumDropdown } from '../components/PremiumDropdown';

const monthlyData = [
  { name: 'Jan', income: 4500, expense: 3200 },
  { name: 'Feb', income: 5200, expense: 3800 },
  { name: 'Mar', income: 4800, expense: 4100 },
  { name: 'Apr', income: 6100, expense: 3900 },
  { name: 'May', income: 5500, expense: 4200 },
  { name: 'Jun', income: 6700, expense: 4500 },
];

const categoryData = [
  { name: 'Housing', value: 1200, icon: HomeIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'Food', value: 850, icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { name: 'Shopping', value: 640, icon: ShoppingBag, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { name: 'Entertainment', value: 420, icon: Film, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

export const Analytics = () => {
  const { transactions } = useFinanceStore();
  const [timeframe, setTimeframe] = React.useState<'Last 6 Months' | 'Last Year' | 'All Time'>('Last 6 Months');

  const timeframeOptions = React.useMemo(
    () => [
      { label: 'Last 6 Months', value: 'Last 6 Months' as const, tone: 'slate' as const },
      { label: 'Last Year', value: 'Last Year' as const, tone: 'slate' as const },
      { label: 'All Time', value: 'All Time' as const, tone: 'slate' as const },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Deep dive into your spending habits and trends</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 [html[data-theme='light']_&]:bg-black/[0.05] [html[data-theme='light']_&]:border-black/10">
          <span className="text-xs font-medium text-slate-400 [html[data-theme='light']_&]:text-slate-800">Timeframe:</span>
          <PremiumDropdown
            size="sm"
            align="right"
            value={timeframe}
            options={timeframeOptions}
            onChange={(v) => setTimeframe(v as typeof timeframe)}
            menuClassName="w-44"
            buttonClassName="[html[data-theme='light']_&]:text-slate-950"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-[468px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Income vs Expenses</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-slate-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-xs text-slate-400">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#ffffff10',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="bg-primary/10 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Zap className="text-primary" size={20} />
              </div>
              <h4 className="font-bold">AI Insight</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed [html[data-theme='light']_&]:text-slate-800">
              Your "Food & Dining" spending is <span className="text-primary font-bold">15% lower</span> than last month. Great job staying on budget!
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <AlertCircle className="text-amber-500" size={20} />
              </div>
              <h4 className="font-bold">Budget Alert</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed [html[data-theme='light']_&]:text-slate-800">
              You've reached <span className="text-amber-500 font-bold">92%</span> of your shopping budget for March. Consider pausing non-essential purchases.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Target className="text-blue-500" size={20} />
              </div>
              <h4 className="font-bold">Savings Goal</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">New Car Fund</span>
                <span className="text-white font-bold [html[data-theme='light']_&]:text-slate-950">65%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500">₹13,00,000 / ₹20,00,000</p>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-bold mb-6">Spending by Category</h3>
          <div className="space-y-6">
            {categoryData.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl", cat.bg, cat.color)}>
                      <cat.icon size={18} />
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold">
                    <CurrencyValue value={cat.value} />
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.value / 1200) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      cat.name === 'Housing' && 'bg-blue-400',
                      cat.name === 'Food' && 'bg-emerald-400',
                      cat.name === 'Shopping' && 'bg-amber-400',
                      cat.name === 'Entertainment' && 'bg-rose-400'
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="h-[400px]">
          <h3 className="text-lg font-bold mb-8">Monthly Savings Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#ffffff10',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={(d) => d.income - d.expense} 
                  name="Savings"
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
