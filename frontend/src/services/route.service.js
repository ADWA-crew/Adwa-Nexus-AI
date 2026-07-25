import api from './api';

export const routeService = {
  getAll: (params) => api.get('/routes', { params }),
  getById: (id) => api.get(/routes/\),
};
