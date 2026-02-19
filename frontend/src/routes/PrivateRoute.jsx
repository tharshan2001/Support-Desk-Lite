import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/authStore.js";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
