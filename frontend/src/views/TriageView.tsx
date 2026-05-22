import { useState } from 'react';
import { Activity } from 'lucide-react';

const TriageView = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setIsSubmitting(true);
    // Mock API call delay
    setTimeout(() => {
      setResult({
        riskLevel: 'Moderate',
        primaryRecommendation: 'Rest and drink plenty of fluids. Consult a doctor if symptoms persist or fever exceeds 102°F.',
        possibleCategories: ['Viral Infection', 'Seasonal Flu']
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Symptom Triage</h1>
        <p className="text-slate-400 mt-2">Describe how you're feeling and our AI will assess your risk level.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Form Section */}
        <div className="bg-charcoal rounded-2xl p-6 shadow-neumorphic border border-white/5 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Describe Symptoms</h2>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <textarea
              className="w-full flex-1 bg-obsidian rounded-xl p-4 text-slate-200 border border-white/10 focus:outline-none focus:border-cyber-orange transition-colors resize-none mb-4"
              placeholder="E.g., I have had a headache and mild fever since yesterday morning..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting || !symptoms.trim()}
              className="bg-cyber-orange hover:bg-[#E64A19] text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
              Analyze Symptoms
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-charcoal rounded-2xl p-6 shadow-neumorphic border border-white/5 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Assessment Result</h2>
          
          {result ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-obsidian rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">Risk Level</span>
                  <span className={`font-mono font-bold text-lg ${
                    result.riskLevel === 'Low' ? 'text-green-400' :
                    result.riskLevel === 'Moderate' ? 'text-yellow-400' : 'text-red-500'
                  }`}>
                    {result.riskLevel}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Recommendation</h3>
                <p className="text-slate-200 leading-relaxed bg-obsidian/50 p-4 rounded-lg">
                  {result.primaryRecommendation}
                </p>
              </div>

              <div>
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Possible Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {result.possibleCategories.map((cat: string, i: number) => (
                    <span key={i} className="bg-cyber-orange/20 text-cyber-orange border border-cyber-orange/30 px-3 py-1 rounded-full text-sm font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-center max-w-xs">Submit your symptoms on the left to receive an AI-powered risk assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriageView;
