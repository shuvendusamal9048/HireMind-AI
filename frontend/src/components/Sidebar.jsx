import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Video,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Jobs', path: ROUTES.JOBS, icon: Briefcase, badge: 'Active' },
  { label: 'Candidates', path: ROUTES.CANDIDATES, icon: Users },
  { label: 'Interviews', path: ROUTES.INTERVIEWS, icon: Video },
  { label: 'Reports', path: ROUTES.REPORTS, icon: FileText },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? '80px' : '260px' }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 z-30 shrink-0 select-none shadow-sm"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800/80">
        <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 via-primary-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                HireMind <span className="text-primary-600 text-xs px-1.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 font-bold">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Recruitment Suite
              </span>
            </div>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User & Company Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold shrink-0">
            {user?.company_name ? user.company_name.charAt(0).toUpperCase() : <Building2 className="w-4 h-4" />}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.company_name || 'Acme Inc.'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.admin_name || user?.email || 'HR Admin'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
