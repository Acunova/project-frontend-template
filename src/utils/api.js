import axios from 'axios';
import rateLimiter from './rateLimiter';

// export const API_BASE_URL = 'https://voltvillage-api.onrender.com/api/v1';
export const API_BASE_URL = 'https://voltvillage-api.onrender.com/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add request interceptor to check rate limit
client.interceptors.request.use(
  async (config) => {
    if (!rateLimiter.isRequestAllowed()) {
      throw new Error('Request blocked due to rate limiting');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => client.post('/users/users/', data),
  login: async (credentials) => {
    console.log('Login attempt with credentials:', credentials);
    try {
      if (!rateLimiter.isRequestAllowed()) {
        throw new Error('Too many login attempts. Please wait a moment.');
      }
      const response = await client.post('/auth/login/json', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('Login API response:', response);
      
      if (!response?.data?.access_token) {
        throw new Error('Invalid response from server');
      }
      
      return response;
    } catch (error) {
      console.error('API Login error:', error);
      if (error.message.includes('rate limiting')) {
        throw new Error('Too many attempts. Please wait a moment before trying again.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  },
  forgotPassword: (data) => client.post('/auth/forgot-password', data),
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process password reset request');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// External Sellers API
export const externalSellers = {
  getAll: (params = {}) => client.get('/ext-seller/', { params }),
  getById: (id) => client.get(`/ext-seller/${id}`),
  create: (data) => client.post('/ext-seller/', data),
  update: (id, data) => client.patch(`/ext-seller/${id}`, data),
  delete: (id) => client.delete(`/ext-seller/${id}`),
  getItems: (sellerId, params = {}) => client.get(`/ext-seller/${sellerId}/items`, { params }),
  createItem: (sellerId, data) => client.post(`/ext-seller/ext-seller/item?external_seller=${sellerId}`, data),
};

// Analytics API
export const analytics = {
  getDashboard: () => client.get('/analytics/dashboard'),
};

export const items = {
  getAll: async (params) => {
    try {
      const response = await client.get('/items/', { params });
      // Return the array directly as that's what the API returns
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: (id) => client.get(`/items/${id}`),
  create: (data) => client.post('/items/', data),
  update: (id, data) => client.put(`/items/${id}`, data),
  delete: (id) => client.delete(`/items/${id}`),
  getMyItems: () => client.get('/items/my-items/'),
};

export const requests = {
  getAll: (params) => client.get('/requests/', { params }),
  getById: (id) => client.get(`/requests/${id}`),
  create: (data) => client.post('/requests/', data),
  update: (id, data) => client.put(`/requests/${id}`, data),
  delete: (id) => client.delete(`/requests/${id}`),
  getMyRequests: () => client.get('/requests/my-requests/'),
  makeOffer: (requestId, data) => client.post(`/requests/${requestId}/offers`, data),
  getOffers: (requestId) => client.get(`/requests/${requestId}/offers`),
};

export const getConversations = async (skip = 0, limit = 100) => {
  try {
    const response = await client.get(`/chat/conversations/`, {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (conversationId, skip = 0, limit = 100) => {
  try {
    const response = await client.get(`/chat/messages/${conversationId}`, {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (message) => {
  try {
    // Do NOT JSON.stringify here, just send the plain object
    const response = await client.post(`/chat/messages`, message);
    console.log('API sendMessage response:', response);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await client.get('/users/users/me');
    return response;
  } catch (error) {
    throw error;
  }
};

export const passwordReset = async (token, newPassword) => {
  try {
    const response = await client.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response;
  } catch (error) {
    return error.response || error;
  }
};

export default client;