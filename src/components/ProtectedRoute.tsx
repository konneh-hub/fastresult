import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  allowedRoles: string[];
  children: JSX.Element;
};

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const token = localStorage.getItem("token");
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  // Check if token exists and user is parsed
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}
