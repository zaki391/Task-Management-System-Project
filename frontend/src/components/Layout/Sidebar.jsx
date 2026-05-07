import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">TaskFlow</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-2
            ${isActive 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
          `}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
