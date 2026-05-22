import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, AlertTriangle, ShieldCheck } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { getRadarAnalysis } from '../services/api.client';
import { RadarResponse } from '../types/models';

export default function EpidemicRadar() {
  const [radarState, setRadarState] = useState<RadarResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('your area');

  const fetchRadar = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Reverse Geocode
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            
            const city = geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown City';
            const state = geoData.address.state || 'Unknown State';
            setLocationName(city);

            const result = await getRadarAnalysis(city, state, 'General wellness check, no severe symptoms.');
            setRadarState(result);
            setLoading(false);
          },
          async (error) => {
            console.error('Geolocation error:', error);
            // Fallback to a mock location if user denies location
            const result = await getRadarAnalysis('Mumbai', 'Maharashtra', 'General wellness check, no severe symptoms.');
            setLocationName('Mumbai');
            setRadarState(result);
            setLoading(false);
          }
        );
      } else {
        // Fallback
        const result = await getRadarAnalysis('Mumbai', 'Maharashtra', 'General wellness check, no severe symptoms.');
        setLocationName('Mumbai');
        setRadarState(result);
        setLoading(false);
      }
    } catch (error) {
      console.error('Radar failed:', error);
      setLoading(false);
    }
  };



  const hasThreat = radarState?.suspectedLocalThreat && radarState.suspectedLocalThreat.trim() !== '' && radarState.riskLevel !== 'Low';

  return (
    <GlassCard 
      hover={false} 
      className={`relative overflow-hidden transition-all duration-700 h-full ${
        hasThreat 
          ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.2)]' 
          : 'border-border/30'
      }`}
    >
      <div className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radar className={`w-5 h-5 ${hasThreat ? 'text-orange-500' : 'text-primary'}`} />
              {loading && (
                <span className="absolute top-0 left-0 w-full h-full rounded-full animate-ping bg-primary/40" />
              )}
            </div>
            <h3 className="font-semibold text-text-primary">Hyper-Local Radar</h3>
          </div>
          
          <button 
            onClick={fetchRadar} 
            disabled={loading}
            className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-slate-100 text-text-secondary hover:bg-primary/10 hover:text-primary rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Scan Now'}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              {/* Radar Sweep Animation */}
              <div className="relative w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(56,189,248,0.4)_360deg)] animate-spin" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-xs text-text-secondary text-center animate-pulse">
                Scanning environmental vectors...
              </p>
            </div>
          ) : hasThreat ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50/50 border border-orange-200 p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-800 mb-1">
                    ⚠️ Alert: Local Threat Detected
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed mb-2">
                    {radarState.suspectedLocalThreat}
                  </p>
                  <p className="text-[11px] font-medium text-orange-600/80">
                    {radarState.primaryRecommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-text-primary mb-1">Area is Safe</p>
              <p className="text-xs text-text-secondary">
                Monitoring {locationName} for localized health risks. No current threats detected.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative subtle radar rings for background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-black" />
      </div>
    </GlassCard>
  );
}
