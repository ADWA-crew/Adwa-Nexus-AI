import api, { unwrap } from './api';

export const museumService = {
  getAll: (params) => api.get('/museums', { params }).then(unwrap),
  getById: (id) => api.get(`/museums/${id}`).then(unwrap),
};
