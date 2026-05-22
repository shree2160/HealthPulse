import { NavLink } from 'react-router-dom';
import { Stethoscope, MessageSquare, BookOpen } from 'lucide-react';

const DailyHealthTipWidget = () => (
  <div className="mt-auto bg-charcoal p-4 rounded-xl shadow-neumorphic border border-white/5">
    <h3 className="text-cyber-orange text-sm font-semibold mb-2">Daily Tip</h3>
    <p className="text-slate-300 text-xs leading-relaxed">
      Remember to look away from your screen every 20 minutes to prevent eye strain.
    </p>
  </div>
);

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-obsidian border-r border-white/10 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-cyber-orange flex items-center justify-center shadow-[0_0_10px_rgba(255,87,34,0.5)]">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-slate-200">HealthPulse</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink
          to="/"
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

      <DailyHealthTipWidget />
    </aside>
  );
};

export default Sidebar;
