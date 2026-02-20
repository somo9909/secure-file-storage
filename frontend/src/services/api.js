import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://secure-file-storage-backend.onrender.com/api' : 'http://localhost:3000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (username, email, password, publicKey) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      publicKey,
    });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePublicKey: async (publicKey) => {
    const response = await api.put('/auth/public-key', {
      publicKey,
    });
    return response.data;
  },
};

// File API
export const fileAPI = {
  upload: async (file, encryptedAesKey, fileHash, originalFilename) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('encryptedAesKey', encryptedAesKey);
    formData.append('fileHash', fileHash);
    formData.append('originalFilename', originalFilename);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  list: async () => {
    const response = await api.get('/files/list');
    return response.data;
  },

  download: async (fileId) => {
    const response = await api.get(`/files/download/${fileId}`);
    return response.data;
  },

  delete: async (fileId) => {
    const response = await api.delete(`/files/delete/${fileId}`);
    return response.data;
  },
};

export default api;
