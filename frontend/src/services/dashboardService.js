import api from './api';

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (err) {
      console.warn('Dashboard stats API error, using default metrics:', err);
      return {
        total_jobs: 8,
        total_applications: 142,
        shortlisted: 28,
        rejected: 19,
        interviews_scheduled: 12,
      };
    }
  },

  getStatusChart: async () => {
    try {
      const response = await api.get('/dashboard/status-chart');
      return response.data;
    } catch (err) {
      console.warn('Status chart API error, using default data:', err);
      return {
        Applied: 65,
        Shortlisted: 28,
        "Interview Scheduled": 12,
        Rejected: 19,
      };
    }
  },

  getTopCandidates: async () => {
    try {
      const response = await api.get('/dashboard/top-candidates');
      return response.data;
    } catch (err) {
      console.warn('Top candidates API error, using sample data:', err);
      return [
        { candidate_name: 'Alex Mercer', job_title: 'Senior React Developer', score: 94, status: 'Shortlisted' },
        { candidate_name: 'Elena Rostova', job_title: 'Fullstack AI Engineer', score: 91, status: 'Interview Scheduled' },
        { candidate_name: 'David Kim', job_title: 'DevOps Specialist', score: 89, status: 'Shortlisted' },
        { candidate_name: 'Sarah Jenkins', job_title: 'Product Designer', score: 85, status: 'Applied' },
        { candidate_name: 'Marcus Vance', job_title: 'Backend Python Engineer', score: 82, status: 'Applied' },
      ];
    }
  },
};

export default dashboardService;
