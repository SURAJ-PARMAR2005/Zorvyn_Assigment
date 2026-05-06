import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { useFinanceStore } from '../store/useFinanceStore';
import { 
  User, 
  Mail, 
  Shield, 
  Globe, 
  Bell, 
  Lock, 
  LogOut, 
  Download, 
  ChevronRight,
  Eye,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Profile = () => {
  const { role, setRole, transactions, accounts } = useFinanceStore();

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

  const handleExport = (format: 'JSON' | 'CSV') => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === 'JSON') {
      const payload = {
        exportedAt: new Date().toISOString(),
        role,
        accounts,
        transactions,
      };
      downloadTextFile(`ethereal-finance-export-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json');
      return;
    }

    // CSV: export transactions only (most common)
    const headers = ['id', 'date', 'name', 'category', 'type', 'amount', 'status'];
    const rows = transactions.map((t) => [t.id, t.date, t.name, t.category, t.type, t.amount, t.status]);
    const csv = [headers.join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
    downloadTextFile(`transactions-${stamp}.csv`, csv, 'text/csv;charset=utf-8');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 glow-green">
            <img 
              src="https://picsum.photos/seed/user/200/200" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-white border-4 border-background hover:scale-110 transition-all">
            <Settings size={16} />
          </button>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold">Satvik Sharma</h1>
          <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail size={16} /> satvikravisharma07@gmail.com
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
              role === 'Admin' ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-500"
            )}>
              {role === 'Admin' ? <Shield size={14} /> : <Eye size={14} />}
              {role} Account
            </div>
            <span className="text-xs text-slate-500">Member since April 2024</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-6">
          <h3 className="text-lg font-bold">Account Settings</h3>
          <div className="space-y-4">
            {[
              { icon: User, label: "Personal Information", desc: "Name, email, phone" },
              { icon: Lock, label: "Security & Privacy", desc: "Password, 2FA, data" },
              { icon: Bell, label: "Notifications", desc: "Alerts, emails, push" },
              { icon: Globe, label: "Language & Region", desc: "English (US), USD ($)" },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white/5 text-slate-400 group-hover:text-primary transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-lg font-bold mb-6">Role Simulation</h3>
            <p className="text-sm text-slate-400 mb-6">
              Switch roles to see how the UI adapts. Admins can manage data, while Viewers have read-only access.
            </p>
            <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10">
              <button 
                onClick={() => setRole('Admin')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                  role === 'Admin' ? "bg-primary text-white glow-green" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Shield size={16} /> Admin
              </button>
              <button 
                onClick={() => setRole('Viewer')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                  role === 'Viewer' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Eye size={16} /> Viewer
              </button>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-bold mb-6">Data Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleExport('JSON')}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Download size={24} />
                </div>
                <span className="text-xs font-bold">Export JSON</span>
              </button>
              <button 
                onClick={() => handleExport('CSV')}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Download size={24} />
                </div>
                <span className="text-xs font-bold">Export CSV</span>
              </button>
            </div>
          </GlassCard>

          <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
