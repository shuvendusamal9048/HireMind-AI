import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ShieldCheck, Home } from 'lucide-react';
import Button from '../components/Button';

export const InterviewCompleted = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      
      {/* Background Soft Glow Bulbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative z-10"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Assessment Submitted!</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Thank you for completing your SkillAssess AI technical examination. Your answers have been recorded and submitted for AI evaluation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <p className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Automated AI Evaluation in Progress</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            The AI HR Evaluation Engine is scoring your technical MCQs, coding solution, and communication performance. The HR team will contact you shortly.
          </p>
        </div>

        <div className="pt-2 text-xs text-slate-400 font-mono flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Session Closed & Response Secured</span>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewCompleted;
