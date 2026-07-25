import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const visitorToken = localStorage.getItem('visitorToken');
  if (visitorToken) {
    config.headers['x-visitor-token'] = visitorToken;
  }

  const staffToken = localStorage.getItem('staffToken');
  if (staffToken) {
    config.headers.Authorization = `Bearer ${staffToken}`;
  }

  return config;
});

export function unwrap(response) {
  const body = response?.data;
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) {
    return body.data;
  }
  return body;
}

export default api;
