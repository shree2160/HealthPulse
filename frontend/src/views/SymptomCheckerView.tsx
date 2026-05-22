import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Upload, Sparkles, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import PageHeader from '../components/ui/PageHeader';

const suggestedSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea',
  'Chest pain', 'Shortness of breath', 'Dizziness',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SymptomCheckerView = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setResult({
        riskLevel: 'Moderate',
        confidence: 82,
        primaryRecommendation:
          'Rest and drink plenty of fluids. Consult a doctor if symptoms persist or fever exceeds 102 F.',
        possibleCategories: ['Viral Infection', 'Seasonal Flu'],
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const addSuggestion = (s: string) => {
    setSymptoms((prev) => (prev ? `${prev}, ${s.toLowerCase()}` : s.toLowerCase()));
  };

  const riskConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
    Low: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    Moderate: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    High: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-8 pb-8">
      <PageHeader
        title="AI Symptom Checker"
        breadcrumb="Home / Symptom Checker"
        subtitle="Describe your symptoms for an AI-powered risk assessment"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Column */}
        <motion.div variants={fadeUp} className="lg:col-span-3 space-y-5">
          <GlassCard hover={false} className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="symptom-input" className="block text-sm font-semibold text-text-primary mb-2">
                  Describe your symptoms
                </label>
                <textarea
                  id="symptom-input"
                  rows={5}
                  className="w-full rounded-2xl bg-slate-50 border border-border p-4 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  placeholder="E.g., I have had a headache and mild fever since yesterday morning..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>

              {/* Suggested symptoms */}
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Suggested</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSymptoms.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSuggestion(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <GradientButton
                  type="submit"
                  loading={isSubmitting}
                  disabled={!symptoms.trim()}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Analyze Symptoms
                </GradientButton>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label="Upload file"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Result Column */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <GlassCard hover={false} className="p-6 h-full">
            <h3 className="font-semibold text-text-primary mb-4">Assessment Result</h3>

            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Risk badge */}
                {(() => {
                  const cfg = riskConfig[result.riskLevel] || riskConfig.Low;
                  const Icon = cfg.icon;
                  return (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                      <div>
                        <p className="text-xs font-semibold text-text-secondary">Risk Level</p>
                        <p className={`text-lg font-bold ${cfg.color}`}>{result.riskLevel}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Confidence */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-text-secondary">AI Confidence</span>
                    <span className="text-xs font-bold text-primary">{result.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1">Recommendation</p>
                  <p className="text-sm text-text-primary leading-relaxed bg-slate-50 p-4 rounded-xl">
                    {result.primaryRecommendation}
                  </p>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-2">Possible Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {result.possibleCategories.map((cat: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-secondary py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm text-center max-w-[200px]">Submit your symptoms to receive an AI-powered assessment.</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SymptomCheckerView;
