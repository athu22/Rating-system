import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Request with token:', config.method?.toUpperCase(), config.url);
    } else {
      console.log('[API] Request without token:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response success:', response.config.method?.toUpperCase(), response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 