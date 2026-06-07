import apiClient from './apiClient';

export const courtsService = {
  async getAll() {
    const { data } = await apiClient.get('/courts');
    return data;
  },

  async getById(id) {
    const { data } = await apiClient.get(`/courts/${id}`);
    return data;
  },

  async create(courtData) {
    const { data } = await apiClient.post('/courts', courtData);
    return data;
  },

  async update(id, courtData) {
    const { data } = await apiClient.put(`/courts/${id}`, courtData);
    return data;
  },

  async remove(id) {
    const { data } = await apiClient.delete(`/courts/${id}`);
    return data;
  },
};
