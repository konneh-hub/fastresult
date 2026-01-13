import React from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  const roleMap: Record<string, string> = {
    admin: "/admin",
    exam_officer: "/exam",
    faculty_dean: "/dean",
    hod: "/hod",
    lecturer: "/lecturer",
    student: "/student",
  };

  const route = roleMap[user.role] || "/login";
  return <Navigate to={route} replace />;
}
