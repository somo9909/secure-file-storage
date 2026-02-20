import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { storage } from '../utils/storage';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.username, formData.password);
      
      // Store token and user data
      storage.setToken(response.token);
      storage.setUser(response.user);
      
      // Check if user has private key in browser
      const existingPrivateKey = storage.getPrivateKey();
      const serverPublicKey = response.user.publicKey;
      
      if (serverPublicKey) {
        storage.setPublicKey(serverPublicKey);
        
        // Check if keys match
        if (existingPrivateKey) {
          const browserPublicKey = storage.getPublicKey();
          // Note: We can't directly compare keys, but we can warn if server has different public key
          // The actual verification happens during download
        } else {
          // No private key in browser - user needs to import or generate
          setError('⚠️ No private key found in browser. You can import keys from backup or generate new keys. Note: Files encrypted with old keys may not be accessible.');
        }
      }

      onLoginSuccess(response.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
