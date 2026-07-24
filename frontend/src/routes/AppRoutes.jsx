import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import JobList from '../pages/JobList';
import CreateJob from '../pages/CreateJob';
import JobDetails from '../pages/JobDetails';
import PublicJobPage from '../pages/PublicJobPage';
import CandidatesList from '../pages/CandidatesList';
import ApplicationDetails from '../pages/ApplicationDetails';
import InterviewsList from '../pages/InterviewsList';
import ReportsList from '../pages/ReportsList';
import CompanySettings from '../pages/CompanySettings';
import CandidateLogin from '../pages/CandidateLogin';
import CandidateInstructions from '../pages/CandidateInstructions';
import CandidateInterview from '../pages/CandidateInterview';
import InterviewCompleted from '../pages/InterviewCompleted';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import NotFound from '../pages/NotFound';
import { ROUTES } from '../utils/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Super Admin Dashboard Portal */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Public Job Page Sourcing */}
      <Route path="/jobs/:jobId" element={<PublicJobPage />} />

      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>
      </Route>

      {/* Candidate Side Proctored Portal */}
      <Route element={<CandidateLayout />}>
        <Route path="/interview/login" element={<CandidateLogin />} />
        <Route path="/interview/:id/instructions" element={<CandidateInstructions />} />
        <Route path="/interview/:id" element={<CandidateInterview />} />
        <Route path="/interview/:id/completed" element={<InterviewCompleted />} />
      </Route>

      {/* Protected HR Administration Portal */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.JOBS} element={<JobList />} />
          <Route path={ROUTES.JOBS_CREATE} element={<CreateJob />} />
          <Route path="/jobs/manage/:id" element={<JobDetails />} />
          <Route path={ROUTES.CANDIDATES} element={<CandidatesList />} />
          <Route path="/applications" element={<CandidatesList />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
          <Route path={ROUTES.INTERVIEWS} element={<InterviewsList />} />
          <Route path={ROUTES.REPORTS} element={<ReportsList />} />
          <Route path="/reports/:id" element={<ReportsList />} />
          <Route path={ROUTES.SETTINGS} element={<CompanySettings />} />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
