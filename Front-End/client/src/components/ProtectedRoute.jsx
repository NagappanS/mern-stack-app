// src/components/ProtectedRoute.jsx
// import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children,requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token) return <Navigate to="/login"/>;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
