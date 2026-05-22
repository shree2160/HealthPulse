import { Search, Bell, User } from 'lucide-react';

const TopHeader = () => {
  return (
    <header className="h-[72px] flex items-center justify-between px-8 border-b border-border/40 bg-white/40 backdrop-blur-xl sticky top-0 z-20">
      {/* Left: empty, page title is inside each view */}
      <div />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-9 pr-4 py-2 rounded-full bg-slate-100 border border-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
          />
        </div>

        {/* Notification */}
        <button
          className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary hover:bg-slate-200 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
        </button>

        {/* Health Score */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Score: 87</span>
        </div>

        {/* Profile */}
        <button
          className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow"
          aria-label="Profile menu"
        >
          <User className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
