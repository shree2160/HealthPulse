import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Shield,
  Activity,
  Clock,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import StatCard from '../components/ui/StatCard';
import PageHeader from '../components/ui/PageHeader';
import EpidemicRadar from '../components/EpidemicRadar';

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const DashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('health_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4)
        .then(({ data, error }) => {
          if (data && !error) {
            setRecentLogs(data);
          }
        });
    }
  }, [user]);
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 pb-8">
      <PageHeader title="Dashboard" breadcrumb="Home / Dashboard" />


      {/* ── Top Section: Welcome & Radar ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} className="lg:col-span-2 h-full">
          <GlassCard hover={false} className="relative overflow-hidden p-8 md:p-10 h-full flex flex-col justify-center">
            {/* Animated blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-accent/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />

            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight">
                Welcome to <span className="text-gradient">HealthPulse AI</span>
              </h2>
              <p className="text-text-secondary mt-3 text-base leading-relaxed">
                Smarter health awareness through AI-powered insights. Get personalized triage, chat with our medical AI, and stay informed.
              </p>
              <div className="mt-6">
                <GradientButton onClick={() => navigate('/symptom-checker')} icon={<ArrowRight className="w-4 h-4" />} size="lg">
                  Start Health Check
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-1 h-full">
          <EpidemicRadar />
        </motion.div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="Health Score"
          value="--"
          subtitle="Not calculated"
          color="blue"
        />
        <StatCard
          icon={<Shield className="w-5 h-5" />}
          label="Risk Level"
          value={recentLogs.length > 0 ? recentLogs[0].risk_level : "N/A"}
          subtitle="Latest assessment"
          color={recentLogs.length > 0 && recentLogs[0].risk_level === 'High' ? 'red' : 'green'}
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Heart Rate"
          value="--"
          subtitle="Connect device"
          color="cyan"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Recent Activity"
          value={recentLogs.length.toString()}
          subtitle="Health logs found"
          color="amber"
        />
      </motion.div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: 'AI Symptom Checker',
              desc: 'Describe your symptoms and receive an AI-powered risk assessment.',
              color: 'from-blue-500 to-blue-600',
              link: '/symptom-checker',
            },
            {
              title: 'Health Chat',
              desc: 'Have a conversation with our AI health assistant about any concerns.',
              color: 'from-cyan-500 to-cyan-600',
              link: '/chat',
            },
            {
              title: 'Disease Encyclopedia',
              desc: 'Search our database for conditions, symptoms, and prevention tips.',
              color: 'from-emerald-500 to-emerald-600',
              link: '/encyclopedia',
            },
          ].map((card, i) => (
            <div key={i} onClick={() => navigate(card.link)}>
              <GlassCard className="p-6 cursor-pointer group h-full">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <ArrowRight className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-text-primary mb-1">{card.title}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Recent Health Insights ─────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Insights</h3>
        <GlassCard hover={false} className="divide-y divide-border/40">
          {recentLogs.length > 0 ? (
            recentLogs.map((item, i) => {
              let color = 'text-emerald-600';
              let status = 'Healthy';
              if (item.risk_level === 'Moderate') { color = 'text-amber-600'; status = 'Caution'; }
              if (item.risk_level === 'High') { color = 'text-red-600'; status = 'Action Required'; }
              
              const date = new Date(item.created_at).toLocaleDateString();

              return (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-text-primary text-sm truncate">{item.symptoms}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm font-semibold text-text-secondary hidden sm:inline">{date}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-opacity-10 ${color}`}>
                      {item.risk_level}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center text-sm text-text-secondary">
              No recent health logs found.
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;
