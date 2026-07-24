import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, User, Key, ShieldCheck, Copy, Check, ExternalLink, Search, Sparkles, RefreshCw, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import Button from '../components/Button';
import { candidateInterviewService } from '../services/candidateInterviewService';
import { applicationService } from '../services/applicationService';

export const InterviewsList = () => {
  const [copiedId, setCopiedId] = useState(null);

  const { data: rawInterviews, isLoading, refetch } = useQuery({
    queryKey: ['scheduled-interviews'],
    queryFn: async () => {
      try {
        const data = await candidateInterviewService.getScheduledInterviews();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Backend interviews list query note:', err);
      }

      // Fallback to searching applications with status INTERVIEW_SCHEDULED
      try {
        const apps = await applicationService.getApplications();
        const scheduledApps = apps.filter(
          (a) => a.status === 'INTERVIEW_SCHEDULED' || a.status === 'Interview Scheduled'
        );
        return scheduledApps.map((a) => ({
          id: a.id,
          candidate_name: a.candidate_name,
          job_title: a.job_title || 'Software Position',
          email: a.email,
          interview_code: 'INT-' + String(a.id).slice(0, 6).toUpperCase(),
          password: 'Access Granted',
          scheduled_at: a.interview_date || new Date().toISOString(),
          interviewer: a.interviewer_name || 'AI Host',
          status: 'SCHEDULED',
        }));
      } catch (e) {
        return [];
      }
    },
  });

  const interviews = rawInterviews || [];

  const handleCopyLink = (code, password) => {
    const link = `${window.location.origin}/interview/login`;
    navigator.clipboard.writeText(`Interview Login URL: ${link}\nCode: ${code}\nPassword: ${password}`);
    setCopiedId(code);
    toast.success('Interview credentials copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Scheduled AI Interviews</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">
              {interviews.length} Scheduled
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage scheduled AI technical interview sessions and candidate access codes
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()} isLoading={isLoading}>
          Refresh List
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-48 rounded-3xl skeleton-shimmer" />
          <div className="h-48 rounded-3xl skeleton-shimmer" />
        </div>
      ) : interviews.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Video className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Scheduled Interviews</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            When candidates are scheduled for an AI interview from Applications or Job details, their access details will appear here.
          </p>
        </Card>
      ) : (
        /* Grid of Scheduled Interviews */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interviews.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
              <Card hover className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center border border-amber-200 dark:border-amber-800 shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.candidate_name}</h3>
                      <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">{item.job_title}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span>{item.email}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {item.status}
                  </span>
                </div>

                {/* Credentials detail card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Interview Code:</span>
                    <code className="font-mono font-extrabold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {item.interview_code}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Candidate Password:</span>
                    <code className="font-mono font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {item.password}
                    </code>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-slate-400 font-medium">Date & Time:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString() : 'As Scheduled'}
                    </span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">Host: {item.interviewer}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(item.interview_code, item.password)}
                    icon={copiedId === item.interview_code ? Check : Copy}
                    className="text-xs"
                  >
                    {copiedId === item.interview_code ? 'Copied' : 'Copy Credentials'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewsList;
