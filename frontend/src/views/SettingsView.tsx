import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, LogOut } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SettingsView = () => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-8 pb-8 max-w-3xl"
    >
      <PageHeader
        title="Settings"
        breadcrumb="Home / Settings"
        subtitle="Manage your account and application preferences"
      />

      {/* Profile */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false} className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Health User</h3>
              <p className="text-sm text-text-secondary">user@healthpulse.ai</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Health User"
                className="w-full rounded-xl bg-slate-50 border border-border px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Age</label>
              <input
                type="number"
                defaultValue={28}
                className="w-full rounded-xl bg-slate-50 border border-border px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false} className="divide-y divide-border/30">
          {[
            { icon: Bell, label: 'Notifications', desc: 'Receive health reminders and alerts' },
            { icon: Shield, label: 'Privacy', desc: 'Manage data sharing preferences' },
            { icon: Palette, label: 'Appearance', desc: 'Theme and display settings' },
            { icon: Globe, label: 'Language', desc: 'English (US)' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer flex-shrink-0">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          ))}
        </GlassCard>
      </motion.div>

      {/* Sign out */}
      <motion.div variants={fadeUp}>
        <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsView;
