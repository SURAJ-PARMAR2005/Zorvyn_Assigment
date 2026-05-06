import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionType } from '../types';
import { CurrencyValue } from '../components/CurrencyValue';
import { PremiumDropdown } from '../components/PremiumDropdown';

export const Transactions = () => {
  const { transactions, role, addTransaction, updateTransaction, deleteTransaction } = useFinanceStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const q = (searchParams.get('q') ?? '').trim();
    if (q) {
      setSearch(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const categories = useMemo(() => 
    ['All', ...new Set(transactions.map(t => t.category))], 
    [transactions]
  );

  const typeOptions = useMemo(() => ([
    { label: 'All Types', value: 'All' as const, tone: 'slate' as const },
    { label: 'Income', value: 'Income' as const, tone: 'emerald' as const },
    { label: 'Expense', value: 'Expense' as const, tone: 'rose' as const },
  ]), []);

  const categoryOptions = useMemo(() => (
    categories.map((c) => ({
      label: c,
      value: c,
      tone: c === 'All' ? ('slate' as const) : ('slate' as const),
    }))
  ), [categories]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                           t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (tx?: Transaction) => {
    if (role !== 'Admin') return;
    setEditingTx(tx || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (role !== 'Admin') return;
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const downloadTextFile = (filename: string, contents: string, mimeType: string) => {
    const blob = new Blob([contents], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const escapeCsv = (value: unknown) => {
    const s = String(value ?? '');
    if (/[")\n,]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const handleExportCsv = () => {
    const headers = ['id', 'date', 'name', 'category', 'type', 'amount', 'status'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.name,
      t.category,
      t.type,
      t.amount,
      t.status,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
    downloadTextFile(`transactions-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');
  };

  const handleExportJson = () => {
    const json = JSON.stringify(transactions, null, 2);
    downloadTextFile(`transactions-${new Date().toISOString().slice(0, 10)}.json`, json, 'application/json');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your financial history</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Download size={18} />
            Export JSON
          </button>
          {role === 'Admin' && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white glow-green hover:bg-primary/90 transition-all text-sm font-medium"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 [html[data-theme='light']_&]:text-slate-800" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm text-white placeholder:text-slate-500 [html[data-theme='light']_&]:text-slate-950 [html[data-theme='light']_&]:placeholder:text-slate-600"
            />
          </div>

      <div className="flex items-center gap-3 w-full lg:w-auto overflow-visible pb-2 lg:pb-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 [html[data-theme='light']_&]:bg-black/[0.05]">
              <Filter size={16} className="text-slate-500 [html[data-theme='light']_&]:text-slate-800" />
              <PremiumDropdown
                size="sm"
                align="left"
                value={typeFilter}
                options={typeOptions}
                onChange={(v) => {
                  setTypeFilter(v as any);
                  setCurrentPage(1);
                }}
        menuClassName="z-[80]"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 [html[data-theme='light']_&]:bg-black/[0.05]">
              <PremiumDropdown
                size="sm"
                align="left"
                value={categoryFilter}
                options={categoryOptions}
                onChange={(v) => {
                  setCategoryFilter(v);
                  setCurrentPage(1);
                }}
                menuClassName="z-[80]"
              />
            </div>
          </div>
        </div>
      </GlassCard>

  <GlassCard className="overflow-hidden p-0" borderless>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                {role === 'Admin' && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4 align-middle text-center">
                    <div className={cn(
                      "inline-flex items-center justify-center p-2 rounded-lg",
                      tx.type === 'Income' ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                    )}>
                      {tx.type === 'Income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle text-center">
                    <span className="text-sm font-bold">{tx.name}</span>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <span className="inline-flex items-center justify-center text-xs font-medium px-2.5 py-1 rounded-lg bg-white/5 text-slate-400">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <span className="inline-flex items-center justify-center text-xs text-slate-500">
                      {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <span className={cn(
                      "text-sm font-bold",
                      tx.type === 'Income' ? "text-emerald-500" : "text-white [html[data-theme='light']_&]:text-slate-950"
                    )}>
                      {tx.type === 'Income' ? '+' : '-'}
                      <CurrencyValue value={tx.amount} />
                    </span>
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      tx.status === 'Successful' ? "bg-emerald-500/10 text-emerald-500" : 
                      tx.status === 'Pending' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  {role === 'Admin' && (
                    <td className="px-6 py-4 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(tx)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

  <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredTransactions.length, currentPage * itemsPerPage)} of {filteredTransactions.length} results
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-primary/20 text-primary rounded-lg">
              {currentPage}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  amount: parseFloat(formData.get('amount') as string),
                  type: formData.get('type') as TransactionType,
                  date: new Date().toISOString(),
                  status: 'Successful' as const,
                };

                if (editingTx) {
                  updateTransaction(editingTx.id, data);
                } else {
                  addTransaction(data);
                }
                setIsModalOpen(false);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Name</label>
                  <input 
                    name="name"
                    required
                    defaultValue={editingTx?.name}
                    placeholder="e.g. Apple Store"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Amount</label>
                    <input 
                      name="amount"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingTx?.amount}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Type</label>
                    <select 
                      name="type"
                      defaultValue={editingTx?.type || 'Expense'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm appearance-none"
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Category</label>
                  <input 
                    name="category"
                    required
                    defaultValue={editingTx?.category}
                    placeholder="e.g. Electronics"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white glow-green hover:bg-primary/90 transition-all text-sm font-bold"
                  >
                    {editingTx ? 'Save Changes' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
