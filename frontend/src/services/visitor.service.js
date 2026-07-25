import api from './api';
import { mockCreateSession } from './mock/visitorSession.mock';

/* Flip to false once POST /api/v1/visitors/sessions is live on the backend. */
const USE_MOCK = true;

export const visitorService = {
  /**
   * POST /api/v1/visitors/sessions
   * Sends the personalization profile and receives the experience configuration.
   */
  createSession: (payload) =>
    USE_MOCK
      ? mockCreateSession(payload)
      : api.post('/v1/visitors/sessions', payload).then((res) => res.data),

  getProfile: (id) => api.get(`/visitors/${id}`).then((res) => res.data),

  updateProfile: (id, data) => api.put(`/visitors/${id}`, data).then((res) => res.data),
};

export default visitorService;
