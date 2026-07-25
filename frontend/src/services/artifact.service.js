import api, { unwrap } from './api';

export const artifactService = {
  getAll: (params) => api.get('/artifacts', { params }).then(unwrap),
  getById: (id) => api.get(`/artifacts/${id}`).then(unwrap),
  getExhibit: (id) => api.get(`/artifacts/${id}/exhibit`).then(unwrap),
  /** Resolve a scanned QR payload (slug or URL) to an exhibit DTO */
  resolveQr: (payload) =>
    api.post('/qr/resolve', { payload }).then(unwrap),
};

export default artifactService;
