import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const CandidateLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Candidate Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            HireMind <span className="text-primary-600 text-xs px-1.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 font-bold">AI Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Proctored Candidate Session</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;
