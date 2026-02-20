import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import KeyManager from './components/KeyManager';
import { storage } from './utils/storage';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [showKeyManager, setShowKeyManager] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = storage.getToken();
    const userData = storage.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
    setShowKeyManager(true); // Show key manager after registration
  };

  const handleLogout = () => {
    storage.clearAll();
    setUser(null);
    setActiveTab('login');
    setShowKeyManager(false);
  };

  if (user) {
    return (
      <div className="container">
        <div className="header">
          <h1>🔒 Secure File Storage</h1>
          <p>End-to-End Encrypted File Storage System</p>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
            Logout
          </button>
        </div>

        {showKeyManager && (
          <KeyManager 
            onKeyUpdate={() => setShowKeyManager(false)} 
          />
        )}

        {!showKeyManager && (
          <div>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`tab ${activeTab === 'keys' ? 'active' : ''}`}
                onClick={() => setActiveTab('keys')}
              >
                Key Management
              </button>
            </div>

            {activeTab === 'dashboard' && <Dashboard user={user} />}
            {activeTab === 'keys' && <KeyManager />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔒 Secure File Storage</h1>
        <p>End-to-End Encrypted File Storage Using Hybrid Cryptography</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
      </div>

      {activeTab === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {activeTab === 'register' && <Register onRegisterSuccess={handleRegisterSuccess} />}
    </div>
  );
}

export default App;
