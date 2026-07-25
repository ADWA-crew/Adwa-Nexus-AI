import api, { unwrap } from './api';

export const analyticsService = {
  getStats: () => api.get('/analytics/stats').then(unwrap),
  getVisitorStats: () => api.get('/analytics/visitors').then(unwrap),
};
