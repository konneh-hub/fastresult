import React from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  // Normalize role
  const normalizedRole = user.role?.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');

  const roleMap: Record<string, string> = {
    admin: "/admin",
    super_admin: "/admin",
    exam_officer: "/exam-officer",
    faculty_dean: "/dean",
    dean: "/dean",
    hod: "/hod",
    lecturer: "/lecturer",
    student: "/student",
  };

  const route = roleMap[normalizedRole] || "/login";
  
  console.log("Dashboard - User Role:", user.role, "Normalized:", normalizedRole, "Route:", route);
  
  return <Navigate to={route} replace />;
}
