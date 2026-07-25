import api, { unwrap } from './api';

export const galleryService = {
  getAll: (params) => api.get('/galleries', { params }).then(unwrap),
  getById: (id) => api.get(`/galleries/${id}`).then(unwrap),
};

export default galleryService;
