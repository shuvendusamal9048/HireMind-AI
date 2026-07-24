import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Globe, Briefcase, Users, FileCheck2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstNumber: '',
    website: '',
    industry: '',
    companySize: '1-10',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisteredPending, setIsRegisteredPending] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.adminName.trim()) newErrors.adminName = 'Your full name is required';
    if (!formData.email.trim()) newErrors.email = 'Work email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'Company GST Number is required';
    } else if (formData.gstNumber.trim().length < 8) {
      newErrors.gstNumber = 'Please enter a valid GST identification number';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.website.trim()) newErrors.website = 'Company website is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        companyName: formData.companyName.trim(),
        adminName: formData.adminName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        gst_number: formData.gstNumber.trim(),
        website: formData.website.trim(),
        industry: formData.industry.trim(),
        companySize: formData.companySize,
      });
      setIsRegisteredPending(true);
      toast.success('Registration submitted for admin approval!');
    } catch (err) {
      console.error('Registration error:', err);
      const detail = err?.response?.data?.detail || 'Registration failed. Check your details.';
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegisteredPending) {
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center py-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-md">
            <FileCheck2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Registration Submitted!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Your company registration for <strong className="text-slate-800 dark:text-white">{formData.companyName}</strong> has been received.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Pending GST & Admin Approval</span>
            </div>
            <p className="leading-relaxed">
              GST Number: <strong className="font-mono text-slate-900 dark:text-white">{formData.gstNumber}</strong>
            </p>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              The HireMind Super Admin will verify your GST details. Once approved, an official notification email will be sent to <strong className="text-slate-800 dark:text-slate-200">{formData.email}</strong> to log in and start job posting.
            </p>
          </div>

          <Button
            variant="primary"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Go to Login Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Company Account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Register your company with GST to start hiring with HireMind AI
        </p>
      </div>

      {/* Register Card Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Innovations Inc."
              icon={Building2}
              error={errors.companyName}
              required
            />

            <Input
              label="Admin Full Name"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Alex Rivera"
              icon={User}
              error={errors.adminName}
              required
            />
          </div>

          {/* GST Number Field */}
          <Input
            label="Company GST Number (GSTIN)"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="e.g. 22AAAAA0000A1Z5"
            icon={FileCheck2}
            error={errors.gstNumber}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://acme.com"
              icon={Globe}
              error={errors.website}
              required
            />

            <Input
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. Software, Healthcare"
              icon={Briefcase}
              error={errors.industry}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Work Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@acme.com"
              icon={Mail}
              error={errors.email}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Company Size</span>
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 transition-all font-semibold"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Registration requires GST verification by Super Admin prior to account activation.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 mt-2"
            isLoading={isSubmitting}
            icon={ArrowRight}
          >
            Submit Registration for Verification
          </Button>
        </form>
      </div>

      {/* Footer Login Link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="font-bold text-primary-600 hover:text-primary-700 hover:underline">
          Sign in instead
        </Link>
      </p>
    </div>
  );
};

export default Register;

