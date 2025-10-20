import React from 'react';
import type { View } from '../types';
import { DashboardIcon, ProjectIcon } from './icons';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ view, label, icon, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-500 text-white shadow-lg'
          : 'text-slate-600 hover:bg-primary-100 hover:text-primary-700'
      }`}
    >
      {icon}
      <span className="ml-4 font-semibold">{label}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: 'dashboard' as View, label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { view: 'propositions' as View, label: 'Propositions', icon: <ProjectIcon className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl h-screen flex flex-col p-4 fixed">
      <div className="flex items-center mb-8 px-2">
         <div className="bg-primary-500 rounded-lg p-2 mr-3">
             <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.19.75.75 0 0 1-1.496.065 7.502 7.502 0 0 0-14.992 0 .75.75 0 0 1-1.496-.065 9.005 9.005 0 0 1 5.9-8.19A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" /></svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800">AssociaManage</h1>
      </div>
      <nav>
        <ul className="space-y-3">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              view={item.view}
              label={item.label}
              icon={item.icon}
              isActive={currentView === item.view || (currentView === 'propositionDetail' && item.view === 'propositions')}
              onClick={() => onViewChange(item.view)}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-slate-100 rounded-lg text-center">
        <p className="text-sm text-slate-600">© 2024 AssociaManage</p>
        <p className="text-xs text-slate-400 mt-1">Gérez votre association avec simplicité.</p>
      </div>
    </aside>
  );
};