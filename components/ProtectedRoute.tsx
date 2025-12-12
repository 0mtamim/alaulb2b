
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

// OWASP A01: Broken Access Control
// Enforce authentication and role-based access checks before rendering sensitive routes.
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userStr = localStorage.getItem('trade_user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User authorized but not for this specific role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
