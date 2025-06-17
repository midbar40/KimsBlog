// components/AdminRoute.tsx
import { useAuth } from '@components/auth/AuthContext';
import { Navigate } from 'react-router-dom';

import React from 'react';
import { User } from 'lucide-react';

const UserRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'USER' && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />; // 또는 권한 없음 페이지
  }

  return children;
};

export default UserRoute;