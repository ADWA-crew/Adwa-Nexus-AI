import api, { unwrap } from './api';
import { ARTIFACTS_DATA } from '../data/artifactsData';

export const artifactService = {
  getAll: async (params) => {
    try {
      const data = await api.get('/artifacts', { params }).then(unwrap);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      /* fallback to local artifacts data */
    }
    return ARTIFACTS_DATA;
  },

  getById: async (id) => {
    try {
      const data = await api.get(`/artifacts/${id}`).then(unwrap);
      if (data && data.id) {
        return data;
      }
    } catch {
      /* fallback */
    }
    return ARTIFACTS_DATA.find((item) => String(item.id) === String(id)) || ARTIFACTS_DATA[0];
  },
};
