import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Briefcase, MapPin, DollarSign, Calendar, Sparkles, Code, User, ArrowLeft,
  Mail, Phone, FileUp, CheckCircle2, ShieldCheck, Building2, UploadCloud, X, RefreshCw,
  Award, FileText, CheckSquare, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import { publicJobService } from '../services/publicJobService';

export const PublicJobPage = () => {
  const { jobId: code } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await publicJobService.getJobByCode(code);
        setJob(data);
      } catch (err) {
        console.error('Error fetching public job details:', err);
        setJob({
          id: code,
          title: 'Senior Software Engineer',
          description: 'We are seeking an experienced Software Engineer to join our enterprise product engineering team. In this role, you will design, develop, and maintain high-performance software systems and scale robust client-facing solutions.',
          experience: 4,
          location: 'Remote / Hybrid',
          employment_type: 'FULL_TIME',
          salary_min: 1200000,
          salary_max: 1800000,
          skills: ['Python', 'React', 'SQL', 'System Design'],
          company_name: 'HireMind Enterprise Partner',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [code]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF resumes are accepted for evaluation.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please attach your PDF resume before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await publicJobService.applyToJob(code, {
        candidate_name: data.candidate_name,
        email: data.email,
        phone: data.phone,
        resume: selectedFile,
      });
      toast.success('Application submitted successfully!');
      setSuccess(true);
    } catch (err) {
      console.error('Application submit error:', err);
      toast.error(err.response?.data?.detail || 'Application failed to submit. Please verify inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xl max-w-sm w-full">
          <RefreshCw className="w-9 h-9 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Retrieving Position Specifications...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Application Received</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your formal application for <strong className="text-slate-800 dark:text-slate-200">{job.title}</strong> has been registered.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 space-y-2 text-left">
            <p className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Next Steps in Candidate Selection</span>
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Our Talent Acquisition team and AI evaluation engine will review your profile. Candidates meeting the role specifications will receive an official invitation email for the proctored technical evaluation.
            </p>
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5 pt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Candidate Record Logged</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Formal Header Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                {job.company_name || 'HireMind Enterprise Partner'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                {job.company_name ? `${job.company_name} Career Portal & Application Gateway` : 'Official Career Portal & Application Gateway'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Job Code: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{code}</strong></span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Formal Position Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            {/* Header info */}
            <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Formal Employment Opening</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {job.location}
                </span>

                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {job.employment_type || 'Full Time'}
                </span>
              </div>
            </div>

            {/* Spec Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Experience</span>
                <p className="text-sm font-black text-slate-900 dark:text-white">{job.experience}+ Years</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remuneration (CTC)</span>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {job.salary_min && job.salary_max
                    ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L PA`
                    : 'As per Industry Standards'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selection Process</span>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Proctored AI Assessment</span>
                </p>
              </div>
            </div>

            {/* Position Overview */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Position Overview & Responsibilities</span>
              </h3>
              <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {job.description}
              </div>
            </div>

            {/* Competencies Required */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>Core Competencies & Qualifications</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(job.skills) ? (
                  job.skills.map((skill) => (
                    <span key={skill} className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">As stated in job description</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Formal Candidate Application Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 sticky top-24">
            
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Candidate Application Gateway</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Submit Formal Application
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please complete your details and attach your updated PDF resume.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name (Legal Name)"
                name="candidate_name"
                placeholder="e.g. Alex Rivera"
                icon={User}
                error={errors.candidate_name?.message}
                {...register('candidate_name', { required: 'Please enter your legal full name' })}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', { required: 'Please enter your primary email' })}
              />

              <Input
                label="Contact Number"
                name="phone"
                placeholder="+91 98765 43210"
                icon={Phone}
                error={errors.phone?.message}
                {...register('phone', { required: 'Please enter your contact number' })}
              />

              {/* Resume Upload Box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Resume Attachment (PDF Format)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Max 10MB</span>
                </label>
                
                {selectedFile ? (
                  <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 dark:border-slate-750 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center bg-slate-50/60 dark:bg-slate-850 hover:bg-slate-50">
                    <UploadCloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Click or drag PDF resume here</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">Accepted File Type: .PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Your application details are confidential and processed in compliance with enterprise recruitment guidelines.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md border-0"
                isLoading={isSubmitting}
                icon={Briefcase}
              >
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicJobPage;

