import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import TriageView from './views/TriageView';
import ChatView from './views/ChatView';
import EncyclopediaView from './views/EncyclopediaView';
import AuthPage from './views/AuthPage';

// Route guard — redirects to /auth if not logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-cyber-orange/30 border-t-cyber-orange rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-medium">Loading...</span>
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
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-cyber-orange/30 border-t-cyber-orange rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            <Route index element={<TriageView />} />
            <Route path="chat" element={<ChatView />} />
            <Route path="encyclopedia" element={<EncyclopediaView />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
