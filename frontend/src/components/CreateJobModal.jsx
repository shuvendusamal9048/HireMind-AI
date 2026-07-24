import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, DollarSign, Award, Plus, Tag, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import Input from './Input';
import { jobService } from '../services/jobService';

export const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: 'Remote',
    employment_type: 'FULL_TIME',
    experience: '3',
    salary_min: '90000',
    salary_max: '130000',
    description: '',
  });

  const [skills, setSkills] = useState(['React', 'TypeScript', 'Tailwind CSS']);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleAddSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(',', '');
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (skills.length === 0) newErrors.skills = 'Add at least one required skill';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const createdJob = await jobService.createJob({
        ...formData,
        skills,
      });
      toast.success(`Job "${createdJob.title || formData.title}" created successfully!`);
      if (onJobCreated) onJobCreated(createdJob);
      onClose();
    } catch (err) {
      console.error('Create job error:', err);
      const msg = err.response?.data?.detail || 'Failed to create job position';
      toast.error(typeof msg === 'string' ? msg : 'Error creating job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-200 dark:border-primary-800">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Job Position</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Post a new job for AI candidate screening & evaluation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer (React)"
              icon={Briefcase}
              error={errors.title}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote / San Francisco, CA"
                icon={MapPin}
                error={errors.location}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Min Experience (Years)"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                icon={Award}
              />

              <Input
                label="Min Salary ($)"
                name="salary_min"
                type="number"
                placeholder="90000"
                value={formData.salary_min}
                onChange={handleChange}
                icon={DollarSign}
              />

              <Input
                label="Max Salary ($)"
                name="salary_max"
                type="number"
                placeholder="140000"
                value={formData.salary_max}
                onChange={handleChange}
                icon={DollarSign}
              />
            </div>

            {/* Skills Tag Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Required Skills (Press Enter or Comma to add)</span>
                <span className="text-slate-400 text-[11px]">{skills.length} skills added</span>
              </label>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-2 min-h-[46px]">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={skills.length === 0 ? "Type skill and press Enter..." : "Add skill..."}
                  className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>
              {errors.skills && <p className="text-xs text-red-500">{errors.skills}</p>}
            </div>

            {/* Job Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Job Description & Qualifications <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail key responsibilities, requirements, and benefits..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-400"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} icon={Plus}>
                Publish Job Position
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateJobModal;
