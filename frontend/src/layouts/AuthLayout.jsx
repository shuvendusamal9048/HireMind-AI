import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const features = [
  'Automated AI-driven candidate screening',
  'Real-time coding & behavioral AI interviews',
  'Comprehensive technical scorecard generation',
  'Instant interview scheduling & credential mailing',
];

export const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8FAFC] dark:bg-[#0B0F17] transition-colors duration-200">
      {/* Left Feature Section */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            HireMind <span className="text-primary-400">AI</span>
          </span>
        </div>

        {/* Central Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 my-auto space-y-6 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Next-Generation SaaS Hiring</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Transform your hiring pipeline with <span className="gradient-text">Autonomous AI</span>.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Create job postings, conduct automated voice/code interviews, and receive detailed AI evaluation reports—saving 80% of HR screening time.
          </p>

          <div className="space-y-3 pt-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Social Proof Metric Badge */}
          <div className="pt-6 border-t border-slate-800 flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-white">99.4%</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Evaluation Accuracy</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-2xl font-bold text-white">10x</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Faster Screening</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 HireMind AI Platform Inc.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Grade Security</span>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
