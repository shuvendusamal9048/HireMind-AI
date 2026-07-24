import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, PieChart as PieChartIcon, Activity, Sparkles, TrendingUp, Users, Award, RefreshCw, BarChart, FileText } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import { analyticsService } from '../services/analyticsService';

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [funnelData, setFunnelData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [resultsData, setResultsData] = useState([]);

  const loadAnalytics = async () => {
    try {
      const [funnel, status, results] = await Promise.all([
        analyticsService.getFunnelData(),
        analyticsService.getStatusData(),
        analyticsService.getResultsData(),
      ]);
      setFunnelData(funnel);
      setStatusData(status);
      setResultsData(results);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const kpis = [
    { label: 'Average Screen Time', value: '4.2 hrs', change: '-12% reduction', icon: Activity, color: 'from-blue-600 to-indigo-600 text-white' },
    { label: 'Average Candidate Score', value: '82.4%', change: '+4.1% increase', icon: Award, color: 'from-emerald-600 to-teal-600 text-white' },
    { label: 'Interview Pass Rate', value: '64.8%', change: '+2.4% pass', icon: Users, color: 'from-purple-600 to-indigo-600 text-white' },
    { label: 'Total Scored Candidates', value: '240', change: 'Live processing', icon: Sparkles, color: 'from-amber-500 to-orange-600 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recruitment Analytics Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
              Insight Engine
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time hiring funnel velocity, status distribution, and technical skill average benchmarks
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleRefresh} isLoading={refreshing}>
          Refresh Analytics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          if (loading) {
            return (
              <Card key={idx} className="space-y-3">
                <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-24 rounded skeleton-shimmer" />
                <div className="h-8 w-16 rounded skeleton-shimmer" />
              </Card>
            );
          }
          return (
            <motion.div key={idx} whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
              <Card hover className="relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${kpi.color} shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.label}</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{kpi.value}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel Velocity (2 cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader
            title="Recruitment Funnel Velocity"
            subtitle="Applicant conversion progression statistics"
            action={<BarChart2 className="w-4 h-4 text-primary-500" />}
          />
          {loading ? (
            <div className="h-72 w-full rounded-2xl skeleton-shimmer" />
          ) : (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`funnel-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Candidate Distribution (1 col) */}
        <Card className="space-y-4">
          <CardHeader
            title="Candidate Status Share"
            subtitle="Share distribution across pipelines"
            action={<PieChartIcon className="w-4 h-4 text-emerald-500" />}
          />
          {loading ? (
            <div className="h-72 w-full rounded-2xl skeleton-shimmer" />
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="75%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`status-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-2 w-full pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Skills Evaluation Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Skill averages (2 cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader
            title="AI Interview Skill Breakdown"
            subtitle="Candidate average score vs company target benchmarks"
            action={<Sparkles className="w-4 h-4 text-purple-500" />}
          />
          {loading ? (
            <div className="h-72 w-full rounded-2xl skeleton-shimmer" />
          ) : (
            <div className="h-72 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={resultsData}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 9 }} />
                  <Radar
                    name="Average Score"
                    dataKey="average"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Benchmark Target"
                    dataKey="benchmark"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.1}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* System Insights card (1 col) */}
        <Card className="space-y-4">
          <CardHeader
            title="Recruiter Insights"
            subtitle="AI HR Efficiency Critique"
            action={<FileText className="w-4 h-4 text-amber-500" />}
          />
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
            <p>
              💡 **Screening Speed**: HR screening velocity improved by <strong>18%</strong> following automated credential emailing optimization.
            </p>
            <p>
              💡 **Skill Gap**: Candidates show high competency in **React & Frontend** (average 88/100) but demonstrate lower scores in **DevOps & Storage** configurations.
            </p>
            <p>
              💡 **Hiring Focus**: Focus candidate generation on **AI & Machine Learning** roles where interview schedules are currently peaking.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
