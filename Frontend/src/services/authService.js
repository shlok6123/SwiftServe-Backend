import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    // Expected response format: { success: true, message: "...", data: "eyJhbGci..." }
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
