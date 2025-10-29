import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../pages/LoadingPage";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading, isError } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || !user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleProtectedRoute;
