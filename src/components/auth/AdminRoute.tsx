// components/AdminRoute.tsx
import { useAuth } from '@components/auth/AuthContext';
import { Navigate } from 'react-router-dom';

import React from 'react';

const AdminRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />; // 또는 권한 없음 페이지
  } 

  return children;
};

export default AdminRoute;