import { motion } from 'framer-motion';
import { Moon, Flame, Brain, ShieldAlert, Lightbulb } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const insightCards = [
  {
    icon: Moon,
    title: 'Sleep Analysis',
    value: '7.2 hrs',
    status: 'Good',
    statusColor: 'text-emerald-600 bg-emerald-50',
    detail: 'Your average sleep duration is within the recommended 7-9 hour range. Deep sleep cycles appear healthy.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Flame,
    title: 'Activity Score',
    value: '68 / 100',
    status: 'Moderate',
    statusColor: 'text-amber-600 bg-amber-50',
    detail: 'You are moderately active. Consider adding 20 minutes of light exercise to improve cardiovascular health.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Brain,
    title: 'Stress Indicator',
    value: 'Low',
    status: 'Healthy',
    statusColor: 'text-emerald-600 bg-emerald-50',
    detail: 'Your stress markers are within healthy limits. Maintain your current wellness routines.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: ShieldAlert,
    title: 'Risk Prediction',
    value: 'Minimal',
    status: 'No Action',
    statusColor: 'text-emerald-600 bg-emerald-50',
    detail: 'Based on your recent data, no elevated health risks have been detected at this time.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const recommendations = [
  'Drink at least 8 glasses of water daily to stay hydrated.',
  'Take breaks every 60 minutes to reduce prolonged sitting strain.',
  'Incorporate fruits and vegetables into every meal for balanced nutrition.',
  'Practice deep breathing exercises to manage daily stress levels.',
];

const InsightsView = () => {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-8 pb-8">
      <PageHeader
        title="Health Insights"
        breadcrumb="Home / Health Insights"
        subtitle="AI-powered analysis of your health metrics"
      />

      {/* Insight Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {insightCards.map((card, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${card.statusColor}`}>
                {card.status}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-text-secondary mb-1">{card.title}</h4>
            <p className="text-2xl font-bold text-text-primary mb-3">{card.value}</p>
            <p className="text-sm text-text-secondary leading-relaxed">{card.detail}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Daily Recommendations
        </h3>
        <GlassCard hover={false} className="p-6">
          <ul className="space-y-4">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-text-primary leading-relaxed">{rec}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default InsightsView;
