import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Briefcase, MapPin, DollarSign, Calendar, Sparkles, Code, User, ArrowLeft,
  Edit, Trash2, Globe, Users, Copy, Check, Eye, Trash, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardHeader } from '../components/Card';
import { useJobQuery, useUpdateJobMutation, useDeleteJobMutation } from '../hooks/useJobQueries';
import { useApplicationsQuery } from '../hooks/useApplicationQueries';
import { ROUTES } from '../utils/constants';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading: jobLoading } = useJobQuery(id);
  const { data: apps, isLoading: appsLoading } = useApplicationsQuery(id);
  
  const updateMutation = useUpdateJobMutation();
  const deleteMutation = useDeleteJobMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Set initial skills on edit start
  const startEdit = () => {
    if (job) {
      setSkills(Array.isArray(job.skills) ? job.skills : []);
      setIsEditing(true);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills((prev) => [...prev, val]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleCopyLink = () => {
    if (!job) return;
    const applyUrl = `${window.location.origin}/jobs/${job.application_code || job.id}`;
    navigator.clipboard.writeText(applyUrl);
    setCopiedLink(true);
    toast.success('Public job application link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure you want to delete this job position? All applicant records will be affected.')) {
      try {
        await deleteMutation.mutateAsync(id);
        navigate(ROUTES.JOBS);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onSubmit = async (data) => {
    if (skills.length === 0) {
      toast.error('At least one skill tag is required');
      return;
    }
    try {
      await updateMutation.mutateAsync({
        jobId: id,
        data: {
          title: data.title,
          description: data.description,
          experience: Number(data.experience),
          location: data.location,
          employment_type: data.employment_type,
          salary_min: data.salary_min ? Number(data.salary_min) : null,
          salary_max: data.salary_max ? Number(data.salary_max) : null,
          skills: skills,
        },
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (jobLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-10 w-32 rounded skeleton-shimmer" />
        <div className="h-64 w-full rounded-2xl skeleton-shimmer" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12 max-w-xl mx-auto space-y-4">
        <p className="text-sm font-semibold text-slate-500">Job position not found or has been removed.</p>
        <Button onClick={() => navigate(ROUTES.JOBS)} variant="secondary">Back to Listings</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.JOBS)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isEditing ? 'Modify Job Specifications' : job.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? 'Editing active specs' : `Active code: ${job.application_code || job.id}`}
            </p>
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <Button onClick={handleCopyLink} variant="secondary" size="sm" icon={copiedLink ? Check : Copy}>
              {copiedLink ? 'Copied Link' : 'Copy Apply Link'}
            </Button>
            <Button onClick={startEdit} variant="outline" size="sm" icon={Edit}>
              Edit Specs
            </Button>
            <Button onClick={handleDelete} variant="secondary" size="sm" icon={Trash2} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
              Delete
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        /* Edit Form mode */
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Position Title"
              name="title"
              defaultValue={job.title}
              icon={Briefcase}
              error={errors.title?.message}
              {...register('title', { required: 'Job title is required' })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Job Description
              </label>
              <textarea
                name="description"
                rows="6"
                defaultValue={job.description}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all leading-relaxed"
                {...register('description', { required: 'Job description is required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                name="location"
                defaultValue={job.location}
                icon={MapPin}
                error={errors.location?.message}
                {...register('location', { required: 'Location is required' })}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  defaultValue={job.employment_type}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all font-semibold"
                  {...register('employment_type')}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Experience Required (Years)"
                name="experience"
                type="number"
                defaultValue={job.experience}
                icon={User}
                error={errors.experience?.message}
                {...register('experience', { required: 'Experience requirement is required' })}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min Salary ($)"
                  name="salary_min"
                  type="number"
                  defaultValue={job.salary_min || ''}
                  icon={DollarSign}
                  {...register('salary_min')}
                />
                <Input
                  label="Max Salary ($)"
                  name="salary_max"
                  type="number"
                  defaultValue={job.salary_max || ''}
                  icon={DollarSign}
                  {...register('salary_max')}
                />
              </div>
            </div>

            {/* Skills Chips Builder */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-slate-400" />
                <span>Required Skill Tags (Press Enter to add)</span>
              </label>
              <div className="w-full flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-12 items-center">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-primary-800 font-bold text-[10px]"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Add skill..."
                  className="flex-1 text-xs outline-none bg-transparent text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* View mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Details Panel (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Job Description</h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Required Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(job.skills) ? (
                    job.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified</span>
                  )}
                </div>
              </div>
            </Card>

            {/* View Applications List Table */}
            <Card className="p-0 overflow-hidden">
              <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Applicants for this position</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">List of candidates who applied via the public link</p>
                </div>
              </div>

              {appsLoading ? (
                <div className="p-6 space-y-3">
                  <div className="h-10 w-full rounded skeleton-shimmer" />
                  <div className="h-10 w-full rounded skeleton-shimmer" />
                </div>
              ) : !Array.isArray(apps) || apps.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No applications received yet for this position.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-3.5 px-6">Name</th>
                        <th className="py-3.5 px-4">Resume Score</th>
                        <th className="py-3.5 px-4">AI Evaluation</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {apps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-slate-100">
                            {app.candidate_name}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold">
                            {app.resume_score ? `${app.resume_score}/100` : '—'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold">
                            {app.ai_score ? `${app.ai_score}/100` : '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <Link to={`/applications/${app.id}`}>
                              <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar Specs Widget */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Position Parameters</h4>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2.5 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-400">Required Experience:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.experience} years</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-400">Position Location:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.location}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.employment_type}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-400">Salary Package:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {job.salary_min && job.salary_max ? `₹${job.salary_min.toLocaleString('en-IN')} - ₹${job.salary_max.toLocaleString('en-IN')}` : 'Competitive INR'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-3 bg-gradient-to-tr from-primary-50 to-blue-50 dark:from-slate-850 dark:to-slate-800 border border-primary-100 dark:border-slate-700">
              <h4 className="text-xs font-bold text-primary-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary-500" />
                <span>Job Sourcing URL</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Candidates applying at this URL will automatically trigger automated AI HR resume parsing and screening.
              </p>
              <Button onClick={handleCopyLink} variant="primary" className="w-full text-xs font-bold justify-center" icon={copiedLink ? Check : Copy}>
                {copiedLink ? 'Link Copied!' : 'Copy Sourcing Link'}
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
