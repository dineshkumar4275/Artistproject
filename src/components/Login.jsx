// components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authAPI.login(email, password);
      
      if (result && result.success && result.token) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        localStorage.setItem('user', JSON.stringify(result.user));
        
        toast.success('✅ Login successful!');
        
        // Call the onLogin callback
        if (onLogin) {
          onLogin(true);
        }
        
        // Navigate to admin dashboard
        navigate('/admin', { replace: true });
      } else {
        toast.error(result?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-brand">KAMESHFINEART</h1>
        <h2 className="login-title">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;