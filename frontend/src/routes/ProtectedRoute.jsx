import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router';
import LoadingPage from '@/pages/LoadingPage'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <LoadingPage />;
    return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute