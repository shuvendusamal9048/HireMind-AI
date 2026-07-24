import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, Lock, ArrowRight, Sparkles, ShieldCheck, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import { candidateInterviewService } from '../services/candidateInterviewService';

export const CandidateLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    interview_code: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedError, setCompletedError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (completedError) setCompletedError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.interview_code.trim() || !formData.password.trim()) {
      toast.error('Please enter both Interview Access Code and Password.');
      return;
    }

    setIsSubmitting(true);
    setCompletedError('');
    try {
      const res = await candidateInterviewService.login(
        formData.interview_code.trim(),
        formData.password.trim()
      );
      
      toast.success(`Welcome, ${res.candidate_name || 'Candidate'}!`);
      const interviewId = res.interview_id;
      sessionStorage.setItem('candidate_session', JSON.stringify(res));
      navigate(`/interview/${interviewId}/instructions`);
    } catch (err) {
      console.error('Candidate authentication error:', err);
      const detail = err?.response?.data?.detail || '';
      if (detail.toLowerCase().includes('already completed')) {
        setCompletedError('Interview Session Already Completed. You have already submitted your examination for this position.');
        toast.error('Interview already completed.');
      } else {
        const errorMsg = detail || 'Invalid interview access code or candidate password. Please check your invitation email.';
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Soft Glow Bulbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* SkillAssess Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-[10px] font-extrabold tracking-wider uppercase mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>SkillAssess AI Candidate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
            Candidate Portal Login
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Enter your credentials sent in your invitation email to initiate your proctored assessment session
          </p>
        </div>

        {/* Pure White Glassmorphic Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          
          {/* Already Completed Error Box */}
          {completedError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold leading-relaxed text-center space-y-1 shadow-sm"
            >
              <div className="font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5">
                <span>⚠️ Session Locked</span>
              </div>
              <p>{completedError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Interview Access Code"
              name="interview_code"
              value={formData.interview_code}
              onChange={handleChange}
              placeholder="e.g. HM-993083"
              icon={Key}
              required
            />

            <Input
              label="Candidate Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold shadow-md shadow-indigo-600/20 border-0 mt-2 text-xs uppercase tracking-wider"
              isLoading={isSubmitting}
              icon={ArrowRight}
            >
              Authenticate & Begin Assessment
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Session & AI Anti-Cheating Proctoring</span>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidateLogin;
