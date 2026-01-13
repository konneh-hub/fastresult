import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ExamOfficerDashboard from "./pages/ExamOfficerDashboard";
import FacultyDeanDashboard from "./pages/FacultyDeanDashboard";
import HODDashboard from "./pages/HODDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Users from "./pages/Users";
import AdminFaculties from "./pages/AdminFaculties";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

// pages
import LecturerUpload from "./pages/LecturerUpload";
import LecturerResults from "./pages/LecturerResults";
import HODApprovals from "./pages/HODApprovals";
import FacultyApprovals from "./pages/FacultyApprovals";
import ExamApprovals from "./pages/ExamApprovals";

export default function App() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav>
        {user ? (
          <>
            <span className="navInfo">Logged in: {user.email} ({user.role})</span>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="logoutButton">Logout</button>
          </>
        ) : null}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>}
        />
        <Route
          path="/admin/faculties"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminFaculties /></ProtectedRoute>}
        />

        <Route
          path="/exam"
          element={<ProtectedRoute allowedRoles={["exam_officer"]}><ExamOfficerDashboard /></ProtectedRoute>}
        />

        <Route
          path="/dean"
          element={<ProtectedRoute allowedRoles={["faculty_dean"]}><FacultyDeanDashboard /></ProtectedRoute>}
        />

        <Route
          path="/hod"
          element={<ProtectedRoute allowedRoles={["hod"]}><HODDashboard /></ProtectedRoute>}
        />

        <Route
          path="/lecturer"
          element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerDashboard /></ProtectedRoute>}
        />
        <Route
          path="/lecturer/upload"
          element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerUpload /></ProtectedRoute>}
        />
        <Route
          path="/lecturer/results"
          element={<ProtectedRoute allowedRoles={["lecturer"]}><LecturerResults /></ProtectedRoute>}
        />

        <Route
          path="/hod"
          element={<ProtectedRoute allowedRoles={["hod"]}><HODDashboard /></ProtectedRoute>}
        />
        <Route
          path="/hod/approvals"
          element={<ProtectedRoute allowedRoles={["hod"]}><HODApprovals /></ProtectedRoute>}
        />

        <Route
          path="/dean"
          element={<ProtectedRoute allowedRoles={["faculty_dean"]}><FacultyDeanDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dean/approvals"
          element={<ProtectedRoute allowedRoles={["faculty_dean"]}><FacultyApprovals /></ProtectedRoute>}
        />

        <Route
          path="/exam"
          element={<ProtectedRoute allowedRoles={["exam_officer"]}><ExamOfficerDashboard /></ProtectedRoute>}
        />
        <Route
          path="/exam/approvals"
          element={<ProtectedRoute allowedRoles={["exam_officer"]}><ExamApprovals /></ProtectedRoute>}
        />

        <Route
          path="/student"
          element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>}
        />

        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
