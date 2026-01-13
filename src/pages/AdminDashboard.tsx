import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Manage system users, faculties, departments, and grading rules.</p>
      </div>

      <ul className="dashboard-menu">
        <li className="dashboard-card">
          <Link to="/admin/users">
            <span className="card-title">User Management</span>
            <span className="card-desc">Add, edit, and manage users</span>
          </Link>
        </li>

        <li className="dashboard-card">
          <Link to="/admin/faculties">
            <span className="card-title">Faculties</span>
            <span className="card-desc">Manage faculties & departments</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
