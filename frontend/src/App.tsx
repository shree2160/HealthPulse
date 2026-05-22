import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import AuthPage from './views/AuthPage';

const DashboardView = lazy(() => import('./views/DashboardView'));
const SymptomCheckerView = lazy(() => import('./views/SymptomCheckerView'));
const ChatView = lazy(() => import('./views/ChatView'));
const EncyclopediaView = lazy(() => import('./views/EncyclopediaView'));
const InsightsView = lazy(() => import('./views/InsightsView'));
const VoiceAssistantView = lazy(() => import('./views/VoiceAssistantView'));
const HealthLogsView = lazy(() => import('./views/HealthLogsView'));
const SettingsView = lazy(() => import('./views/SettingsView'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

// Route guard — redirects to /auth if not logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-text-secondary text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

// Redirect away from /auth if already logged in
function AuthRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public auth route */}
            <Route path="/auth" element={<AuthRoute />} />

            {/* Protected dashboard routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardView />} />
              <Route path="symptom-checker" element={<SymptomCheckerView />} />
              <Route path="chat" element={<ChatView />} />
              <Route path="encyclopedia" element={<EncyclopediaView />} />
              <Route path="insights" element={<InsightsView />} />
              <Route path="voice" element={<VoiceAssistantView />} />
              <Route path="logs" element={<HealthLogsView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
