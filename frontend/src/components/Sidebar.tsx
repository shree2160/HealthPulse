import { NavLink } from 'react-router-dom';
import { Stethoscope, MessageSquare, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DailyHealthTipWidget = () => (
  <div className="mt-auto bg-charcoal p-4 rounded-xl shadow-neumorphic border border-white/5">
    <h3 className="text-cyber-orange text-sm font-semibold mb-2">Daily Tip</h3>
    <p className="text-slate-300 text-xs leading-relaxed">
      Remember to look away from your screen every 20 minutes to prevent eye strain.
    </p>
  </div>
);

const Sidebar = () => {
  const { user, signOut } = useAuth();

  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0];
  const userInitial = (userName?.[0] || 'U').toUpperCase();

  return (
    <aside className="w-64 h-screen bg-obsidian border-r border-white/10 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-cyber-orange flex items-center justify-center shadow-[0_0_10px_rgba(255,87,34,0.5)]">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-slate-200">HealthPulse</h1>
      </div>

      {/* User Profile Card */}
      <div className="bg-charcoal rounded-xl p-3 mb-6 border border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-cyber-orange/20 border border-cyber-orange/30 flex items-center justify-center flex-shrink-0">
          <span className="text-cyber-orange font-bold text-sm">{userInitial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200 truncate">{userName}</p>
          <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-charcoal text-cyber-orange shadow-neumorphic'
                : 'text-slate-400 hover:bg-charcoal/50 hover:text-slate-200'
            }`
          }
        >
          <Stethoscope className="w-5 h-5" />
          <span className="font-medium">Triage</span>
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-charcoal text-cyber-orange shadow-neumorphic'
                : 'text-slate-400 hover:bg-charcoal/50 hover:text-slate-200'
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Voice Chat</span>
        </NavLink>

        <NavLink
          to="/encyclopedia"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-charcoal text-cyber-orange shadow-neumorphic'
                : 'text-slate-400 hover:bg-charcoal/50 hover:text-slate-200'
            }`
          }
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Encyclopedia</span>
        </NavLink>
      </nav>

      {/* Daily Tip */}
      <DailyHealthTipWidget />

      {/* Logout */}
      <button
        onClick={signOut}
        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium text-sm">Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
