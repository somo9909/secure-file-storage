/**
 * LocalStorage utilities for managing keys and user data
 */

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  PRIVATE_KEY: 'private_key',
  PUBLIC_KEY: 'public_key',
};

export const storage = {
  // Token management
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  removeToken: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // User data management
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Private key management
  setPrivateKey: (privateKey) => {
    localStorage.setItem(STORAGE_KEYS.PRIVATE_KEY, privateKey);
  },

  getPrivateKey: () => {
    return localStorage.getItem(STORAGE_KEYS.PRIVATE_KEY);
  },

  removePrivateKey: () => {
    localStorage.removeItem(STORAGE_KEYS.PRIVATE_KEY);
  },

  // Public key management
  setPublicKey: (publicKey) => {
    localStorage.setItem(STORAGE_KEYS.PUBLIC_KEY, publicKey);
  },

  getPublicKey: () => {
    return localStorage.getItem(STORAGE_KEYS.PUBLIC_KEY);
  },

  removePublicKey: () => {
    localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
  },

  // Clear all data
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PRIVATE_KEY);
    localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!storage.getToken();
  },
};
