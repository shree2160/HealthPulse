import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  BookOpen,
  Lightbulb,
  Mic,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/symptom-checker', icon: Stethoscope, label: 'Symptom Checker' },
  { to: '/chat', icon: MessageSquare, label: 'Health Chat' },
  { to: '/encyclopedia', icon: BookOpen, label: 'Encyclopedia' },
  { to: '/insights', icon: Lightbulb, label: 'Health Insights' },
  { to: '/voice', icon: Mic, label: 'Voice Assistant' },
  { to: '/logs', icon: ClipboardList, label: 'Health Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col bg-white/60 backdrop-blur-2xl border-r border-border/50 z-30 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg flex-shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-lg font-bold text-text-primary tracking-tight">HealthPulse</h1>
              <p className="text-[10px] text-text-secondary font-medium -mt-0.5 tracking-wide uppercase">AI Assistant</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile / Logout */}
      <div className="px-3 pb-2 flex-shrink-0">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger hover:bg-danger/10 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-semibold whitespace-nowrap overflow-hidden"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <div className="px-3 pb-4 flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors text-sm"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
