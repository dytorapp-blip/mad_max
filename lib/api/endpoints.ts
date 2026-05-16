import api from './client';

// ============================================================================
// ADMIN DASHBOARD API - These call the Dytor_Backend /admin/* endpoints
// ============================================================================

// Dashboard API calls
export const dashboardAPI = {
  getOverview: () => api.get('/admin/dashboard'),
  getStats: () => api.get('/admin/dashboard'),
  getActivity: () => api.get('/admin/dashboard'),
};

// User management API
export const userAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get('/admin/users', { params: { page, limit } }),
  getById: (id: string) => api.get(`/admin/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  search: (query: string) =>
    api.get('/admin/users', { params: { q: query } }),
};

// Analytics API
export const analyticsAPI = {
  // Usage metrics over time
  getUsage: (days = 30) =>
    api.get('/admin/analytics/usage', { params: { days } }),

  // Error analytics
  getErrors: (hours = 24) =>
    api.get('/admin/analytics/errors', { params: { hours } }),

  // Rate limit analytics
  getRateLimits: (hours = 24) =>
    api.get('/admin/analytics/rate-limits', { params: { hours } }),
};

// System health API
export const healthAPI = {
  getStatus: () => api.get('/admin/health'),
};

// Team API calls (if needed)
export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id: string) => api.get(`/teams/${id}`),
  create: (data: any) => api.post('/teams', data),
  update: (id: string, data: any) => api.put(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
  getMembers: (id: string) => api.get(`/teams/${id}/members`),
};

// Infrastructure API calls
export const infrastructureAPI = {
  getServers: () => api.get('/infrastructure/servers'),
  getServerStatus: (serverId: string) =>
    api.get(`/infrastructure/servers/${serverId}`),
  getMetrics: () => api.get('/infrastructure/metrics'),
  getHealth: () => api.get('/admin/health'),
};

// Settings API calls
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
  getEmailConfig: () => api.get('/settings/email'),
  updateEmailConfig: (data: any) => api.put('/settings/email', data),
  testEmailConnection: () => api.post('/settings/email/test'),
};

// Authentication API calls
export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
};

export default api;
