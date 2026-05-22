import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import TriageView from './views/TriageView';
import ChatView from './views/ChatView';
import EncyclopediaView from './views/EncyclopediaView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<TriageView />} />
          <Route path="chat" element={<ChatView />} />
          <Route path="encyclopedia" element={<EncyclopediaView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
