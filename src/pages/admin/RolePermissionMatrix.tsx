import React, { useState } from 'react';
import './AdminPages.css';

interface Permission {
  page: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export default function RolePermissionMatrix() {
  const [selectedRole, setSelectedRole] = useState('lecturer');
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({
    lecturer: [
      { page: 'My Courses', view: true, create: false, edit: true, delete: false, approve: false },
      { page: 'Enter Results', view: true, create: true, edit: true, delete: false, approve: false },
      { page: 'My Students', view: true, create: false, edit: false, delete: false, approve: false },
    ],
    hod: [
      { page: 'Department', view: true, create: true, edit: true, delete: false, approve: true },
      { page: 'Courses', view: true, create: true, edit: true, delete: true, approve: false },
      { page: 'Results Review', view: true, create: false, edit: false, delete: false, approve: true },
    ],
    dean: [
      { page: 'All Pages', view: true, create: true, edit: true, delete: true, approve: true },
    ]
  });

  const roles = ['Lecturer', 'HOD', 'Dean', 'Exam Officer'];

  const togglePermission = (role: string, index: number, key: keyof Omit<Permission, 'page'>) => {
    setPermissions(prev => ({
      ...prev,
      [role]: prev[role].map((p, i) => i === index ? { ...p, [key]: !p[key] } : p)
    }));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🗂️ Role-Permission Matrix</h1>
          <p>Define what each role can do: view, create, edit, delete, and approve.</p>
        </div>
      </div>

      <div className="form-card">
        <label style={{marginBottom: '1rem', display: 'block'}}>Select Role to Configure:</label>
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{padding: '0.75rem', minWidth: '200px'}}>
          <option value="lecturer">Lecturer</option>
          <option value="hod">Head of Department</option>
          <option value="dean">Dean</option>
        </select>
      </div>

      <div className="table-card">
        <h3>Permissions for {selectedRole.toUpperCase()}</h3>
        <table style={{fontSize: '0.95rem'}}>
          <thead>
            <tr>
              <th>Page/Module</th>
              <th style={{textAlign: 'center'}}>View</th>
              <th style={{textAlign: 'center'}}>Create</th>
              <th style={{textAlign: 'center'}}>Edit</th>
              <th style={{textAlign: 'center'}}>Delete</th>
              <th style={{textAlign: 'center'}}>Approve</th>
            </tr>
          </thead>
          <tbody>
            {permissions[selectedRole]?.map((perm, idx) => (
              <tr key={idx}>
                <td className="font-semibold">{perm.page}</td>
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={perm.view} onChange={() => togglePermission(selectedRole, idx, 'view')} />
                </td>
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={perm.create} onChange={() => togglePermission(selectedRole, idx, 'create')} />
                </td>
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={perm.edit} onChange={() => togglePermission(selectedRole, idx, 'edit')} />
                </td>
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={perm.delete} onChange={() => togglePermission(selectedRole, idx, 'delete')} />
                </td>
                <td style={{textAlign: 'center'}}>
                  <input type="checkbox" checked={perm.approve} onChange={() => togglePermission(selectedRole, idx, 'approve')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-card">
        <h3>Permission Definitions</h3>
        <ul style={{lineHeight: '1.8'}}>
          <li><strong>View:</strong> Can see pages and data</li>
          <li><strong>Create:</strong> Can create new items</li>
          <li><strong>Edit:</strong> Can modify existing items</li>
          <li><strong>Delete:</strong> Can remove items</li>
          <li><strong>Approve:</strong> Can approve submissions and requests</li>
        </ul>
      </div>
    </div>
  );
}