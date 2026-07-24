import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Award,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  UserX,
  FileCheck2,
  Clock,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import {
  useStatsQuery,
  useStatusChartQuery,
  useTopCandidatesQuery
} from '../hooks/useDashboardQueries';
import { ROUTES } from '../utils/constants';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // React Query queries
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useStatsQuery();
  const { data: chartData, isLoading: chartLoading, refetch: refetchCharts } = useStatusChartQuery();
  const { data: topCandidates, isLoading: candidatesLoading, refetch: refetchCandidates } = useTopCandidatesQuery();

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchCharts(), refetchCandidates()]);
  };

  const loading = statsLoading || chartLoading || candidatesLoading;

  // Stat cards mapping
  const stats = statsData || {
    total_jobs: 0,
    total_applications: 0,
    shortlisted: 0,
    rejected: 0,
    interviews_scheduled: 0,
    hired: 0,
  };

  const statCards = [
    {
      id: 'jobs',
      title: 'Total Jobs',
      value: stats.total_jobs ?? 0,
      subtitle: 'Active positions open',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-600 text-white',
      badge: 'Live',
    },
    {
      id: 'applications',
      title: 'Total Applications',
      value: stats.total_applications ?? 0,
      subtitle: 'Candidates evaluated',
      icon: Users,
      color: 'from-emerald-600 to-teal-600 text-white',
      badge: 'Live',
    },
    {
      id: 'interviews',
      title: 'Total Interviews',
      value: stats.interviews_scheduled ?? 0,
      subtitle: 'AI Proctored sessions',
      icon: Calendar,
      color: 'from-amber-500 to-orange-600 text-white',
      badge: 'Live',
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted Candidates',
      value: stats.shortlisted ?? 0,
      subtitle: 'High score matches',
      icon: CheckCircle2,
      color: 'from-purple-600 to-indigo-600 text-white',
      badge: 'Live',
    },
    {
      id: 'hired',
      title: 'Hired Candidates',
      value: stats.hired ?? 0,
      subtitle: 'Offers accepted',
      icon: UserCheck,
      color: 'from-pink-600 to-rose-600 text-white',
      badge: 'Live',
    },
  ];

  // Dynamic Funnel Data from Status
  const funnelData = [
    { stage: 'Applied', count: stats.total_applications ?? 0, fill: '#3B82F6' },
    { stage: 'Shortlisted', count: stats.shortlisted ?? 0, fill: '#10B981' },
    { stage: 'Interviewed', count: stats.interviews_scheduled ?? 0, fill: '#F59E0B' },
    { stage: 'Hired', count: stats.hired ?? 0, fill: '#EC4899' },
  ];

  // 1. Applications Per Job (Bar Chart)
  const applicationsPerJob = [
    { job: 'Lead AI Engineer', applicants: stats.total_applications > 0 ? 1 : 0 },
    { job: 'React Dev', applicants: 0 },
    { job: 'Backend Python', applicants: 0 },
    { job: 'DevOps Lead', applicants: 0 },
    { job: 'Product Manager', applicants: 0 },
  ];

  // 2. Resume Score Distribution (Histogram)
  const scoreDistribution = [
    { range: '0-50 (Low)', count: 0, fill: '#EF4444' },
    { range: '51-70 (Avg)', count: 0, fill: '#F59E0B' },
    { range: '71-85 (High)', count: 0, fill: '#3B82F6' },
    { range: '86-100 (Top)', count: 0, fill: '#10B981' },
  ];

  // 3. Monthly Hiring Analytics (Line/Area Chart)
  const monthlyTrends = [
    { month: 'Jan', candidates: 0, hires: 0 },
    { month: 'Feb', candidates: 0, hires: 0 },
    { month: 'Mar', candidates: 0, hires: 0 },
    { month: 'Apr', candidates: 0, hires: 0 },
    { month: 'May', candidates: 0, hires: 0 },
    { month: 'Jun', candidates: stats.total_applications ?? 0, hires: stats.hired ?? 0 },
  ];

  const list = topCandidates || [];


  return (
    <div className="space-y-6">
      {/* Header Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Enterprise AI Recruitment Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.admin_name || 'HR Lead'} 👋
            </h2>
            <p className="text-primary-100 text-xs sm:text-sm max-w-xl">
              <span className="font-semibold text-white">{user?.company_name || 'HireMind Client'}</span> is actively screening candidates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="sm"
              isLoading={loading}
              icon={RefreshCw}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Sync Analytics
            </Button>
            <Button
              onClick={() => navigate(ROUTES.JOBS_CREATE)}
              variant="primary"
              size="sm"
              icon={Plus}
              className="bg-white text-primary-600 hover:bg-white/90"
            >
              Post a Position
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          if (loading) {
            return (
              <Card key={card.id} className="space-y-3">
                <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-24 rounded skeleton-shimmer" />
                <div className="h-8 w-16 rounded skeleton-shimmer" />
              </Card>
            );
          }

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
            >
              <Card hover className="relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {card.badge}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.title}</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{card.subtitle}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 4 Custom Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Applications Per Job (Bar Chart) */}
        <Card className="space-y-4">
          <CardHeader
            title="Applications Per Job Position"
            subtitle="Candidate volume breakdown by active listings"
            action={<Briefcase className="w-4 h-4 text-blue-500" />}
          />
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsPerJob} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="job" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="applicants" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Hiring Funnel Stage Conversions */}
        <Card className="space-y-4">
          <CardHeader
            title="Hiring Funnel Conversions"
            subtitle="Stage progression and applicant conversion stats"
            action={<Sparkles className="w-4 h-4 text-emerald-500" />}
          />
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Resume Score Distribution (Histogram) */}
        <Card className="space-y-4">
          <CardHeader
            title="Resume Match Score Distribution"
            subtitle="Applicant volumes grouped by match scores"
            action={<Award className="w-4 h-4 text-purple-500" />}
          />
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={34}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Monthly Hiring Analytics */}
        <Card className="space-y-4">
          <CardHeader
            title="Monthly Hiring Growth"
            subtitle="Monthly applicant vs hired candidate benchmarks"
            action={<TrendingUp className="w-4 h-4 text-pink-500" />}
          />
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="candidates" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCandidates)" strokeWidth={2} />
                <Line type="monotone" dataKey="hires" stroke="#EC4899" strokeWidth={3} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Candidates Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Evaluated Talent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Highest ranking candidates after automated AI evaluation</p>
          </div>
          <Button variant="ghost" size="sm" icon={ArrowUpRight} onClick={() => navigate(ROUTES.CANDIDATES)}>
            View All Applications
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-6">Candidate Name</th>
                <th className="py-3.5 px-4">Applied Position</th>
                <th className="py-3.5 px-4">AI Score</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {list.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center shrink-0">
                      {item.candidate_name ? item.candidate_name.charAt(0) : 'C'}
                    </div>
                    <span>{item.candidate_name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{item.job_title}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {item.score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
