import React from "react";
import { Routes, Route, Navigate, useLocation, useEffect } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HowItWorks from "./pages/HowItWorks";
import Roles from "./pages/Roles";
import Support from "./pages/Support";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";

// Shared Pages
import SharedProfileSettings from "./pages/ProfileSettings";
import UserRoleProfile from "./pages/shared/UserRoleProfile";

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
// Use shared ProfileSettings for all roles (admin page reused)
// ProfileSettings is imported above as SharedProfileSettings

// Dean Routes
import DeanLayout from "./components/layouts/DeanLayout";
import DeanDashboard from "./pages/dean/DeanDashboard";
import DeanDepartments from "./pages/dean/DeanDepartments";
import DeanPrograms from "./pages/dean/DeanPrograms";
import DeanApprovals from "./pages/dean/DeanApprovals";
import DeanReports from "./pages/dean/DeanReports";
import DeanGPARules from "./pages/dean/DeanGPARules";
import ManageFacultyStudents from "./pages/dean/ManageFacultyStudents";
import CoursesModules from "./pages/dean/CoursesModules";

// HOD Routes
import HODLayout from "./components/layouts/HODLayout";
import HODDashboard from "./pages/hod/HODDashboard";
import HODStudents from "./pages/hod/HODStudents";
import HODLecturers from "./pages/hod/HODLecturers";
import CourseAssignment from "./pages/hod/CourseAssignment";
import ResultsReview from "./pages/hod/ResultsReview";
import ApprovalsReturns from "./pages/hod/ApprovalsReturns";
import HODReports from "./pages/hod/Reports";

// Exam Officer Routes
import ExamOfficerLayout from "./components/layouts/ExamOfficerLayout";
import ExamOfficerDashboard from "./pages/examofficer/ExamOfficerDashboard";
import ResultsCompilation from "./pages/examofficer/ResultsCompilation";
import PublishResults from "./pages/examofficer/PublishResults";
import TranscriptCenter from "./pages/examofficer/TranscriptCenter";
import ResultProgressTracker from "./pages/examofficer/ResultProgressTracker";
import Exceptions from "./pages/examofficer/Exceptions";
import SenateReports from "./pages/examofficer/SenateReports";

// Lecturer Routes
import LecturerLayout from "./components/layouts/LecturerLayout";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import MyCourses from "./pages/lecturer/MyCourses";
import EnterResults from "./pages/lecturer/EnterResults";
import UploadExcel from "./pages/lecturer/UploadExcel";
import Drafts from "./pages/lecturer/Drafts";
import SubmittedReturned from "./pages/lecturer/SubmittedReturned";
import LecturerAnalytics from "./pages/lecturer/Analytics";

// Student Routes
import StudentLayout from "./components/layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyResults from "./pages/student/MyResults";
import Transcript from "./pages/student/Transcript";
import Profile from "./pages/student/Profile";
import Notifications from "./pages/student/Notifications";
import StudentSupport from "./pages/student/Support";

import './App.css';

export default function App() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const location = useLocation();

  // Apply theme from localStorage on app initialization (per-user)
  React.useEffect(() => {
    const savedTheme = user ? (localStorage.getItem(`userTheme_${user.id}`) || '#f5f6f8') : '#f5f6f8';
    document.body.style.backgroundColor = savedTheme;
  }, [user]);

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Public Pages */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/support" element={<Support />} />
        <Route path="/help" element={<Help />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />

        {/* Shared Route for all authenticated users */}
        <Route
          path="/profile-settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin", "faculty_dean", "dean", "hod", "exam_officer", "lecturer", "student"]}>
              <SharedProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* User Role & Responsibility Profile */}
        <Route
          path="/my-role"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin", "faculty_dean", "dean", "hod", "exam_officer", "lecturer", "student"]}>
              <UserRoleProfile />
            </ProtectedRoute>
          }
        />

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
          <Route path="profile-settings" element={<SharedProfileSettings />} />
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
          <Route path="courses-modules" element={<CoursesModules />} />
          <Route path="faculty-students" element={<ManageFacultyStudents />} />
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
          <Route path="course-assignment" element={<CourseAssignment />} />
          <Route path="results-review" element={<ResultsReview />} />
          <Route path="approvals-returns" element={<ApprovalsReturns />} />
          <Route path="reports" element={<HODReports />} />
        </Route>

        {/* Exam Officer Routes */}
        <Route
          path="/exam-officer"
          element={
            <ProtectedRoute allowedRoles={["exam_officer"]}>
              <ExamOfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ExamOfficerDashboard />} />
          <Route path="results-compilation" element={<ResultsCompilation />} />
          <Route path="publish-results" element={<PublishResults />} />
          <Route path="transcript-center" element={<TranscriptCenter />} />
          <Route path="result-progress-tracker" element={<ResultProgressTracker />} />
          <Route path="exceptions" element={<Exceptions />} />
          <Route path="senate-reports" element={<SenateReports />} />
          <Route path="profile-settings" element={<SharedProfileSettings />} />
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
          <Route path="enter-results" element={<EnterResults />} />
          <Route path="upload-excel" element={<UploadExcel />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="submitted-returned" element={<SubmittedReturned />} />
          <Route path="analytics" element={<LecturerAnalytics />} />
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
          <Route path="my-results" element={<MyResults />} />
          <Route path="transcript" element={<Transcript />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<StudentSupport />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
