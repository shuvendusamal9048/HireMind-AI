import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, DollarSign, Award, Copy, Check, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';

export const JobDetailsModal = ({ job, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const publicApplyUrl = `${window.location.origin}/apply/${job.application_code || job.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicApplyUrl);
    setCopied(true);
    toast.success('Public job application link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                  {job.employment_type || 'FULL_TIME'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {job.status || 'ACTIVE'}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{job.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  {job.experience}+ Years Experience
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

          {/* Public Candidate Application Code Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-800/60 dark:to-slate-800/30 border border-primary-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span>Candidate Direct Apply Link</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Application Code: <code className="font-mono font-bold text-primary-600 dark:text-primary-400">{job.application_code || job.id}</code>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              icon={copied ? Check : Copy}
              className="bg-white dark:bg-slate-900 text-xs shrink-0"
            >
              {copied ? 'Link Copied' : 'Copy Apply URL'}
            </Button>
          </div>

          {/* Salary & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400">Salary Range</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {job.salary_min && job.salary_max
                  ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L PA`
                  : 'Competitive INR'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400">Experience Required</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {job.experience} Years
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400">Employment Type</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                {job.employment_type || 'FULL_TIME'}
              </p>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Required Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.skills) && job.skills.length > 0 ? (
                job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No explicit skills listed</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Job Description
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {job.description || 'No description provided.'}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JobDetailsModal;
