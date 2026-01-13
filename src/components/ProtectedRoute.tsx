import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  allowedRoles: string[];
  children: JSX.Element;
};

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <div>Access denied</div>;
  return children;
}
