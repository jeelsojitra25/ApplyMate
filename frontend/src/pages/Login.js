import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = isRegister
        ? 'http://localhost:3000/api/auth/register'
        : 'http://localhost:3000/api/auth/login';
      const response = await axios.post(url, formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="login-page">
      {/* Left branding panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <div className="login-logo-box">🎯</div>
            ApplyMate
          </div>
          <p className="login-tagline">Your AI-powered job search companion</p>
        </div>

        <div className="login-hero">
          <h2>Land your dream job faster</h2>
          <p>
            Track every application, get AI-powered resume feedback, generate
            perfect cover letters, and never miss a follow-up again.
          </p>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <div className="login-feature-icon">📊</div>
            <span>Dashboard analytics to visualize your job search</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">🤖</div>
            <span>AI resume matching and improvement suggestions</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">✉️</div>
            <span>Auto-generate cover letters and follow-up emails</span>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">🔔</div>
            <span>Smart reminders for follow-up dates</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-form-card">
          <div className="login-form-header">
            <h1 className="login-form-title">
              {isRegister ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="login-form-subtitle">
              {isRegister
                ? 'Start tracking your job applications today'
                : 'Sign in to your ApplyMate account'}
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>

            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner spinner-sm" />
                  Please wait…
                </>
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="login-toggle">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <span onClick={switchMode}>
              {isRegister ? ' Sign in' : ' Create one'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
