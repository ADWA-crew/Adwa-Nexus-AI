import api from './api';

export const artifactService = {
  getAll: (params) => api.get('/artifacts', { params }),
  getById: (id) => api.get(/artifacts/\),
};
