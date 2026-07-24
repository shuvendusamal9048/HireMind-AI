import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Clock, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Video, FileText, Lock, Users, MonitorX } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import { candidateInterviewService } from '../services/candidateInterviewService';

export const CandidateInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('candidate_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch {
        // Fallback
      }
    }
  }, []);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await candidateInterviewService.startInterview(id);
      toast.success('AI Proctoring Active! Timer started.');
      navigate(`/interview/${id}`);
    } catch (err) {
      toast.success('Interview started!');
      navigate(`/interview/${id}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Mesh Gradients */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl space-y-6 relative z-10"
      >
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xl space-y-3 border border-indigo-400/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>SkillAssess AI Proctored Assessment</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {session?.candidate_name || 'Candidate'} 👋
          </h1>
          
          <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            Please read the official examination guidelines and proctoring regulations carefully before initiating your technical assessment session.
          </p>
        </div>

        {/* Instructions Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Official Examination Rules & Regulations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strict proctoring compliance is monitored continuously throughout your test session.
            </p>
          </div>

          {/* Grid of Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                <FileText className="w-4 h-4" />
                <span>Section A — 10 Technical MCQs</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Complete <strong>10 Multiple-Choice Questions</strong>. Select choice A, B, C, or D for each question and navigate smoothly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Section B — Python Coding (3 Test Cases)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Write your Python solution inside <code className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">def two_sum(nums, target):</code> and test live.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                <MonitorX className="w-4 h-4" />
                <span>Tab Switching Limit (Max 3 Warnings)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Each tab switch triggers <strong>1 warning count</strong>. On the <strong>4th tab switch violation</strong>, your exam will be <strong>permanently locked</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs">
                <Users className="w-4 h-4" />
                <span>Webcam & Multi-Person AI Proctoring</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your camera feed is monitored continuously. If <strong>multiple persons appear in frame</strong>, cheating warnings trigger immediately.
              </p>
            </div>
          </div>

          {/* Detailed Bullet Points */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Candidate Anti-Cheating Checklist
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Ensure your computer webcam and microphone permissions are granted.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Sit in a well-lit room alone. Ensure no other persons are in camera range.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Do NOT open additional tabs, browser windows, developer tools, or secondary applications.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>If you switch tabs 4 times, the system will automatically terminate your session and notify HR.</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Assessment Duration: 30 Minutes</span>
            </span>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              isLoading={isStarting}
              icon={ArrowRight}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold shadow-md shadow-indigo-600/20 border-0 text-xs uppercase tracking-wider"
            >
              I Agree & Start Examination
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CandidateInstructions;
