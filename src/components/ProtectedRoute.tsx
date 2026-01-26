import React from "react";
import { Navigate } from "react-router-dom";
import { hasRole, getDashboardRoute, getUserRole, type UserRole } from "../utils/roleAccessControl";

type Props = {
  allowedRoles: string[] | UserRole[];
  children: JSX.Element;
};

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const userRole = getUserRole();

  // Check if token exists and user is authenticated
  if (!token || !userRole) {
    console.log("ProtectedRoute: No token or user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Normalize allowed roles for comparison - map to standard UserRole type
  const roleMap: { [key: string]: string } = {
    'admin': 'admin',
    'super_admin': 'admin',
    'super-admin': 'admin',
    'dean': 'dean',
    'faculty_dean': 'dean',
    'faculty-dean': 'dean',
    'hod': 'hod',
    'head_of_department': 'hod',
    'head-of-department': 'hod',
    'exam_officer': 'examofficer',
    'exam-officer': 'examofficer',
    'examofficer': 'examofficer',
    'lecturer': 'lecturer',
    'student': 'student'
  };

  const normalizedAllowedRoles = allowedRoles.map(role => {
    const normalized = role.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    return roleMap[normalized] || normalized;
  });

  const userRoleStr = userRole as string;
  const normalizedUserRole = roleMap[userRoleStr] || userRoleStr;

  console.log("ProtectedRoute Debug:", {
    userRole: normalizedUserRole,
    allowedRoles: normalizedAllowedRoles,
    hasAccess: normalizedAllowedRoles.includes(normalizedUserRole),
    rawRole: userRole
  });

  // Check if user's role is in allowed roles
  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    // Redirect to user's dashboard
    const redirectPath = getDashboardRoute(userRole as UserRole);
    console.log("ProtectedRoute: User not authorized, redirecting to", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
