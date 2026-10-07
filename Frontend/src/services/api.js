import axios from 'axios';

// Allow overriding the API base via Vite env, fall back to local backend.
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional hook the app can register to surface errors globally (e.g. toasts).
let onApiError = null;
export const registerApiErrorHandler = (handler) => {
  onApiError = handler;
};

// Optional hook to react to auth failures (e.g. force logout + redirect).
let onUnauthorized = null;
export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

// Optional hook to broadcast connectivity changes (online/offline banner).
let onConnectionChange = null;
export const registerConnectionHandler = (handler) => {
  onConnectionChange = handler;
};
const notifyConnection = (isOnline) => {
  if (typeof onConnectionChange === 'function') onConnectionChange(isOnline);
};

// How many times to retry idempotent (GET) requests on network/timeout/5xx.
const MAX_RETRIES = 2;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Lightweight connectivity probe against a public backend endpoint.
export const checkBackendHealth = async () => {
  try {
    await api.get('/restaurants/search', {
      params: { size: 1 },
      timeout: 6000,
      _skipRetry: true,
      _silent: true,
    });
    notifyConnection(true);
    return true;
  } catch {
    notifyConnection(false);
    return false;
  }
};

// Request interceptor: inject the JWT token on every call.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalize errors and handle auth/network failures.
api.interceptors.response.use(
  (response) => {
    // Any successful response means the backend is reachable.
    if (!response.config?._silent) notifyConnection(true);
    return response;
  },
  async (error) => {
    const config = error.config || {};
    const isNetworkOrTimeout =
      error.code === 'ECONNABORTED' || !error.response;
    const isRetryableStatus = error.response && error.response.status >= 500;
    const isGet = (config.method || 'get').toLowerCase() === 'get';

    // Retry idempotent GET requests on transient failures with backoff.
    if (
      isGet &&
      !config._skipRetry &&
      (isNetworkOrTimeout || isRetryableStatus)
    ) {
      config._retryCount = config._retryCount || 0;
      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        await sleep(400 * config._retryCount); // 400ms, 800ms backoff
        return api(config);
      }
    }

    let message = 'Something went wrong. Please try again.';

    if (error.code === 'ECONNABORTED') {
      message = 'The request timed out. Check your connection and retry.';
      if (!config._silent) notifyConnection(false);
    } else if (!error.response) {
      // No response = network error / server unreachable.
      message =
        'Cannot reach the server. Make sure the backend is running on the API URL.';
      if (!config._silent) notifyConnection(false);
    } else {
      notifyConnection(true);
      const { status, data } = error.response;
      message = data?.message || message;

      if (status === 401) {
        // Token expired or invalid.
        const hadToken = !!localStorage.getItem('token');
        localStorage.removeItem('token');
        if (hadToken && typeof onUnauthorized === 'function') {
          onUnauthorized();
          message = 'Your session expired. Please log in again.';
        }
      } else if (status === 403) {
        message = data?.message || 'You do not have permission to do that.';
      } else if (status >= 500) {
        message = data?.message || 'Server error. Please try again shortly.';
      }
    }

    // Attach a friendly message so callers can reuse it directly.
    error.friendlyMessage = message;

    if (typeof onApiError === 'function' && !config._silent) {
      onApiError(message, error);
    }

    return Promise.reject(error);
  }
);

export default api;
