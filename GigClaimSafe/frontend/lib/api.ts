const defaultBase = typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://localhost:8000';
const BASE = process.env.NEXT_PUBLIC_API_URL || defaultBase;

// JWT token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined' && !authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

// Initialize token from localStorage on client side
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('authToken');
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${BASE}${path}`, {
      headers,
      ...options,
    });
  } catch (error) {
    throw new Error('Network error: could not reach the API server. Is the backend running on http://localhost:8000?');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Handle 401 unauthorized
    if (response.status === 401) {
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    throw new Error(data.detail || 'API request failed');
  }

  return data;
}

export interface User {
  id: number;
  email: string;
  name: string;
  platform: string;
  city: string;
  weekly_earnings: number;
  work_hours: number;
  upi_id: string;
  risk_score: number;
  risk_label: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  plan_type?: string;
  premium?: number;
  coverage_amount?: number;
  policy_status?: string;
  used_amount?: number;
}

export interface AdminUser extends User {
  total_claims: number;
  total_payouts: number;
  active_policy?: string;
}

export const api = {
  // Authentication
  register: (payload: {
    email: string;
    password: string;
    name: string;
    platform: string;
    city: string;
    weekly_earnings: number;
    work_hours: number;
    upi_id: string;
    role?: string;
  }) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  getMe: () => request('/auth/me'),

  checkAdminExists: () => request('/auth/admin-exists'),
  createFirstAdmin: (payload: { email: string; password: string; name: string }) =>
    request('/auth/create-first-admin', { method: 'POST', body: JSON.stringify(payload) }),

  // Worker endpoints
  getWorker: (id: number) => request(`/worker/${id}`),
  getRiskScore: (id: number) => request(`/risk-score/${id}`),
  getPlans: () => request('/plans'),
  selectPlan: (payload: any) => request('/select-plan', { method: 'POST', body: JSON.stringify(payload) }),

  // Monitor
  getMonitor: () => request('/monitor'),

  // Admin endpoints
  adminTrigger: (payload: any) => request('/admin/trigger', { method: 'POST', body: JSON.stringify(payload) }),
  adminStats: () => request('/admin/stats'),
  adminFraudLog: () => request('/admin/fraud-log'),
  adminForecast: () => request('/admin/forecast'),
  adminGetWorkers: () => request('/admin/workers'),

  // Claims and payouts
  getDisruptions: () => request('/disruptions/active'),
  triggerClaim: (payload: any) => request('/trigger-claim', { method: 'POST', body: JSON.stringify(payload) }),
  getClaims: (uid: number) => request(`/claims/${uid}`),
  initiatePayout: (payload: any) => request('/payout/initiate', { method: 'POST', body: JSON.stringify(payload) }),
  getPayouts: (uid: number) => request(`/payouts/${uid}`),

  // Notifications
  getNotifications: (uid: number) => request(`/notifications/${uid}`),
  markRead: (id: number) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
};
