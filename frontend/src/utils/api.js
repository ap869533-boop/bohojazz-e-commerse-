import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 / token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response.data?.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefresh);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper functions
export const handleApiError = (error, fallback = 'Something went wrong') => {
  const msg = error?.response?.data?.message || fallback;
  toast.error(msg);
  return msg;
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const getImageUrl = (url) => {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return `${process.env.REACT_APP_API_URL?.replace('/api', '') || ''  }${url}`;
};
