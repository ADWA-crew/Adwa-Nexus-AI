import api, { unwrap } from './api';

export const artifactService = {
  getAll: (params) => api.get('/artifacts', { params }).then(unwrap),
  getById: (id) => api.get(`/artifacts/${id}`).then(unwrap),
};
