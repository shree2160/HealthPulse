import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

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

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="symptom-checker" element={<SymptomCheckerView />} />
            <Route path="chat" element={<ChatView />} />
            <Route path="encyclopedia" element={<EncyclopediaView />} />
            <Route path="insights" element={<InsightsView />} />
            <Route path="voice" element={<VoiceAssistantView />} />
            <Route path="logs" element={<HealthLogsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
