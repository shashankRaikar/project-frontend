import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut, ShieldCheck, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      if (onLogout) {
        onLogout();
      }
      navigate('/login');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card home-card">
        {/* Top Minimalist Navigation Bar */}
        <div className="home-top-bar">
          <div className="brand-label">
            <span className="brand-dot"></span>
            <span>Dashboard</span>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            disabled={loggingOut}
            title="Sign out"
          >
            {loggingOut ? (
              <Loader2 className="btn-spinner" size={14} />
            ) : (
              <LogOut size={14} strokeWidth={1.75} />
            )}
            <span>Sign out</span>
          </button>
        </div>

        {/* Header / Welcome Box */}
        <div className="auth-header welcome-box">
          <div className="auth-brand-icon success-icon">
            <ShieldCheck size={18} strokeWidth={1.75} />
          </div>
          <h1 className="auth-title">Welcome back, {user?.username || 'User'}</h1>
          <p className="auth-subtitle">Here is your account and authentication status</p>
        </div>

        {/* Profile Details Card */}
        <div className="profile-details-card">
          <h2 className="profile-heading">Account details</h2>

          <div className="profile-item">
            <div className="profile-label">
              <User size={15} strokeWidth={1.75} />
              <span>Username</span>
            </div>
            <span className="profile-value">{user?.username || '—'}</span>
          </div>

          <div className="profile-item">
            <div className="profile-label">
              <Mail size={15} strokeWidth={1.75} />
              <span>Email</span>
            </div>
            <span className="profile-value">{user?.email || '—'}</span>
          </div>

          <div className="profile-item">
            <div className="profile-label">
              <Phone size={15} strokeWidth={1.75} />
              <span>Phone</span>
            </div>
            <span className="profile-value">{user?.phoneNumber || '—'}</span>
          </div>

          <div className="profile-item">
            <div className="profile-label">
              <ShieldCheck size={15} strokeWidth={1.75} />
              <span>Status</span>
            </div>
            <span className="session-active-badge">
              <span className="brand-dot"></span>
              Active session
            </span>
          </div>
        </div>

        {/* Understated Footer Note */}
        <div className="auth-footer">
          <p className="home-footer-note">
            Authenticated via secure HttpOnly JWT cookie session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
