import React, { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import './AdminPages.css';

interface Permission {
  resource: string;
  admin: boolean;
  dean: boolean;
  hod: boolean;
  lecturer: boolean;
  student: boolean;
}

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([
    { resource: 'View Results', admin: true, dean: true, hod: true, lecturer: true, student: true },
    { resource: 'Upload Grades', admin: true, dean: true, hod: true, lecturer: true, student: false },
    { resource: 'Approve Results', admin: true, dean: true, hod: true, lecturer: false, student: false },
    { resource: 'Manage Users', admin: true, dean: false, hod: false, lecturer: false, student: false },
    { resource: 'View Analytics', admin: true, dean: true, hod: true, lecturer: false, student: false },
    { resource: 'Generate Reports', admin: true, dean: true, hod: true, lecturer: false, student: false },
    { resource: 'Manage Courses', admin: true, dean: true, hod: true, lecturer: false, student: false },
    { resource: 'Approve Transcripts', admin: true, dean: true, hod: false, lecturer: false, student: false },
  ]);

  const togglePermission = (index: number, role: 'admin' | 'dean' | 'hod' | 'lecturer' | 'student') => {
    const updated = [...permissions];
    updated[index][role] = !updated[index][role];
    setPermissions(updated);
  };

  const savePermissions = () => {
    alert('Permissions updated successfully!');
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🔐 Permissions Management</h1>
          <p>Manage detailed role-based permissions and access control.</p>
        </div>
        <button className="btn-primary" onClick={savePermissions}>
          Save Permissions
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Resource/Action</th>
              <th>Admin</th>
              <th>Dean</th>
              <th>HOD</th>
              <th>Lecturer</th>
              <th>Student</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, idx) => (
              <tr key={idx}>
                <td className="font-semibold">{perm.resource}</td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={perm.admin}
                    onChange={() => togglePermission(idx, 'admin')}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={perm.dean}
                    onChange={() => togglePermission(idx, 'dean')}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={perm.hod}
                    onChange={() => togglePermission(idx, 'hod')}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={perm.lecturer}
                    onChange={() => togglePermission(idx, 'lecturer')}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={perm.student}
                    onChange={() => togglePermission(idx, 'student')}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-card">
        <h3>📋 Permission Legend</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li><strong>Admin:</strong> Full system access and management capabilities</li>
          <li><strong>Dean:</strong> Faculty-level administrative access</li>
          <li><strong>HOD:</strong> Department-level management access</li>
          <li><strong>Lecturer:</strong> Course and student management access</li>
          <li><strong>Student:</strong> Personal result and transcript access</li>
        </ul>
      </div>
    </div>
  );
}
