import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { generateRSAKeyPair, exportPublicKey, exportPrivateKey } from '../services/crypto';
import { storage } from '../utils/storage';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingKeys, setGeneratingKeys] = useState(false);

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setLoading(true);
    setGeneratingKeys(true);

    try {
      // Generate RSA key pair
      const keyPair = await generateRSAKeyPair();
      const publicKeyPEM = await exportPublicKey(keyPair.publicKey);
      const privateKeyPEM = await exportPrivateKey(keyPair.privateKey);

      // Register user with public key
      const response = await authAPI.register(
        formData.username,
        formData.email,
        formData.password,
        publicKeyPEM
      );

      // Store token, user data, and keys
      storage.setToken(response.token);
      storage.setUser(response.user);
      storage.setPublicKey(publicKeyPEM);
      storage.setPrivateKey(privateKeyPEM);

      onRegisterSuccess(response.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
      setGeneratingKeys(false);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      {generatingKeys && (
        <div className="alert alert-info">
          Generating your encryption keys... This may take a few seconds.
        </div>
      )}

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
            pattern="[a-zA-Z0-9_]{3,30}"
            title="Username must be 3-30 characters and contain only letters, numbers, and underscores"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
            minLength="8"
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            Must be at least 8 characters with uppercase, lowercase, and number
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
