import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Briefcase, Award, Sparkles, FileText, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import Button from './Button';

export const CandidateDetailsModal = ({ candidate, isOpen, onClose, onShortlist, onReject, onSchedule }) => {
  if (!isOpen || !candidate) return null;

  const getScoreColor = (score) => {
    const s = Number(score || 0);
    if (s >= 85) return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (s >= 70) return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    return 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-blue-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
                {candidate.candidate_name ? candidate.candidate_name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.candidate_name}</h3>
                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {candidate.job_title || 'Software Engineer'}
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Status: {candidate.status || 'Applied'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{candidate.phone || '+1 (555) 234-5678'}</span>
            </div>
          </div>

          {/* Evaluation Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Resume Match Score</span>
              </p>
              <div className="flex items-baseline justify-between pt-1">
                <span className={`text-2xl font-extrabold px-2.5 py-0.5 rounded-xl border ${getScoreColor(candidate.resume_score || 85)}`}>
                  {candidate.resume_score ? `${candidate.resume_score}/100` : '85/100'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                <span>AI HR Score</span>
              </p>
              <div className="flex items-baseline justify-between pt-1">
                <span className={`text-2xl font-extrabold px-2.5 py-0.5 rounded-xl border ${getScoreColor(candidate.ai_score || 92)}`}>
                  {candidate.ai_score ? `${candidate.ai_score}/100` : '92/100'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Screening Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              AI HR Screening Summary
            </h4>
            <div className="p-4 rounded-2xl bg-primary-50/50 dark:bg-slate-800/50 border border-primary-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                ✓ High relevance for position <strong className="text-slate-900 dark:text-white">{candidate.job_title}</strong>. Candidate demonstrates strong skill match in React, state architecture, and API integration.
              </p>
              <p>
                ✓ Recommended action: <strong>Schedule Technical AI Interview</strong>.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
            <Button variant="ghost" onClick={onClose} size="sm">
              Close
            </Button>
            <div className="flex items-center gap-2">
              {onReject && (
                <Button variant="danger" size="sm" icon={XCircle} onClick={() => { onReject(candidate.id); onClose(); }}>
                  Reject
                </Button>
              )}
              {onShortlist && (
                <Button variant="secondary" size="sm" icon={CheckCircle2} onClick={() => { onShortlist(candidate.id); onClose(); }}>
                  Shortlist
                </Button>
              )}
              {onSchedule && (
                <Button variant="primary" size="sm" icon={Calendar} onClick={() => { onSchedule(candidate); onClose(); }}>
                  Schedule Interview
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CandidateDetailsModal;
