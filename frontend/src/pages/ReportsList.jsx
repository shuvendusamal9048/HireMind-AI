import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Sparkles, User, Clock, CheckCircle2, Award, RefreshCw, AlertCircle } from 'lucide-react';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import ReportCard from '../components/ReportCard';
import { reportService } from '../services/reportService';
import { candidateInterviewService } from '../services/candidateInterviewService';

export const ReportsList = () => {
  const { id } = useParams();
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(id || '');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);

  // 1. Fetch completed interviews
  const fetchInterviewsList = async () => {
    setLoadingList(true);
    try {
      const allInterviews = await candidateInterviewService.getScheduledInterviews();
      // Filter for completed interviews only
      const completed = (allInterviews || []).filter(
        (i) => i.status === 'COMPLETED' || i.is_completed === true
      );
      setCompletedInterviews(completed);
      if (completed.length > 0) {
        setSelectedInterviewId((prev) => prev || completed[0].id);
      }
    } catch (err) {
      console.warn('Error fetching interviews list for reports:', err);
      setCompletedInterviews([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchInterviewsList();
  }, []);

  // 2. Fetch specific report details when an interview is selected
  useEffect(() => {
    if (!selectedInterviewId) {
      setReportData(null);
      setQuestionsData([]);
      return;
    }

    const loadReportDetails = async () => {
      setLoadingReport(true);
      try {
        const [report, questions] = await Promise.all([
          reportService.getReport(selectedInterviewId),
          reportService.getReportQuestions(selectedInterviewId),
        ]);
        setReportData(report);
        setQuestionsData(questions || []);
      } catch (err) {
        console.error('Error loading report details:', err);
        setReportData(null);
        setQuestionsData([]);
      } finally {
        setLoadingReport(false);
      }
    };

    loadReportDetails();
  }, [selectedInterviewId]);

  return (
    <div className="space-y-6">
      {/* Top Header & Candidate Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>AI Evaluation Reports</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
              AI HR Team
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Detailed candidate scorecards, technical answers, and AI feedback critiques
          </p>
        </div>

        <div className="flex items-center gap-3">
          {completedInterviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <User className="w-4 h-4 text-slate-400" />
                <span>Select Candidate:</span>
              </div>
              <select
                value={selectedInterviewId}
                onChange={(e) => setSelectedInterviewId(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-primary-600 shadow-sm"
              >
                {completedInterviews.map((cand) => (
                  <option key={cand.id} value={cand.id}>
                    {cand.candidate_name} — {cand.job_title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchInterviewsList} isLoading={loadingList}>
            Refresh
          </Button>
        </div>
      </div>

      {loadingList ? (
        <div className="space-y-4">
          <div className="h-40 w-full rounded-3xl skeleton-shimmer" />
          <div className="h-64 w-full rounded-3xl skeleton-shimmer" />
        </div>
      ) : completedInterviews.length === 0 ? (
        /* Empty State: No Completed Interviews */
        <Card className="p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-md">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Completed AI Interview Reports Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Candidate interviews are currently in <strong className="text-slate-700 dark:text-slate-300">Scheduled</strong> status. Detailed AI evaluation scorecards, technical answer transcripts, and AI HR feedback will automatically populate here as soon as candidates complete their AI interview session.
            </p>
          </div>
        </Card>
      ) : loadingReport ? (
        <div className="space-y-4">
          <div className="h-40 w-full rounded-3xl skeleton-shimmer" />
          <div className="h-64 w-full rounded-3xl skeleton-shimmer" />
        </div>
      ) : (
        <>
          {/* Executive Score Cards */}
          <ReportCard report={reportData} />

          {/* AI Executive Summary Card */}
          <Card className="space-y-3">
            <CardHeader
              title="AI Executive Evaluation Overview"
              subtitle="Generated automatically by AI HR Engine"
              action={<Sparkles className="w-4 h-4 text-primary-500" />}
            />
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {reportData?.report || 'Evaluation overview pending.'}
            </div>
          </Card>

          {/* Question by Question Answer & AI Feedback Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" />
              <span>Detailed Question & Answer Evaluation</span>
            </h3>

            {questionsData.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-400">
                No submitted responses recorded for this interview session yet.
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Separate MCQs vs Coding Challenge */}
                {(() => {
                  const mcqItems = questionsData.filter((q) => !q.question.includes('Section B') && !q.question.includes('two_sum'));
                  const codingItems = questionsData.filter((q) => q.question.includes('Section B') || q.question.includes('two_sum'));

                  // Sort MCQs by question number (Q1..Q10)
                  mcqItems.sort((a, b) => {
                    const matchA = a.question.match(/Q(\d+)\/10/);
                    const matchB = b.question.match(/Q(\d+)\/10/);
                    const numA = matchA ? parseInt(matchA[1], 10) : 99;
                    const numB = matchB ? parseInt(matchB[1], 10) : 99;
                    return numA - numB;
                  });

                  const sortedQuestions = [...mcqItems, ...codingItems];

                  return sortedQuestions.map((item, idx) => {
                    let cleanQuestion = item.question;
                    if (typeof cleanQuestion === 'string' && cleanQuestion.trim().startsWith('{')) {
                      try {
                        cleanQuestion = JSON.parse(cleanQuestion).question || cleanQuestion;
                      } catch (e) {}
                    }

                    const isCoding = cleanQuestion.includes('Section B') || cleanQuestion.includes('two_sum');
                    const itemScore = item.score !== undefined && item.score !== null ? Math.round(item.score) : 0;
                    const isPassed = itemScore >= 70;

                    return (
                      <Card key={item.id || idx} className="p-6 space-y-4 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        {/* Top Question Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-850 gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${
                                isCoding
                                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                                  : 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800'
                              }`}>
                                {isCoding ? 'Section B — Hands-On Coding Challenge' : `Section A — Question ${idx + 1} of 10`}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed pt-1">
                              {cleanQuestion}
                            </h4>
                          </div>

                          <div className="shrink-0">
                            <span className={`px-4 py-1.5 rounded-2xl text-xs font-extrabold border shadow-xs flex items-center gap-1.5 ${
                              isPassed
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                            }`}>
                              <span>Score: {itemScore}/100</span>
                            </span>
                          </div>
                        </div>

                        {/* Candidate Response Window */}
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                            <span>{isCoding ? 'Submitted Python Solution Code:' : 'Candidate Selected Choice:'}</span>
                            {isCoding && <span className="text-[10px] text-emerald-500 font-mono font-bold">python 3</span>}
                          </p>

                          <div className={`p-4 rounded-2xl text-xs leading-relaxed font-mono whitespace-pre-wrap border ${
                            isCoding
                              ? 'bg-slate-950 text-emerald-400 border-slate-800 shadow-inner'
                              : isPassed
                              ? 'bg-emerald-50/50 dark:bg-slate-850/60 border-emerald-200/60 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold'
                              : 'bg-red-50/50 dark:bg-slate-850/60 border-red-200/60 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                          }`}>
                            {item.answer || 'No response provided.'}
                          </div>
                        </div>

                        {/* AI HR Evaluation Critique */}
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            <span>AI HR Evaluation Feedback & Test Critique:</span>
                          </p>
                          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-950 dark:text-purple-200 leading-relaxed whitespace-pre-wrap">
                            {item.feedback || 'No feedback recorded yet.'}
                          </div>
                        </div>
                      </Card>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsList;
