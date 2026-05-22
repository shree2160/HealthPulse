import { motion } from 'framer-motion';
import { ClipboardList, Calendar, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const riskConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  Low: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  Moderate: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  High: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

const HealthLogsView = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchLogs = async () => {
        const { data, error } = await supabase
          .from('health_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setLogs(data.map(log => {
            const d = new Date(log.created_at);
            return {
              id: log.log_id,
              date: d.toLocaleDateString(),
              time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              symptoms: log.symptoms,
              riskLevel: log.risk_level,
              categories: [],
            };
          }));
        }
      };
      fetchLogs();
    }
  }, [user]);
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-8 pb-8"
    >
      <PageHeader
        title="Health Logs"
        breadcrumb="Home / Health Logs"
        subtitle="View your past symptom checks and triage history"
      />

      {/* Summary row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[24px] card-shadow p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-text-secondary text-xs font-medium">Total Checks</p>
            <p className="text-2xl font-bold text-text-primary">{logs.length}</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[24px] card-shadow p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-text-secondary text-xs font-medium">Low Risk</p>
            <p className="text-2xl font-bold text-emerald-600">
              {logs.filter((l) => l.riskLevel === 'Low').length}
            </p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[24px] card-shadow p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-text-secondary text-xs font-medium">Moderate Risk</p>
            <p className="text-2xl font-bold text-amber-600">
              {logs.filter((l) => l.riskLevel === 'Moderate').length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Log list */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false} className="divide-y divide-border/30 overflow-hidden">
          {logs.map((log) => {
            const cfg = riskConfig[log.riskLevel] || riskConfig.Low;
            const Icon = cfg.icon;
            return (
              <div
                key={log.id}
                className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/60 transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cfg.bg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{log.symptoms}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-text-secondary" />
                    <span className="text-xs text-text-secondary">
                      {log.date} at {log.time}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-wrap gap-1.5">
                  {log.categories.map((cat: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color} hidden md:inline`}>
                  {log.riskLevel}
                </span>
                <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            );
          })}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default HealthLogsView;
