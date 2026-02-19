// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthStore();

  console.log("ProtectedRoute check:", { user, isAuthenticated, loading, allowedRoles });

  if (loading) return <div>Loading user info... please wait</div>;

  if (!isAuthenticated) {
    console.log("User not authenticated → redirect to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role not allowed → redirect to unauthorized", user.role);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("User authorized → render children");
  return children;
};

export default ProtectedRoute;
