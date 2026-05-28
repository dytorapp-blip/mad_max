import api from './client';

// ============================================================================
// ADMIN API — all calls hit Dytor_Backend /admin/* endpoints
// ============================================================================

export const dashboardAPI = {
  getOverview: () => api.get('/admin/dashboard'),
};

export const userAPI = {
  getAll: (page = 1, limit = 50) =>
    api.get('/admin/users', { params: { page, limit } }),
  search: (query: string) =>
    api.get('/admin/users', { params: { q: query } }),
};

export const analyticsAPI = {
  getUsage: (days = 30) =>
    api.get('/admin/analytics/usage', { params: { days } }),
  getErrors: (hours = 24) =>
    api.get('/admin/analytics/errors', { params: { hours } }),
  getRateLimits: (hours = 24) =>
    api.get('/admin/analytics/rate-limits', { params: { hours } }),
};

export const healthAPI = {
  getStatus: () => api.get('/admin/health'),
};

export const infrastructureAPI = {
  getLive: () => api.get('/admin/infrastructure'),
  getHealth: () => api.get('/admin/health'),
};

export const billingAPI = {
  getOverview: () => api.get('/admin/billing/overview'),
  getSubscriptions: (params?: { page?: number; limit?: number; tier?: string; status?: string }) =>
    api.get('/admin/billing/subscriptions', { params }),
  getActivity: (limit = 50) =>
    api.get('/admin/billing/activity', { params: { limit } }),
};

export default api;
