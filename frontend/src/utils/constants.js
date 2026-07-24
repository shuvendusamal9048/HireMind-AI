export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const APP_NAME = 'HireMind AI';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  JOBS_CREATE: '/jobs/create',
  CANDIDATES: '/candidates',
  INTERVIEWS: '/interviews',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
};

export const CANDIDATE_STATUSES = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  INTERVIEW_COMPLETED: 'Interview Completed',
};
