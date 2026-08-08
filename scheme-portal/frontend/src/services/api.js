import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Schemes
export const getEligibleSchemes = (params) => API.get('/schemes', { params });
export const getAllSchemes = () => API.get('/schemes/all');
export const createScheme = (data) => API.post('/schemes', data);
export const updateScheme = (id, data) => API.put(`/schemes/${id}`, data);
export const deleteScheme = (id) => API.delete(`/schemes/${id}`);

// Applications
export const applyScheme = (formData) => API.post('/applications', formData);
export const getMyApplications = () => API.get('/applications/my');
export const getAllApplications = () => API.get('/applications');
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);

// Admin
export const getDashboardStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const deleteAccount = () => API.delete("/auth/delete");