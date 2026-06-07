import apiClient from './apiClient';

export const authService = {
  async login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data; // { user, token }
  },

  async register(name, email, password) {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    return data; // { user, token }
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
