<<<<<<< HEAD
import api, { unwrap } from './api';
=======
﻿import api, { unwrap } from './api';
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

export const artifactService = {
  getAll: (params) => api.get('/artifacts', { params }).then(unwrap),
  getById: (id) => api.get(`/artifacts/${id}`).then(unwrap),
<<<<<<< HEAD
  getExhibit: (id) => api.get(`/artifacts/${id}/exhibit`).then(unwrap),
  /** Resolve a scanned QR payload (slug or URL) to an exhibit DTO */
  resolveQr: (payload) =>
    api.post('/qr/resolve', { payload }).then(unwrap),
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
};

export default artifactService;
