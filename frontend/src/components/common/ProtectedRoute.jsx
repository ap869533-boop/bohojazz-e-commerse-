import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-boho-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-boho-terra border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to their own dashboard
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'vendor') return <Navigate to="/vendor" replace />;
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default ProtectedRoute;
