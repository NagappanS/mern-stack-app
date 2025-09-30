import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ token, roleRequired, children }) => {
  if (!token) return <Navigate to="/login" replace />;

  const role = localStorage.getItem("role");

  // If a specific role is required and current role doesn't match
  if (roleRequired && role !== roleRequired) {
    // Redirect based on role
    return role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/restaurants" replace />;
  }

  return children;
};

export default ProtectedRoute;
