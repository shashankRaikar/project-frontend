import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3030/api';

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/home`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Sends authToken cookie to backend
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: data.data || { username: data.username },
        });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (err) {
      console.error('Session verification error:', err);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="auth-wrapper">
        <div className="auth-loading-card">
          <Loader2 className="auth-spinner-icon" size={24} strokeWidth={2} />
          <p className="loading-text">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    // If not authenticated, redirect to /login
    return <Navigate to="/login" replace />;
  }

  // Pass authenticated user data and logout handler
  return React.cloneElement(children, {
    user: authState.user,
    onLogout: () => setAuthState({ isLoading: false, isAuthenticated: false, user: null }),
  });
};

export default ProtectedRoute;
