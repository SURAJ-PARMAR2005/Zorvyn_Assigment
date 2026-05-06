import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useFinanceStore } from '../store/useFinanceStore';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Plus, 
  CreditCard, 
  Building2, 
  Wallet, 
  MoreVertical, 
  Star, 
  Trash2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CurrencyValue } from '../components/CurrencyValue';
import { PremiumDropdown } from '../components/PremiumDropdown';

export const Accounts = () => {
  const { accounts, role, addAccount, deleteAccount, setDefaultAccount } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      balance: parseFloat(formData.get('balance') as string),
      lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    };
    addAccount(data);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accounts & Cards</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your payment methods and linked accounts</p>
        </div>
        
        {role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white glow-green hover:bg-primary/90 transition-all text-sm font-medium"
          >
            <Plus size={18} />
            Add New Method
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <GlassCard 
            key={acc.id} 
            className={cn(
              "relative overflow-hidden group",
              acc.isDefault && "border-primary/40 ring-1 ring-primary/20"
            )}
          >
            <div className="flex justify-between items-start mb-8">
              <div className={cn(
                "p-3 rounded-2xl",
                acc.type === 'Credit Card' ? "bg-rose-500/10 text-rose-500" :
                acc.type === 'Bank Account' ? "bg-blue-500/10 text-blue-500" :
                "bg-emerald-500/10 text-emerald-500"
              )}>
                {acc.type === 'Credit Card' ? <CreditCard size={24} /> : 
                 acc.type === 'Bank Account' ? <Building2 size={24} /> : 
                 <Wallet size={24} />}
              </div>
              
              <div className="flex items-center gap-2">
                {acc.isDefault && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                    <Star size={10} fill="currentColor" />
                    Default
                  </div>
                )}
                {role === 'Admin' && !acc.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultAccount(acc.id)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-all"
                  >
                    Set default
                  </button>
                )}
                {role === 'Admin' && (
                  <button
                    type="button"
                    onClick={() => deleteAccount(acc.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/15 text-[10px] font-bold uppercase tracking-wider text-rose-300 transition-all"
                  >
                    Remove
                  </button>
                )}
                {role === 'Admin' && (
                  <PremiumDropdown
                    size="sm"
                    align="right"
                    value={('remove' as const)}
                    options={[
                      ...(!acc.isDefault
                        ? [
                            {
                              label: 'Set Default',
                              value: 'default' as const,
                              icon: <Star size={12} />,
                              tone: 'slate' as const,
                            },
                          ]
                        : []),
                      {
                        label: 'Remove',
                        value: 'remove' as const,
                        icon: <Trash2 size={12} />,
                        tone: 'rose' as const,
                      },
                    ]}
                    onChange={(v) => {
                      if (v === 'default') setDefaultAccount(acc.id);
                      if (v === 'remove') deleteAccount(acc.id);
                    }}
                    iconButton
                    buttonClassName="rounded-lg p-1.5 text-slate-500 hover:text-slate-300"
                    buttonContent={<MoreVertical size={16} />}
                    hideSelectedIcon
                    menuClassName="w-40 z-[9999]"
                  />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold">{acc.name}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                {acc.type} • •••• {acc.lastFour}
              </p>
            </div>

            <div className="mt-8 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Current Balance</p>
                <p className="text-2xl font-bold"><CurrencyValue value={acc.balance} /></p>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                <ShieldCheck size={14} />
                SECURE
              </div>
            </div>

            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: acc.color }}
            ></div>
          </GlassCard>
        ))}

        {role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group glass rounded-3xl p-6 border-dashed border-white/10 hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-4 min-h-[220px]"
          >
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">
              <Plus size={32} />
            </div>
            <div className="text-center">
              <p className="font-bold">Add New Account</p>
              <p className="text-xs text-slate-500 mt-1">Link a bank or credit card</p>
            </div>
          </button>
        )}
      </div>

      <GlassCard className="bg-gradient-to-r from-blue-500/10 to-primary/10 border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
            <ShieldCheck size={48} className="text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Your financial data is encrypted with AES-256 and protected by multi-factor authentication. 
              We never store your full card numbers or sensitive bank credentials on our servers.
            </p>
          </div>
          <button className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-bold text-sm">
            Security Settings
          </button>
        </div>
      </GlassCard>

      {/* Add Account Modal */}
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
              <h2 className="text-2xl font-bold mb-6">Link New Account</h2>
              
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Account Name</label>
                  <input 
                    name="name"
                    required
                    placeholder="e.g. Chase Savings"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Initial Balance</label>
                    <input 
                      name="balance"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Type</label>
                    <select 
                      name="type"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm appearance-none"
                    >
                      <option value="Bank Account">Bank Account</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                  </div>
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
                    Link Account
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
