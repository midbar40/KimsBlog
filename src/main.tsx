import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // createBrowserRouter 정의한 곳
import './global.css';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { AuthProvider } from '@components/auth/AuthContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
