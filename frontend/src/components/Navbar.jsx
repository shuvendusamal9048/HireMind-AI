import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Plus,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Map route pathname to clean title
  const getPageTitle = () => {
    switch (location.pathname) {
      case ROUTES.DASHBOARD:
        return 'Overview Dashboard';
      case ROUTES.JOBS:
        return 'Job Postings';
      case ROUTES.CANDIDATES:
        return 'Candidate Pipeline';
      case ROUTES.INTERVIEWS:
        return 'AI Interview Sessions';
      case ROUTES.REPORTS:
        return 'Evaluation Reports';
      case ROUTES.ANALYTICS:
        return 'Hiring Analytics';
      case ROUTES.SETTINGS:
        return 'Company Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors">
      {/* Title & Search */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {getPageTitle()}
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, job title..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 pl-9 pr-12 py-2 rounded-xl border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <button
          onClick={() => navigate(ROUTES.JOBS)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Job</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Button */}
        <button
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-blue-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {user?.admin_name ? user.admin_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.admin_name || 'Admin User'}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                {user?.email || 'admin@company.com'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {user?.company_name || 'HireMind AI Client'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@company.com'}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate(ROUTES.SETTINGS);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Company Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
