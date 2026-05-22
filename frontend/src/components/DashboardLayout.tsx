import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-obsidian text-slate-200 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 bg-charcoal/30 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
