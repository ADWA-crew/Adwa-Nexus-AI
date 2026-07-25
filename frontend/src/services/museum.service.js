import api from './api';

export const museumService = {
  getAll: (params) => api.get('/museums', { params }),
  getById: (id) => api.get(`/museums/${id}`),
};
