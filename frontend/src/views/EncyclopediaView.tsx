import React, { useState } from 'react';
import { Search, Book, Activity } from 'lucide-react';
import { searchEncyclopedia } from '../services/api.client';

const EncyclopediaView = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    try {
      const data = await searchEncyclopedia(query);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to search disease database. Please check if backend is running.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-100">Medical Encyclopedia</h1>
        <p className="text-slate-400 mt-2">Search our AI-powered database for conditions and symptoms.</p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          className="block w-full bg-obsidian border border-white/10 rounded-xl py-4 pl-12 pr-32 text-slate-200 focus:outline-none focus:border-cyber-orange transition-colors shadow-neumorphic"
          placeholder="Search for a disease, symptom, or condition..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="bg-cyber-orange hover:bg-[#E64A19] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results Area */}
      <div className="flex-1 bg-charcoal rounded-2xl shadow-neumorphic border border-white/5 p-8 overflow-y-auto mt-4 max-w-4xl">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-red-400 p-6 border border-red-500/20 bg-red-500/5 rounded-xl">
            <Activity className="w-12 h-12 mb-3 text-red-500 animate-pulse" />
            <p className="text-center text-lg font-semibold mb-1">Search Error</p>
            <p className="text-center text-slate-400 max-w-md">{error}</p>
          </div>
        ) : result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-cyber-orange mb-4 capitalize">{result.disease}</h2>
              <p className="text-slate-300 leading-relaxed text-lg bg-obsidian p-6 rounded-xl border border-white/5">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <ActivityIcon /> Common Symptoms
                </h3>
                <ul className="space-y-2">
                  {result.symptoms && result.symptoms.map((symptom: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-orange"></div>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <ShieldIcon /> Prevention
                </h3>
                <ul className="space-y-2">
                  {result.prevention && result.prevention.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Book className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Enter a search term above to learn more.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple helper icons
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-orange"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

export default EncyclopediaView;
