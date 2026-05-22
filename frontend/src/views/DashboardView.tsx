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

const DashboardView = () => {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 pb-8">
      <PageHeader title="Dashboard" breadcrumb="Home / Dashboard" />

      {/* ── Welcome Card ─────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false} className="relative overflow-hidden p-8 md:p-10">
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
              <GradientButton icon={<ArrowRight className="w-4 h-4" />} size="lg">
                Start Health Check
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="Health Score"
          value="87"
          subtitle="Good standing"
          color="blue"
        />
        <StatCard
          icon={<Shield className="w-5 h-5" />}
          label="Risk Level"
          value="Low"
          subtitle="No concerns detected"
          color="green"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Heart Rate"
          value="72"
          subtitle="bpm average"
          color="cyan"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Recent Activity"
          value="3"
          subtitle="Health checks today"
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
            <GlassCard key={i} className="p-6 cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <ArrowRight className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-primary mb-1">{card.title}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* ── Recent Health Insights ─────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Insights</h3>
        <GlassCard hover={false} className="divide-y divide-border/40">
          {[
            { label: 'Sleep Analysis', value: '7.2 hrs', status: 'Good', color: 'text-emerald-600' },
            { label: 'Activity Score', value: '68 / 100', status: 'Moderate', color: 'text-amber-600' },
            { label: 'Stress Indicator', value: 'Low', status: 'Healthy', color: 'text-emerald-600' },
            { label: 'Risk Prediction', value: 'Minimal', status: 'No Action', color: 'text-emerald-600' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
              <div>
                <p className="font-medium text-text-primary text-sm">{item.label}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-text-primary">{item.value}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-opacity-10 ${item.color}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;
