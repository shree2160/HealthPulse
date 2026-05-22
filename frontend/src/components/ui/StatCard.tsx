import { type ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'cyan' | 'green' | 'amber' | 'red';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
    text: 'text-blue-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    icon: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    text: 'text-cyan-600',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    text: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-gradient-to-br from-amber-500 to-amber-600',
    text: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-gradient-to-br from-red-500 to-red-600',
    text: 'text-red-600',
  },
};

const StatCard = ({ icon, label, value, subtitle, color = 'blue' }: StatCardProps) => {
  const c = colorMap[color];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[24px] card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`${c.icon} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {/* Mini chart placeholder */}
        <div className="flex items-end gap-[3px] h-8">
          {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
            <div
              key={i}
              className={`w-[4px] rounded-full ${c.bg} ${c.text}`}
              style={{
                height: `${h}%`,
                backgroundColor: i === 6 ? undefined : undefined,
                opacity: i === 6 ? 1 : 0.4 + i * 0.08,
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${c.text} tracking-tight`}>{value}</p>
      {subtitle && <p className="text-text-secondary text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
