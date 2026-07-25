import api from './api';

export const visitorService = {
  getProfile: (id) => api.get(/visitors/\),
  updateProfile: (id, data) => api.put(/visitors/\, data),
};
