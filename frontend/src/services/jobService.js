import api from './api';

export const jobService = {
  getJobs: async () => {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (err) {
      console.warn('Jobs API error or empty, returning default initial jobs:', err);
      return [];
    }
  },

  createJob: async (jobData) => {
    // jobData: { title, description, experience, location, employment_type, salary_min, salary_max, skills }
    const response = await api.post('/jobs', {
      title: jobData.title,
      description: jobData.description,
      experience: Number(jobData.experience || 0),
      location: jobData.location,
      employment_type: jobData.employment_type || 'FULL_TIME',
      salary_min: jobData.salary_min ? Number(jobData.salary_min) : null,
      salary_max: jobData.salary_max ? Number(jobData.salary_max) : null,
      skills: Array.isArray(jobData.skills) ? jobData.skills : jobData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
    return response.data;
  },

  getJobByCode: async (code) => {
    const response = await api.get(`/public/jobs/${code}`);
    return response.data;
  },

  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, {
      title: jobData.title,
      description: jobData.description,
      experience: Number(jobData.experience || 0),
      location: jobData.location,
      employment_type: jobData.employment_type || 'FULL_TIME',
      salary_min: jobData.salary_min ? Number(jobData.salary_min) : null,
      salary_max: jobData.salary_max ? Number(jobData.salary_max) : null,
      skills: Array.isArray(jobData.skills) ? jobData.skills : jobData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },
};

export default jobService;

