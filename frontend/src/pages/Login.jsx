import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingNotice, setPendingNotice] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (pendingNotice) setPendingNotice('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Work email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setPendingNotice('');
    try {
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res?.role === 'SUPER_ADMIN') {
        toast.success('Super Admin authenticated successfully!');
        navigate('/admin');
        return;
      }

      toast.success('Successfully authenticated!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Login error:', err);
      const detailMessage = err.response?.data?.detail;
      if (typeof detailMessage === 'string' && detailMessage.includes('PENDING')) {
        setPendingNotice(detailMessage);
        toast.error('Company registration is PENDING approval.');
      } else {
        const errorMessage = typeof detailMessage === 'string'
          ? detailMessage
          : 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your company credentials to access HireMind AI
        </p>
      </div>

      {/* Login Card Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
        
        {/* Pending Approval Notice */}
        {pendingNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold leading-relaxed space-y-1">
            <div className="font-extrabold uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span>⏳ Company Approval Pending</span>
            </div>
            <p>{pendingNotice}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Work Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@company.com"
            icon={Mail}
            error={errors.email}
            required
          />

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
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="font-semibold text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={isSubmitting}
            icon={ArrowRight}
          >
            Sign In to Dashboard
          </Button>
        </form>
      </div>

      {/* Footer Register Link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have a company account?{' '}
        <Link to={ROUTES.REGISTER} className="font-bold text-primary-600 hover:text-primary-700 hover:underline">
          Register your company
        </Link>
      </p>
    </div>
  );
};

export default Login;
