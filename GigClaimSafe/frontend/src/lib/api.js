import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userAPI = {
  register: (data) => api.post('/register', data),
  getUser: (userId) => api.get(`/users/${userId}`),
  listUsers: () => api.get('/users'),
};

// Risk Score API calls
export const riskAPI = {
  getRiskScore: (userId) => api.get(`/risk-score/${userId}`),
};

// Policy API calls
export const policyAPI = {
  selectPlan: (data) => api.post('/select-plan', data),
  getUserPolicies: (userId) => api.get(`/policies/${userId}`),
  getActivePolicy: (userId) => api.get(`/policies/${userId}/active`),
};

// Disruption Monitoring API calls
export const disruptionAPI = {
  getMonitor: (city) => api.get(`/monitor/${city}`),
  getAllDisruptions: () => api.get('/monitor-all'),
};

// Claims API calls
export const claimsAPI = {
  triggerClaim: (data) => api.post('/trigger-claim', data),
  getUserClaims: (userId) => api.get(`/claims/${userId}`),
  getRecentClaims: (userId) => api.get(`/claims/${userId}/recent`),
  approveClaim: (claimId) => api.post(`/claims/${claimId}/approve`),
};

// Payouts API calls
export const payoutsAPI = {
  getUserPayouts: (userId) => api.get(`/payouts/${userId}`),
  getTotalPayouts: (userId) => api.get(`/payouts/total/${userId}`),
};

// Admin API calls
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getClaimsByStatus: () => api.get('/admin/claims-by-status'),
  getFraudClaims: () => api.get('/admin/fraud-flagged'),
};

export default api;
