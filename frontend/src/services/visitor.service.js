import api, { unwrap } from './api';

/* Live backend — POST /api/v1/visitors/sessions */
const USE_MOCK = false;

export const visitorService = {
  /**
   * POST /api/v1/visitors/sessions
   * Returns { sessionId, token, createdAt, visitor, experience }
   */
  createSession: async (payload) => {
    if (USE_MOCK) {
      const { mockCreateSession } = await import('./mock/visitorSession.mock');
      return mockCreateSession(payload);
    }

    const body = await api.post('/v1/visitors/sessions', payload).then((res) => res.data);
    if (body?.token) {
      localStorage.setItem('visitorToken', body.token);
    }
    return body;
  },

  getProfile: (id) => api.get(`/visitors/${id}`).then((res) => res.data),

  updateProfile: (id, data) => api.put(`/visitors/${id}`, data).then((res) => res.data),

  getExperience: () => api.get('/v1/visitors/sessions/me/experience').then(unwrap),

  endSession: () => api.post('/v1/visitors/sessions/me/end').then(unwrap),
};

export default visitorService;
