import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Settings, Bell } from 'lucide-react';
import { cn } from '../utils/cn';



const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
      active ? "text-indigo-600" : "text-gray-500 hover:text-indigo-400"
    )}
  >
    <Icon size={20} />
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Calendar size={18} />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Markit</h1>
          </div>
          <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Home" 
            active={location.pathname === '/'} 
          />
          <NavItem 
            to="/checklist" 
            icon={Calendar} 
            label="Checklist" 
            active={location.pathname === '/checklist'} 
          />
          <NavItem 
            to="/analytics" 
            icon={BarChart3} 
            label="Stats" 
            active={location.pathname === '/analytics'} 
          />
          <NavItem 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            active={location.pathname === '/settings'} 
          />
        </div>
      </nav>
    </div>
  );
};
