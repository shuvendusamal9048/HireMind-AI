import React from 'react';
import { Award, Code2, MessageSquare, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import Card from './Card';

export const ReportCard = ({ report }) => {
  if (!report) return null;

  const getRecBadge = (rec) => {
    switch (rec) {
      case 'STRONG_HIRE':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'HIRE':
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'NO_HIRE':
      case 'REJECT':
        return 'bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const metrics = [
    {
      label: 'Overall AI Score',
      score: report.overall_score !== undefined && report.overall_score !== null ? Math.round(report.overall_score) : 0,
      icon: Award,
      color: 'from-blue-600 to-indigo-600 text-white',
      badge: (report.overall_score || 0) >= 85 ? 'Top 5%' : 'Evaluated',
    },
    {
      label: 'Technical Score',
      score: report.technical_score !== undefined && report.technical_score !== null ? Math.round(report.technical_score) : 0,
      icon: Code2,
      color: 'from-emerald-600 to-teal-600 text-white',
      badge: (report.technical_score || 0) >= 85 ? 'Expert' : 'Evaluated',
    },
    {
      label: 'Communication Score',
      score: report.communication_score !== undefined && report.communication_score !== null ? Math.round(report.communication_score) : 0,
      icon: MessageSquare,
      color: 'from-purple-600 to-indigo-600 text-white',
      badge: (report.communication_score || 0) >= 85 ? 'Fluent' : 'Evaluated',
    },
    {
      label: 'Confidence Score',
      score: report.confidence_score !== undefined && report.confidence_score !== null ? Math.round(report.confidence_score) : 0,
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-600 text-white',
      badge: (report.confidence_score || 0) >= 80 ? 'High' : 'Evaluated',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Recommendation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-200 dark:border-primary-800 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI HR Recommendation</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <span>Candidate Match Evaluation</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`px-4 py-2 rounded-2xl text-xs font-extrabold border tracking-wide shadow-sm ${getRecBadge(report.recommendation || 'STRONG_HIRE')}`}>
            Recommendation: {report.recommendation || 'STRONG_HIRE'}
          </span>
        </div>
      </div>

      {/* Metric Score Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} hover className="relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${m.color} shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {m.badge}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{m.score}</span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReportCard;
