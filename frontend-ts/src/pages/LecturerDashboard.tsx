import React from "react";

export default function LecturerDashboard() {
  return (
    <div>
      <h2>Lecturer Dashboard</h2>
      <p>Upload CA & exam scores, edit before submission, and submit for validation.</p>
      <ul>
        <li><a href="/lecturer/upload">Upload Results</a></li>
        <li><a href="/lecturer/results">My Results</a></li>
      </ul>
    </div>
  );
}
