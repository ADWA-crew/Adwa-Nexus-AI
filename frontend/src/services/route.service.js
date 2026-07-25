import api, { unwrap } from './api';

export const routeService = {
  getAll: (params) => api.get('/routes', { params }).then(unwrap),
  getById: (id) => api.get(`/routes/${id}`).then(unwrap),
};
