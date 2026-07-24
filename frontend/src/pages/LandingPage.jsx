import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Video, CheckCircle2, Award, Brain } from 'lucide-react';
import Button from '../components/Button';
import { ROUTES } from '../utils/constants';

export const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const features = [
    {
      title: 'Automated AI Screening',
      desc: 'Screen hundreds of resumes instantly with state-of-the-art AI HR parsing and matching technology.',
      icon: Brain,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Distraction-Free Proctored Interviews',
      desc: 'Conduct automated video & audio technical evaluations with built-in camera monitoring and proctoring metrics.',
      icon: Video,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Deep AI Score Breakdown',
      desc: 'Recruiters receive instant scorecards evaluating technical skills, communication clarity, and confidence.',
      icon: Award,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            HireMind <span className="text-primary-600 text-xs px-1.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 font-bold">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link to={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to={ROUTES.REGISTER}>
            <Button variant="primary" size="sm" icon={ArrowRight}>Register Company</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl space-y-6 relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Next Generation AI-Powered Recruitment</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            Automate Your Company Hiring with <span className="bg-gradient-to-r from-primary-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Autonomous AI HR</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            From posting jobs and screening resumes to conducting video proctored AI interviews and grading candidates. Automate the boring parts and focus on the best talent.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Start Free Trial
              </Button>
            </Link>
            <Link to="/interview/login">
              <Button variant="outline" size="lg" icon={Video}>
                Candidate Portal
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              End-to-End Recruitment Automation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Everything you need to source, evaluate, and schedule interviews with top talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shadow-sm space-y-4"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0B0F17] px-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with JWT & AES Encryption</span>
        </div>
        <span>&copy; {new Date().getFullYear()} HireMind AI. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
