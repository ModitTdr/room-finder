// PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingPage from '@/pages/LoadingPage';

const PublicRoute = ({ children }) => {
   const { isAuthenticated, isLoading } = useAuth();
   if (isLoading) return <LoadingPage />;
   return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
