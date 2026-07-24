import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Building2, CheckCircle2, XCircle, Clock, Search, RefreshCw, Mail, FileCheck2, LogOut, ArrowRight, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../services/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Read admin auth
  const adminToken = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!adminToken) {
      toast.error('Super Admin authentication required.');
      navigate('/admin/login');
      return;
    }
    fetchCompanies();
  }, [adminToken, navigate]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data || []);
    } catch (err) {
      console.error('Error fetching admin companies:', err);
      toast.error('Failed to load company verification requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId, companyName) => {
    setActionLoadingId(companyId);
    try {
      await api.post(`/admin/companies/${companyId}/approve`);
      toast.success(`Company ${companyName} approved! Verification email sent.`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve company.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (companyId, companyName) => {
    setActionLoadingId(companyId);
    try {
      await api.post(`/admin/companies/${companyId}/reject`);
      toast.error(`Company ${companyName} registration rejected.`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject company.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out of Super Admin Portal.');
    navigate('/admin/login');
  };

  // Metrics
  const pendingCompanies = companies.filter((c) => c.approval_status === 'PENDING' || !c.is_active);
  const approvedCompanies = companies.filter((c) => c.approval_status === 'APPROVED' && c.is_active);
  const rejectedCompanies = companies.filter((c) => c.approval_status === 'REJECTED');

  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.gst_number?.toLowerCase().includes(q) ||
      c.company_code?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Super Admin Top Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                HireMind Super Admin Portal
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-200 dark:border-emerald-800">
                SUPER ADMIN ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Logged in as: <strong className="text-indigo-600 dark:text-indigo-400">rishisamal2005@gmail.com</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCompanies}
            icon={RefreshCw}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            icon={LogOut}
            className="border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Registered</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{companies.length}</p>
          <p className="text-[10px] text-slate-400">Total company accounts in database</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Pending GST Verification</span>
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{pendingCompanies.length}</p>
          <p className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">Requires Super Admin approval</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Approved & Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{approvedCompanies.length}</p>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Job posting enabled</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span>Rejected Accounts</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{rejectedCompanies.length}</p>
          <p className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold">Access restricted</p>
        </div>

      </div>

      {/* Main Companies Verification Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Company Registration Requests & GST Verification</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review company GST numbers and approve or reject employer accounts.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search GST, company or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            <Clock className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
            <span>Loading company registrations...</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No company registrations found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Company Name</th>
                  <th className="p-3.5">Company Code</th>
                  <th className="p-3.5">Admin Email</th>
                  <th className="p-3.5">GST Number</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCompanies.map((c) => {
                  const isPending = c.approval_status === 'PENDING' || !c.is_active;
                  const isApproved = c.approval_status === 'APPROVED' && c.is_active;
                  const isLoadingThis = actionLoadingId === c.id;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span>{c.name}</span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300 font-bold">
                        {c.company_code}
                      </td>

                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {c.email}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {c.gst_number || 'N/A'}
                      </td>

                      <td className="p-3.5">
                        {isPending ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-extrabold flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                            <span>PENDING APPROVAL</span>
                          </span>
                        ) : isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>APPROVED</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] font-extrabold flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {isPending ? (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              isLoading={isLoadingThis}
                              onClick={() => handleApprove(c.id, c.name)}
                              icon={CheckCircle2}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-1.5 border-0"
                            >
                              Approve GST
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={isLoadingThis}
                              onClick={() => handleReject(c.id, c.name)}
                              icon={XCircle}
                              className="border-rose-300 text-rose-600 dark:text-rose-400 hover:bg-rose-50 font-bold text-[11px] py-1.5"
                            >
                              Reject
                            </Button>
                          </>
                        ) : isApproved ? (
                          <span className="text-[11px] text-slate-400 font-mono italic">Account Active & Email Sent</span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={isLoadingThis}
                            onClick={() => handleApprove(c.id, c.name)}
                            className="border-slate-300 text-slate-600 text-[11px] py-1"
                          >
                            Re-Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
