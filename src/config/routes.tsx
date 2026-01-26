import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// Admin Routes
import AdminDashboard from '../pages/admin/Dashboard';
import UniversitySetup from '../pages/admin/UniversitySetup';
import FacultiesStructure from '../pages/admin/FacultiesStructure';
import UsersRoles from '../pages/admin/UsersRoles';
import Permissions from '../pages/admin/Permissions';
import AuditLogs from '../pages/admin/AuditLogs';
import Backups from '../pages/admin/Backups';
import Integrations from '../pages/admin/Integrations';
import AdminSupport from '../pages/admin/Support';

// Dean Routes
import DeanDashboard from '../pages/dean/Dashboard';
import Departments from '../pages/dean/Departments';
import Programs from '../pages/dean/Programs';
import CoursesModules from '../pages/dean/CoursesModules';
import GPARules from '../pages/dean/GPARules';
import DeanApprovals from '../pages/dean/Approvals';
import DeanReports from '../pages/dean/Reports';

// HOD Routes
import HODDashboard from '../pages/hod/Dashboard';
import Students from '../pages/hod/Students';
import Lecturers from '../pages/hod/Lecturers';
import CourseAssignment from '../pages/hod/CourseAssignment';
import ResultsReview from '../pages/hod/ResultsReview';
import ApprovalsReturns from '../pages/hod/ApprovalsReturns';
import HODReports from '../pages/hod/Reports';

// Exam Officer Routes
import ExamOfficerDashboard from '../pages/examofficer/Dashboard';
import ResultsCompilation from '../pages/examofficer/ResultsCompilation';
import PublishResults from '../pages/examofficer/PublishResults';
import TranscriptCenter from '../pages/examofficer/TranscriptCenter';
import ResultProgressTracker from '../pages/examofficer/ResultProgressTracker';
import Exceptions from '../pages/examofficer/Exceptions';
import SenateReports from '../pages/examofficer/SenateReports';

// Lecturer Routes
import LecturerDashboard from '../pages/lecturer/Dashboard';
import MyCourses from '../pages/lecturer/MyCourses';
import EnterResults from '../pages/lecturer/EnterResults';
import UploadExcel from '../pages/lecturer/UploadExcel';
import Drafts from '../pages/lecturer/Drafts';
import SubmittedReturned from '../pages/lecturer/SubmittedReturned';
import Analytics from '../pages/lecturer/Analytics';

// Student Routes
import StudentDashboard from '../pages/student/Dashboard';
import MyResults from '../pages/student/MyResults';
import Transcript from '../pages/student/Transcript';
// Use the shared admin-style profile settings for student profile
import StudentProfile from '../pages/ProfileSettings';
import StudentSupport from '../pages/student/Support';
import Notifications from '../pages/student/Notifications';

// Layouts
import AdminLayout from '../components/layouts/AdminLayout';
import DeanLayout from '../components/layouts/DeanLayout';
import HODLayout from '../components/layouts/HODLayout';
import ExamOfficerLayout from '../components/layouts/ExamOfficerLayout';
import LecturerLayout from '../components/layouts/LecturerLayout';
import StudentLayout from '../components/layouts/StudentLayout';

export const createRoleBasedRoutes = (): RouteObject[] => {
  return [
    // Admin Routes
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: '', element: <Navigate to="dashboard" /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'university-setup', element: <UniversitySetup /> },
        { path: 'faculties-structure', element: <FacultiesStructure /> },
        { path: 'users-roles', element: <UsersRoles /> },
        { path: 'permissions', element: <Permissions /> },
        { path: 'audit-logs', element: <AuditLogs /> },
        { path: 'backups', element: <Backups /> },
        { path: 'integrations', element: <Integrations /> },
        { path: 'support', element: <AdminSupport /> },
      ],
    },

    // Dean Routes
    {
      path: '/dean',
      element: <DeanLayout />,
      children: [
        { path: '', element: <Navigate to="dashboard" /> },
        { path: 'dashboard', element: <DeanDashboard /> },
        { path: 'departments', element: <Departments /> },
        { path: 'programs', element: <Programs /> },
        { path: 'courses-modules', element: <CoursesModules /> },
        { path: 'gpa-rules', element: <GPARules /> },
        { path: 'approvals', element: <DeanApprovals /> },
        { path: 'reports', element: <DeanReports /> },
      ],
    },

    // HOD Routes
    {
      path: '/hod',
      element: <HODLayout />,
      children: [
        { path: '', element: <Navigate to="dashboard" /> },
        { path: 'dashboard', element: <HODDashboard /> },
        { path: 'students', element: <Students /> },
        { path: 'lecturers', element: <Lecturers /> },
        { path: 'course-assignment', element: <CourseAssignment /> },
        { path: 'results-review', element: <ResultsReview /> },
        { path: 'approvals-returns', element: <ApprovalsReturns /> },
        { path: 'reports', element: <HODReports /> },
      ],
    },

    // Exam Officer Routes
    {
      path: '/exam-officer',
      element: <ExamOfficerLayout />,
      children: [
        { path: '', element: <Navigate to="dashboard" /> },
        { path: 'dashboard', element: <ExamOfficerDashboard /> },
        { path: 'results-compilation', element: <ResultsCompilation /> },
        { path: 'publish-results', element: <PublishResults /> },
        { path: 'transcript-center', element: <TranscriptCenter /> },
        { path: 'result-progress-tracker', element: <ResultProgressTracker /> },
        { path: 'exceptions', element: <Exceptions /> },
        { path: 'senate-reports', element: <SenateReports /> },
      ],
    },

    // Lecturer Routes
    {
      path: '/lecturer',
      element: <LecturerLayout />,
      children: [
        { path: '', element: <Navigate to="dashboard" /> },
        { path: 'dashboard', element: <LecturerDashboard /> },
        { path: 'my-courses', element: <MyCourses /> },
        { path: 'enter-results', element: <EnterResults /> },
        { path: 'upload-excel', element: <UploadExcel /> },
        { path: 'drafts', element: <Drafts /> },
        { path: 'submitted-returned', element: <SubmittedReturned /> },
        { path: 'analytics', element: <Analytics /> },
      ],
    },

    // Student Routes
    {
      path: '/student',
      element: <StudentLayout />,
      children: [
        { path: '', element: <Navigate to="dashboard" /> },
        { path: 'dashboard', element: <StudentDashboard /> },
        { path: 'my-results', element: <MyResults /> },
        { path: 'transcript', element: <Transcript /> },
        { path: 'profile', element: <StudentProfile /> },
        { path: 'support', element: <StudentSupport /> },
        { path: 'notifications', element: <Notifications /> },
      ],
    },
  ];
};
