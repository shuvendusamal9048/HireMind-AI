import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Globe, Briefcase, Users, Mail, User, ShieldCheck, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card, { CardHeader } from '../components/Card';
import { useAuth } from '../hooks/useAuth';

export const CompanySettings = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = (data) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Company profile parameters saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Company Portal Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your company organization profile and administrator details</p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Specifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="company_name"
              defaultValue={user?.company_name || 'HireMind Client Inc.'}
              icon={Building2}
              error={errors.company_name?.message}
              {...register('company_name', { required: 'Company name is required' })}
            />

            <Input
              label="Corporate Website"
              name="website"
              defaultValue="https://acme.com"
              icon={Globe}
              error={errors.website?.message}
              {...register('website', { required: 'Website URL is required' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Industry Segment"
              name="industry"
              defaultValue="Information Technology"
              icon={Briefcase}
              error={errors.industry?.message}
              {...register('industry', { required: 'Industry segment is required' })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                Company Size
              </label>
              <select
                name="company_size"
                defaultValue="11-50"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all font-semibold"
                {...register('company_size')}
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-100 dark:border-slate-850">
            Portal Administrator Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Administrator Full Name"
              name="admin_name"
              defaultValue={user?.admin_name || 'Sarah Jenkins'}
              icon={User}
              error={errors.admin_name?.message}
              {...register('admin_name', { required: 'Administrator name is required' })}
            />

            <Input
              label="Work Email Address"
              name="email"
              type="email"
              defaultValue={user?.email || 'admin@acme.com'}
              icon={Mail}
              error={errors.email?.message}
              {...register('email', { required: 'Work email is required' })}
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Multi-Tenant Access Policy</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Every job listing, application resume text, and AI evaluation report is isolated under company code <code className="font-mono bg-white dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-bold">{user?.company_id?.slice(0, 8) || 'client-code'}</code>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              icon={Save}
            >
              Save Parameters
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanySettings;
