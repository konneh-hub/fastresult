import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface RoleAssignment {
  id: string;
  userEmail: string;
  userName: string;
  role: string;
  assignedDate: string;
  assignedBy: string;
  status: 'active' | 'removed';
}

export default function RoleAssignment() {
  const [assignments, setAssignments] = useState<RoleAssignment[]>([
    { id: '1', userEmail: 'dean@university.edu', userName: 'Dr. John Dean', role: 'Dean', assignedDate: '2024-01-15', assignedBy: 'admin', status: 'active' },
    { id: '2', userEmail: 'hod@university.edu', userName: 'Prof. Jane HOD', role: 'Head of Department', assignedDate: '2024-02-20', assignedBy: 'admin', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userEmail: '', role: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAssignRole = () => {
    if (!formData.userEmail || !formData.role) {
      alert('Please select user and role');
      return;
    }
    if (editingId) {
      setAssignments(assignments.map(a => a.id === editingId ? { ...a, role: formData.role } : a));
      setEditingId(null);
    } else {
      setAssignments([...assignments, {
        id: Date.now().toString(),
        userEmail: formData.userEmail,
        userName: 'User Name',
        role: formData.role,
        assignedDate: new Date().toISOString().split('T')[0],
        assignedBy: 'admin',
        status: 'active'
      }]);
    }
    setFormData({ userEmail: '', role: '' });
    setShowForm(false);
  };

  const handleRemoveRole = (id: string) => {
    if (confirm('Remove this role assignment?')) {
      setAssignments(assignments.map(a => a.id === id ? { ...a, status: 'removed' } : a));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🔐 Role Assignment</h1>
          <p>Assign roles to users. Changes are logged for audit trail.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> Assign Role
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Change' : 'Assign'} Role</h3>
          <div className="form-group">
            <label>User Email</label>
            <input type="email" placeholder="user@university.edu" value={formData.userEmail} onChange={(e) => setFormData({...formData, userEmail: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="">Select Role</option>
              <option value="Dean">Dean</option>
              <option value="Head of Department">Head of Department</option>
              <option value="Exam Officer">Exam Officer</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAssignRole}>{editingId ? 'Update' : 'Assign'} Role</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ userEmail: '', role: '' }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Assigned Date</th>
              <th>Assigned By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment.id}>
                <td>{assignment.userEmail}</td>
                <td>{assignment.userName}</td>
                <td className="font-semibold">{assignment.role}</td>
                <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                <td>{assignment.assignedBy}</td>
                <td><span className={`status-badge status-${assignment.status}`}>{assignment.status}</span></td>
                <td className="action-buttons">
                  {assignment.status === 'active' && (
                    <>
                      <button className="btn-sm" onClick={() => {
                        setFormData({ userEmail: assignment.userEmail, role: assignment.role });
                        setEditingId(assignment.id);
                        setShowForm(true);
                      }}><FiEdit /></button>
                      <button className="btn-sm" onClick={() => handleRemoveRole(assignment.id)}><FiTrash2 /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}