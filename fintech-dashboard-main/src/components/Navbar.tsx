import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  CreditCard, 
  User,
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  X,
  Shield,
  Eye
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { cn } from '../lib/utils';
import { PremiumDropdown } from './PremiumDropdown';
import logo from '../assets/logo.png';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Accounts', path: '/accounts', icon: CreditCard },
];

export const Navbar = () => {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const mobileNavOptions = useMemo(
    () =>
      navItems.map((item) => ({
        label: item.name,
        value: item.path,
        icon: <item.icon size={16} className="text-emerald-400" />,
        tone: 'slate' as const,
      })),
    []
  );

  const goToTransactionsSearch = () => {
    const q = searchValue.trim();
    if (!q) return;
    navigate(`/transactions?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
  // Hide when scrolling down, show when scrolling up.
    // Also keep it visible near the very top to avoid jitter.
    lastScrollYRef.current = window.scrollY ?? 0;

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const y = window.scrollY ?? 0;
        const lastY = lastScrollYRef.current;
        const delta = y - lastY;

        // Ignore tiny deltas to prevent flicker.
        if (Math.abs(delta) < 4) {
          lastScrollYRef.current = y;
          return;
        }

        if (y < 24) {
          setIsNavHidden(false);
          lastScrollYRef.current = y;
          return;
        }

        if (delta > 0) {
          // scrolling down
          setIsNavHidden(true);
        } else {
          // scrolling up
          setIsNavHidden(false);
        }

        lastScrollYRef.current = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.nav
  data-theme={theme}
  className="fixed top-0 left-0 right-0 z-50 px-8 py-6 pointer-events-none"
      initial={false}
      animate={isNavHidden ? { y: '-110%', opacity: 0 } : { y: '0%', opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-3 w-auto sm:w-48 min-w-0 text-left"
        >
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain shrink-0 data-[theme=light]:brightness-0"
          />
          <span className="text-base sm:text-xl font-bold tracking-tight text-white truncate data-[theme=light]:text-black">Wallet Warden</span>
        </button>

        {/* Center Pill Navigation */}
  <div className="glass-pill p-1.5 hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2",
                  isActive
                    ? "text-white data-[theme=light]:text-black"
                    : "text-slate-400 hover:text-slate-200 data-[theme=light]:text-black data-[theme=light]:hover:text-black"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] data-[theme=light]:bg-slate-900/5 data-[theme=light]:shadow-[inset_0_1px_1px_rgba(2,6,23,0.08)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon
                    size={16}
                    className={cn(
                      isActive ? "text-emerald-400" : "opacity-70",
                      "data-[theme=light]:opacity-100 data-[theme=light]:text-black"
                    )}
                  />
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 w-auto">
          {/* Mobile nav */}
          <div className="md:hidden">
            <PremiumDropdown
              size="sm"
              align="right"
              value={location.pathname}
              options={mobileNavOptions}
              onChange={(path) => navigate(path)}
              iconButton
              hideSelectedIcon
              buttonClassName="glass-button rounded-full p-2.5 [&_svg]:stroke-current [&_svg]:fill-none data-[theme=light]:[&_svg]:stroke-black"
              buttonContent={<Menu size={18} />}
              menuClassName="w-44 z-[9999]"
            />
          </div>
          
          {/* Role Switcher (Premium dropdown) */}
          <div className="hidden sm:block mr-0 sm:mr-2">
            <PremiumDropdown
              size="sm"
              align="right"
              value={role}
              options={[
                { label: 'Admin', value: 'Admin', icon: <Shield size={16} className="text-emerald-400" />, tone: 'emerald' },
                { label: 'Viewer', value: 'Viewer', icon: <Eye size={16} className="text-blue-400" />, tone: 'blue' },
              ]}
              onChange={(v) => setRole(v as any)}
              buttonClassName="glass-button rounded-full px-3 py-2 data-[theme=light]:text-black"
              menuClassName="w-40"
            />
          </div>

          <motion.div 
            layout
            className={cn(
              "flex items-center glass-button rounded-full overflow-hidden",
              isSearchExpanded ? "w-40 sm:w-56 md:w-64 px-2" : "w-10 justify-center"
            )}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <button 
              onClick={() => {
                if (!isSearchExpanded) {
                  setIsSearchExpanded(true);
                  return;
                }
                goToTransactionsSearch();
              }}
              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white shrink-0 data-[theme=light]:text-black data-[theme=light]:hover:text-black [&_svg]:stroke-current [&_svg]:fill-none data-[theme=light]:[&_svg]:stroke-black"
            >
              <Search size={16} />
            </button>
            
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.input
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: 0 }}
                  autoFocus
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      goToTransactionsSearch();
                    }
                  }}
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full data-[theme=light]:text-black data-[theme=light]:placeholder:text-slate-700"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSearchExpanded && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchExpanded(false);
                    setSearchValue('');
                  }}
      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white shrink-0 data-[theme=light]:text-black data-[theme=light]:hover:text-black [&_svg]:stroke-current [&_svg]:fill-none data-[theme=light]:[&_svg]:stroke-black"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

    <button className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-slate-300 hover:text-white relative data-[theme=light]:text-black data-[theme=light]:hover:text-black [&_svg]:stroke-current [&_svg]:fill-none data-[theme=light]:[&_svg]:stroke-black">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] data-[theme=light]:border-white"></span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
    className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-slate-300 hover:text-white data-[theme=light]:text-black data-[theme=light]:hover:text-black [&_svg]:stroke-current [&_svg]:fill-none data-[theme=light]:[&_svg]:stroke-black"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

  <NavLink to="/profile" className="w-10 h-10 rounded-full glass-button p-0.5 data-[theme=light]:text-black [&_svg]:stroke-current [&_svg]:fill-none data-[theme=light]:[&_svg]:stroke-black">
    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border border-emerald-500/20 flex items-center justify-center overflow-hidden data-[theme=light]:from-slate-950/[0.06] data-[theme=light]:to-slate-950/[0.02] data-[theme=light]:border-black/10">
        <User size={16} className="text-emerald-400 data-[theme=light]:text-black" />
            </div>
          </NavLink>
        </div>

      </div>
  </motion.nav>
  );
};
