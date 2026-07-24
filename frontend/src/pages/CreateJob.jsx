import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, MapPin, DollarSign, Calendar, Sparkles, Code, User, ArrowLeft, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useCreateJobMutation } from '../hooks/useJobQueries';
import { ROUTES } from '../utils/constants';

export const CreateJob = () => {
  const navigate = useNavigate();
  const createMutation = useCreateJobMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

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

  const onSubmit = async (data) => {
    if (skills.length === 0) {
      toast.error('Please add at least one required skill tag');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: data.title,
        description: data.description,
        experience: Number(data.experience),
        location: data.location,
        employment_type: data.employment_type,
        salary_min: data.salary_min ? Number(data.salary_min) : null,
        salary_max: data.salary_max ? Number(data.salary_max) : null,
        skills: skills,
      });
      navigate(ROUTES.JOBS);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Navigation Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.JOBS)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Create New Job Position</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Post a new position and generate public application links</p>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Position Title"
            name="title"
            placeholder="e.g. Lead Software Engineer"
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
              placeholder="Provide a detailed overview of the role, responsibilities, and requirements..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all leading-relaxed"
              {...register('description', { required: 'Job description is required' })}
            />
            {errors.description && (
              <span className="text-[11px] font-bold text-red-500">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              name="location"
              placeholder="e.g. Remote, San Francisco, CA"
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
              placeholder="e.g. 5"
              icon={User}
              error={errors.experience?.message}
              {...register('experience', { required: 'Experience requirement is required', min: { value: 0, message: 'Cannot be negative' } })}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Min Salary (₹ INR)"
                name="salary_min"
                type="number"
                placeholder="e.g. 1200000"
                icon={DollarSign}
                {...register('salary_min')}
              />
              <Input
                label="Max Salary (₹ INR)"
                name="salary_max"
                type="number"
                placeholder="e.g. 1800000"
                icon={DollarSign}
                {...register('salary_max')}
              />
            </div>
          </div>

          {/* Skills Chips Builder */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-slate-400" />
              <span>Required Skill Tags (Press Enter or comma to add)</span>
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
                placeholder="e.g. React, Python"
                className="flex-1 text-xs outline-none bg-transparent text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(ROUTES.JOBS)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              icon={Send}
            >
              Publish Job & Generate Link
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateJob;
