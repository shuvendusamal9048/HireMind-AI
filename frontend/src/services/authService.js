import api from './api';

export const authService = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data; // { access_token, token_type }
  },

  register: async (companyData) => {
    // companyData: { companyName, adminName, email, password, gstNumber, website, industry, companySize }
    const response = await api.post('/auth/register', {
      company_name: companyData.companyName || companyData.company_name,
      admin_name: companyData.adminName || companyData.admin_name,
      email: companyData.email,
      password: companyData.password,
      gst_number: companyData.gst_number || companyData.gstNumber || '',
      website: companyData.website || '',
      industry: companyData.industry || '',
      company_size: companyData.companySize || companyData.company_size || '',
    });
    return response.data; // { message }
  },


  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data; // { id, name, email, role, company_id }
  },
};

export default authService;
