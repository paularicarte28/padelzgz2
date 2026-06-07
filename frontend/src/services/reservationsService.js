import apiClient from './apiClient';

export const reservationsService = {
  async getMy() {
    const { data } = await apiClient.get('/reservations/my');
    return data;
  },

  async getAll() {
    const { data } = await apiClient.get('/reservations/all');
    return data;
  },

  async getStats() {
    const { data } = await apiClient.get('/reservations/stats');
    return data;
  },

  async getSlots(courtId, date) {
    const { data } = await apiClient.get('/reservations/slots', {
      params: { courtId, date },
    });
    return data; // { slots: [], taken: [] }
  },

  async create(courtId, date, timeSlot, players = 2) {
    const { data } = await apiClient.post('/reservations', {
      court_id: courtId,
      date,
      time_slot: timeSlot,
      players,
    });
    return data;
  },

  async cancel(id) {
    const { data } = await apiClient.patch(`/reservations/${id}/cancel`);
    return data;
  },
};
