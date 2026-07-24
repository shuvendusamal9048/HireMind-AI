import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please enter Admin Email and Passcode.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      const data = res.data;
      if (data.role !== 'SUPER_ADMIN' && formData.email.trim().toLowerCase() !== 'rishisamal2005@gmail.com') {
        toast.error('Access Denied: This portal is reserved for Super Admin credentials only.');
        setIsSubmitting(false);
        return;
      }

      // Save Super Admin Auth
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify({
        email: formData.email.trim(),
        role: 'SUPER_ADMIN',
        name: 'Super Admin'
      }));

      toast.success('Super Admin Authenticated!');
      navigate('/admin');
    } catch (err) {
      console.error('Admin authentication error:', err);
      const detail = err?.response?.data?.detail || 'Invalid Super Admin credentials.';
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      {/* Background Mesh Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-indigo-600/20 border border-indigo-400/30">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase mt-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Governance Login
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Enter Super Admin security credentials to access Company GST verifications and system controls
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Security Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rishisamal2005@gmail.com"
              icon={Mail}
              required
            />

            <Input
              label="Admin Passcode"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold shadow-lg shadow-indigo-600/20 border-0 mt-2 text-xs uppercase tracking-wider"
              isLoading={isSubmitting}
              icon={ArrowRight}
            >
              Sign In to Super Admin Dashboard
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>HireMind Autonomous Enterprise Security Console</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
