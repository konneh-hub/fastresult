import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Manage system users, faculties, departments, and grading rules.</p>
      <ul>
        <li>
          <Link to="/admin/users">User Management</Link>
        </li>
      </ul>
    </div>
  );
}
