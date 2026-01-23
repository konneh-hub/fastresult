import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import SetPassword from "./pages/SetPassword";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Routes
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAccountManagement from "./pages/admin/AdminAccountManagement";
import AdminVerificationPage from "./pages/admin/AdminVerificationPage";
import UniversitySetup from "./pages/admin/UniversitySetup";
import AcademicSessions from "./pages/admin/AcademicSessions";
import Semesters from "./pages/admin/Semesters";
import GradingTemplates from "./pages/admin/GradingTemplates";
import ResultRules from "./pages/admin/ResultRules";
import FacultiesStructure from "./pages/admin/FacultiesStructure";
import AdminDepartments from "./pages/admin/Departments";
import AdminPrograms from "./pages/admin/Programs";
import Courses from "./pages/admin/Courses";
import UsersRoles from "./pages/admin/UsersRoles";
import UserAccounts from "./pages/admin/UserAccounts";
import RoleAssignment from "./pages/admin/RoleAssignment";
import Permissions from "./pages/admin/Permissions";
import RolePermissionMatrix from "./pages/admin/RolePermissionMatrix";
import AuditLogs from "./pages/admin/AuditLogs";
import Backups from "./pages/admin/Backups";
import BackupSchedule from "./pages/admin/BackupSchedule";
import Restore from "./pages/admin/Restore";
import Integrations from "./pages/admin/Integrations";
import EmailIntegration from "./pages/admin/EmailIntegration";
import SMSIntegration from "./pages/admin/SMSIntegration";
import LMSIntegration from "./pages/admin/LMSIntegration";
import Payments from "./pages/admin/Payments";
import AdminSupport from "./pages/admin/Support";
import Tickets from "./pages/admin/Tickets";
import Escalations from "./pages/admin/Escalations";
import ProfileSettings from "./pages/admin/ProfileSettings";

// Dean Routes
import DeanLayout from "./components/layouts/DeanLayout";
import DeanDashboard from "./pages/dean/DeanDashboard";
import DeanDepartments from "./pages/dean/DeanDepartments";
import DeanPrograms from "./pages/dean/DeanPrograms";
import DeanApprovals from "./pages/dean/DeanApprovals";
import DeanReports from "./pages/dean/DeanReports";
import DeanGPARules from "./pages/dean/DeanGPARules";

// HOD Routes
import HODLayout from "./components/layouts/HODLayout";
import HODDashboard from "./pages/hod/HODDashboard";
import HODStudents from "./pages/hod/HODStudents";
import HODLecturers from "./pages/hod/HODLecturers";

// Exam Officer Routes
import ExamOfficerLayout from "./components/layouts/ExamOfficerLayout";
import ExamOfficerDashboard from "./pages/examofficer/ExamOfficerDashboard";

// Lecturer Routes
import LecturerLayout from "./components/layouts/LecturerLayout";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";

// Student Routes
import StudentLayout from "./components/layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentResults from "./pages/student/StudentResults";
import StudentTranscript from "./pages/student/StudentTranscript";

import './App.css';

export default function App() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const location = useLocation();

  // Check if current path is protected
  const isProtectedPath = () => {
    const protectedPaths = ['/admin', '/dean', '/hod', '/exam-officer', '/lecturer', '/student'];
    return protectedPaths.some(path => location.pathname.startsWith(path));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      {!isProtectedPath() && user && (
        <nav style={{ padding: '15px', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          <span style={{ marginRight: '20px' }}>Logged in: {user.email} ({user.role})</span>
          <button onClick={handleLogout} style={{ padding: '5px 15px', cursor: 'pointer' }}>
            Logout
          </button>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<AdminDashboard />} />
          <Route path="account-management" element={<AdminAccountManagement />} />
          <Route path="student-verification" element={<AdminVerificationPage />} />
          <Route path="university-setup" element={<UniversitySetup />} />
          <Route path="academic-sessions" element={<AcademicSessions />} />
          <Route path="semesters" element={<Semesters />} />
          <Route path="grading-templates" element={<GradingTemplates />} />
          <Route path="result-rules" element={<ResultRules />} />
          <Route path="faculties-structure" element={<FacultiesStructure />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="courses" element={<Courses />} />
          <Route path="users-roles" element={<UsersRoles />} />
          <Route path="user-accounts" element={<UserAccounts />} />
          <Route path="role-assignment" element={<RoleAssignment />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="role-permission-matrix" element={<RolePermissionMatrix />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="backups" element={<Backups />} />
          <Route path="backup-schedule" element={<BackupSchedule />} />
          <Route path="restore" element={<Restore />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="email-integration" element={<EmailIntegration />} />
          <Route path="sms-integration" element={<SMSIntegration />} />
          <Route path="lms-integration" element={<LMSIntegration />} />
          <Route path="payments" element={<Payments />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="escalations" element={<Escalations />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
        </Route>

        {/* Dean Routes */}
        <Route
          path="/dean"
          element={
            <ProtectedRoute allowedRoles={["faculty_dean", "dean"]}>
              <DeanLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<DeanDashboard />} />
          <Route path="departments" element={<DeanDepartments />} />
          <Route path="programs" element={<DeanPrograms />} />
          <Route path="approvals" element={<DeanApprovals />} />
          <Route path="gpa-rules" element={<DeanGPARules />} />
          <Route path="reports" element={<DeanReports />} />
        </Route>

        {/* HOD Routes */}
        <Route
          path="/hod"
          element={
            <ProtectedRoute allowedRoles={["hod"]}>
              <HODLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HODDashboard />} />
          <Route path="students" element={<HODStudents />} />
          <Route path="lecturers" element={<HODLecturers />} />
        </Route>

        {/* Exam Officer Routes */}
        <Route
          path="/exam_officer"
          element={
            <ProtectedRoute allowedRoles={["exam_officer"]}>
              <ExamOfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ExamOfficerDashboard />} />
        </Route>

        {/* Lecturer Routes */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <LecturerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<LecturerDashboard />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<StudentDashboard />} />
          <Route path="my-results" element={<StudentResults />} />
          <Route path="transcript" element={<StudentTranscript />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
