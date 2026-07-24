import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Search, Filter, CheckCircle2, XCircle, Calendar, Sparkles,
  Eye, RefreshCw, Award, FileText, Clock, Mail, Phone, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';
import {
  useApplicationsQuery,
  useShortlistMutation,
  useRejectMutation,
  useGenerateInterviewMutation
} from '../hooks/useApplicationQueries';

export const CandidatesList = () => {
  const navigate = useNavigate();

  // React Query hooks
  const { data: appsList, isLoading: loading, refetch } = useApplicationsQuery();
  const shortlistMutation = useShortlistMutation();
  const rejectMutation = useRejectMutation();
  const generateInterviewMutation = useGenerateInterviewMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCandidateForSchedule, setSelectedCandidateForSchedule] = useState(null);

  const candidates = appsList || [];

  // Filtered List
  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.job_title && item.job_title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, selectedStatus]);

  const getScoreBadge = (score) => {
    const s = Number(score || 0);
    if (s >= 85) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-250 dark:border-emerald-800';
    if (s >= 70) return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-250 dark:border-blue-800';
    return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-800';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
      case 'SHORTLISTED':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-250 dark:border-emerald-800';
      case 'Interview Scheduled':
      case 'INTERVIEW_SCHEDULED':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-250 dark:border-blue-800';
      case 'Rejected':
      case 'REJECTED':
        return 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-450 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Candidate Applications</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
              {filteredCandidates.length} Candidates
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review resume scores, AI evaluation, shortlist/reject applicants, and schedule AI interviews
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()} isLoading={loading}>
          Sync Applications
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, position..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-primary-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2 outline-none focus:border-primary-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Candidates Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 w-full rounded-xl skeleton-shimmer" />
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No candidates found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Candidate Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Resume Score</th>
                  <th className="py-4 px-4">AI Score</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Candidate Name & Job Title */}
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-500 text-white font-bold flex items-center justify-center shrink-0">
                          {c.candidate_name ? c.candidate_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{c.candidate_name}</p>
                          <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                            {c.job_title || 'Software Position'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <Mail className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                        <span>{c.email}</span>
                      </span>
                    </td>

                    {/* Resume Score */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-xs border ${getScoreBadge(c.resume_score || 85)}`}>
                        {c.resume_score ? `${c.resume_score}/100` : '—'}
                      </span>
                    </td>

                    {/* AI Score */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-xs border flex items-center gap-1 w-fit ${getScoreBadge(c.ai_score || 92)}`}>
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>{c.ai_score ? `${c.ai_score}/100` : '—'}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(c.status)}`}>
                        {c.status || 'APPLIED'}
                      </span>
                    </td>

                    {/* Actions Toolbar */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Details */}
                        <button
                          onClick={() => navigate(`/applications/${c.id}`)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Shortlist Action */}
                        <button
                          onClick={() => shortlistMutation.mutate(c.id)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Shortlist Candidate"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* Reject Action */}
                        <button
                          onClick={() => rejectMutation.mutate(c.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Reject Candidate"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>

                        {/* Schedule Interview */}
                        <button
                          onClick={() => setSelectedCandidateForSchedule(c)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Schedule AI Interview"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>

                        {/* Generate Interview */}
                        <button
                          onClick={() => generateInterviewMutation.mutate(c.id)}
                          disabled={generateInterviewMutation.isPending}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-400 hover:text-purple-600 transition-colors disabled:opacity-40"
                          title="Generate AI HR Questions"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={Boolean(selectedCandidateForSchedule)}
        candidate={selectedCandidateForSchedule}
        onClose={() => setSelectedCandidateForSchedule(null)}
        onScheduled={() => {
          setSelectedCandidateForSchedule(null);
          refetch();
        }}
      />
    </div>
  );
};

export default CandidatesList;
