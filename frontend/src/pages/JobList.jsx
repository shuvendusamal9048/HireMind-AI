import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, Plus, Search, Filter, MapPin, DollarSign, Award, ChevronLeft, ChevronRight, Eye, RefreshCw
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useJobsQuery } from '../hooks/useJobQueries';
import { ROUTES } from '../utils/constants';


export const JobList = () => {
  const navigate = useNavigate();
  const { data: jobsList, isLoading: loading, refetch } = useJobsQuery();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedExp, setSelectedExp] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const jobs = jobsList || [];

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesType = selectedType === 'ALL' || job.employment_type === selectedType;

      const matchesExp =
        selectedExp === 'ALL' ||
        (selectedExp === '0-2' && job.experience <= 2) ||
        (selectedExp === '3-5' && job.experience >= 3 && job.experience <= 5) ||
        (selectedExp === '5+' && job.experience > 5);

      return matchesSearch && matchesType && matchesExp;
    });
  }, [jobs, searchQuery, selectedType, selectedExp]);

  // Paginated Jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Job Openings</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
              {filteredJobs.length} Positions
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your company job postings and AI interview screening codes
          </p>
        </div>

        <Button
          onClick={() => navigate(ROUTES.JOBS_CREATE)}
          variant="primary"
          icon={Plus}
          className="shrink-0 shadow-md shadow-primary-600/20"
        >
          Create New Job
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, skills, or location..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-primary-600 transition-all"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Filter:</span>
            </div>

            {/* Employment Type */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2 outline-none focus:border-primary-600"
            >
              <option value="ALL">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>

            {/* Experience Level */}
            <select
              value={selectedExp}
              onChange={(e) => {
                setSelectedExp(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2 outline-none focus:border-primary-600"
            >
              <option value="ALL">All Experience</option>
              <option value="0-2">0 - 2 Years</option>
              <option value="3-5">3 - 5 Years</option>
              <option value="5+">5+ Years</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="Refresh jobs list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </Card>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="space-y-4">
              <div className="h-6 w-3/4 rounded skeleton-shimmer" />
              <div className="h-4 w-1/2 rounded skeleton-shimmer" />
              <div className="h-16 w-full rounded skeleton-shimmer" />
              <div className="h-8 w-full rounded skeleton-shimmer" />
            </Card>
          ))}
        </div>
      ) : paginatedJobs.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No jobs matched your filter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or reset filters to see all open positions.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedExp('ALL');
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedJobs.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
            >
              <Card hover className="h-full flex flex-col justify-between space-y-4 relative group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 uppercase">
                      {job.employment_type || 'FULL_TIME'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Code: {job.application_code || job.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {job.experience}+ Yrs
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {Array.isArray(job.skills) &&
                      job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    {Array.isArray(job.skills) && job.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-semibold align-middle pt-0.5">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {job.salary_min && job.salary_max
                      ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L PA`
                      : 'Competitive INR'}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/jobs/manage/${job.id}`)}
                    icon={Eye}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            Showing Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;

