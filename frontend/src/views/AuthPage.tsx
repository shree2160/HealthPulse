// =============================================
// AuthPage — Login & Signup with Supabase
// =============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created! Check your email to confirm, or sign in if auto-confirmed.');
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        }
        // On success, AuthContext updates → App re-renders → redirects to dashboard
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10"
      >
        <GlassCard hover={false} className="p-8 backdrop-blur-2xl bg-white/70">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-lg mb-4"
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-text-primary tracking-wide">HealthPulse</h1>
            <p className="text-text-secondary text-sm mt-1">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-xl flex items-center gap-2 mb-4 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-success/10 border border-success/20 text-success p-3 rounded-xl flex items-center gap-2 mb-4 text-sm"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (signup only) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/50 border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/50 border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/50 border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-2 text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <span className="text-text-secondary text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={toggleMode}
              className="text-primary text-sm font-semibold ml-1.5 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-[10px] text-text-secondary text-center leading-relaxed uppercase tracking-wider">
              ⚠️ AI Assistant only. Not a substitute for professional medical diagnosis.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AuthPage;
