import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageHeader from '../components/ui/PageHeader';

const diseaseCards = [
  { name: 'Diabetes', desc: 'A chronic condition affecting blood sugar regulation and insulin production.' },
  { name: 'Hypertension', desc: 'Persistently elevated blood pressure that damages arteries over time.' },
  { name: 'Asthma', desc: 'A respiratory condition causing airway inflammation and difficulty breathing.' },
  { name: 'Influenza', desc: 'A contagious viral infection affecting the respiratory system.' },
  { name: 'Migraine', desc: 'Intense headaches often accompanied by nausea and sensitivity to light.' },
  { name: 'Anemia', desc: 'A condition where blood lacks adequate healthy red blood cells.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EncyclopediaView = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setResult({
        disease: query,
        summary: `${query} is a medical condition that affects many individuals worldwide. Early detection and proper management are essential for positive outcomes.`,
        symptoms: ['Fever', 'Cough', 'Fatigue', 'Headache'],
        prevention: ['Wash hands frequently', 'Maintain a balanced diet', 'Exercise regularly', 'Get vaccinated if applicable'],
      });
      setIsSearching(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-8 pb-8">
      <PageHeader
        title="Disease Encyclopedia"
        breadcrumb="Home / Encyclopedia"
        subtitle="Search our AI-powered medical knowledge base"
      />

      {/* Search */}
      <motion.div variants={fadeUp}>
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            className="w-full pl-12 pr-36 py-4 rounded-2xl bg-white border border-border card-shadow text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search for a disease, symptom, or condition..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="gradient-primary text-white px-6 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 hover:shadow-md transition-shadow"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Search Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard hover={false} className="p-8">
            <h2 className="text-2xl font-bold text-primary capitalize mb-3">{result.disease}</h2>
            <p className="text-text-secondary leading-relaxed bg-slate-50 p-5 rounded-xl border border-border/30 mb-6">
              {result.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">Common Symptoms</h3>
                <ul className="space-y-2">
                  {result.symptoms.map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-text-primary">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">Prevention</h3>
                <ul className="space-y-2">
                  {result.prevention.map((p: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-text-primary">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Disease grid */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Browse Conditions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {diseaseCards.map((d, i) => (
            <GlassCard key={i} className="p-6 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-primary mb-1">{d.name}</h4>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{d.desc}</p>
              <button
                onClick={() => { setQuery(d.name); }}
                className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all"
              >
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EncyclopediaView;
