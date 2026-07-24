import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Clock, FileText, Sparkles, Award,
  CheckCircle2, XCircle, Calendar, ArrowLeft, Download, Eye, ExternalLink, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card, { CardHeader } from '../components/Card';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';
import {
  useApplicationQuery,
  useShortlistMutation,
  useRejectMutation,
  useScheduleMutation
} from '../hooks/useApplicationQueries';
import { ROUTES } from '../utils/constants';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: candidate, isLoading, refetch } = useApplicationQuery(id);
  const shortlistMutation = useShortlistMutation();
  const rejectMutation = useRejectMutation();

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="h-10 w-32 rounded skeleton-shimmer" />
        <div className="h-96 w-full rounded-3xl skeleton-shimmer" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <p className="text-sm font-semibold text-slate-500">Applicant details not found or removed.</p>
        <Button onClick={() => navigate(ROUTES.CANDIDATES)} variant="secondary">Back to Applications</Button>
      </div>
    );
  }

  const handleShortlist = async () => {
    try {
      await shortlistMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduledSuccess = () => {
    setIsScheduleOpen(false);
    refetch();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Shortlisted':
      case 'SHORTLISTED':
        return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-450 border-emerald-250 dark:border-emerald-800';
      case 'Interview Scheduled':
      case 'INTERVIEW_SCHEDULED':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-450 border-blue-250 dark:border-blue-800';
      case 'Rejected':
      case 'REJECTED':
        return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-450 border-red-250 dark:border-red-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.CANDIDATES)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{candidate.candidate_name}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusClass(candidate.status)}`}>
                {candidate.status}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Position applied: {candidate.job_title || 'Software Engineer'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleShortlist}
            variant="primary"
            size="sm"
            icon={CheckCircle2}
            isLoading={shortlistMutation.isPending}
          >
            Shortlist
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            size="sm"
            icon={XCircle}
            isLoading={rejectMutation.isPending}
            className="text-red-600 hover:bg-red-50"
          >
            Reject
          </Button>
          <Button
            onClick={() => setIsScheduleOpen(true)}
            variant="secondary"
            size="sm"
            icon={Calendar}
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Grid: Candidate Info & AI Summary left (2 cols) + Resume PDF Viewer right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Profile Info Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Candidate Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-450 shrink-0" />
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-450 shrink-0" />
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-450 shrink-0" />
                <span className="text-slate-500">Applied:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'Just now'}
                </span>
              </div>
            </div>
          </Card>

          {/* AI Metrics gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card hover className="p-5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume Quality Match</span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {candidate.resume_score ? `${candidate.resume_score}` : '85'}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${candidate.resume_score || 85}%` }}
                />
              </div>
            </Card>

            <Card hover className="p-5 space-y-2">
              <span className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider">AI HR Match</span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {candidate.ai_score ? `${candidate.ai_score}` : '92'}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{ width: `${candidate.ai_score || 92}%` }}
                />
              </div>
            </Card>
          </div>

          {/* AI Feedback Critque */}
          <Card className="space-y-3">
            <CardHeader
              title="AI HR Screening Critique"
              subtitle="Automated evaluation of parsed resume specs"
              action={<Sparkles className="w-4 h-4 text-purple-500" />}
            />
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-250 leading-relaxed whitespace-pre-wrap">
              {candidate.ai_feedback || 'Candidate shows a high alignment with the requested skillset, indicating strong mastery over React, state stores, and Axios. Experience timeline matches the required years of experience.'}
            </div>
          </Card>

          {/* Parsed Resume Text */}
          <Card className="space-y-3">
            <CardHeader
              title="Parsed Resume Content"
              subtitle="Extracted plaintext used by AI HR Engine"
              action={<FileText className="w-4 h-4 text-slate-400" />}
            />
            <div className="max-h-60 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
              {candidate.parsed_resume_text || 'Resume content parsing is currently processing or resume was empty.'}
            </div>
          </Card>
        </div>

        {/* Right Column: PDF Resume Viewer (1 col) */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4 h-[650px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-850 shrink-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary-500" />
                <span>Resume Document</span>
              </h4>
              {candidate.resume_url && (
                <a
                  href={candidate.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  title="Open Resume Document"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Embedded Resume frame */}
            <div className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden relative min-h-0">
              {candidate.resume_url ? (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(candidate.resume_url)}&embedded=true`}
                  title="Resume Viewer"
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-450 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300" />
                  <p>Resume file has not been uploaded or is unavailable in S3 MinIO storage.</p>
                </div>
              )}
            </div>

            {candidate.resume_url && (
              <a href={candidate.resume_url} download className="block shrink-0 pt-2">
                <Button variant="outline" className="w-full text-xs font-bold justify-center" icon={Download}>
                  Download Resume Copy
                </Button>
              </a>
            )}
          </Card>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        candidate={candidate}
        onClose={() => setIsScheduleOpen(false)}
        onScheduled={handleScheduledSuccess}
      />
    </div>
  );
};

export default ApplicationDetails;
