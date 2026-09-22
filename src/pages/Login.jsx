import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { username, password } = formData;

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Send credentials to backend with credentials: 'include' to receive HttpOnly cookie
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HttpOnly authToken cookie
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/home');
        }, 800);
      } else {
        setError(data.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error('Login network error:', err);
      setError('Unable to connect to backend server. Make sure Spring Boot is running on port 3030.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Minimalist Header */}
        <div className="auth-header">
          <div className="auth-brand-icon">
            <Lock size={18} strokeWidth={1.75} />
          </div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Enter your account credentials to continue</p>
        </div>

        {/* Minimalist Feedback Messages */}
        {error && (
          <div className="alert alert-error" role="alert">
            <AlertCircle className="alert-icon" size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <CheckCircle2 className="alert-icon" size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={16} strokeWidth={1.75} />
              <input
                id="login-username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} strokeWidth={1.75} />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-btn"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="btn-spinner" size={16} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={15} strokeWidth={2} />
              </>
            )}
          </button>
        </form>

        {/* Minimalist Footer */}
        <div className="auth-footer">
          <p className="auth-switch-text">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
