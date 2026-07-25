import api from './api';

export const analyticsService = {
  getStats: () => api.get('/analytics/stats'),
  getVisitorStats: () => api.get('/analytics/visitors'),
};
