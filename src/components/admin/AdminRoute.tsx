import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};
