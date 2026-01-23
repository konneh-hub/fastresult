import React, { useState } from 'react';
import { FiEdit, FiLock, FiUnlock, FiKey, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import './AdminPages.css';

interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'disabled' | 'locked';
  createdDate: string;
}

export default function UserAccounts() {
  const [users, setUsers] = useState<UserAccount[]>([
    { id: '1', email: 'dean@university.edu', name: 'Dr. John Dean', role: 'Dean', status: 'active', createdDate: '2024-01-15' },
    { id: '2', email: 'lecturer@university.edu', name: 'Prof. Jane Lecturer', role: 'Lecturer', status: 'active', createdDate: '2024-02-20' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ email: '', name: '', role: 'Lecturer' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateUser = () => {
    if (!formData.email || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }
    if (editingId) {
      setUsers(users.map(u => u.id === editingId ? { ...u, email: formData.email, name: formData.name, role: formData.role } : u));
      setEditingId(null);
    } else {
      setUsers([...users, { id: Date.now().toString(), ...formData, status: 'active', createdDate: new Date().toISOString().split('T')[0] }]);
    }
    setFormData({ email: '', name: '', role: 'Lecturer' });
    setShowForm(false);
  };

  const handleLockAccount = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'locked' } : u));
  };

  const handleUnlockAccount = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
  };

  const handleDisable = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'disabled' } : u));
  };

  const handleResetPassword = (id: string) => {
    const user = users.find(u => u.id === id);
    alert(`Password reset email sent to ${user?.email}. They will receive instructions to set a new password.`);
  };

  const handleDelete = (id: string) => {
    if (confirm('This will permanently delete the account. Continue?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => u.email.includes(searchTerm) || u.name.includes(searchTerm));

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👤 User Accounts</h1>
          <p> Manage, and secure user accounts. Reset passwords and control access.</p>
        </div>
        
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} User Account</h3>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="user@university.edu" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option>Dean</option>
              <option>Head of Department</option>
              <option>Exam Officer</option>
              <option>Lecturer</option>
              <option>Student</option>
              <option>Admin Staff</option>
            </select>
          </div>
          
        </div>
      )}

      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td><span className={`status-badge status-${user.status}`}>{user.status}</span></td>
                <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleResetPassword(user.id)} title="Reset Password"><FiKey /></button>
                  {user.status !== 'locked' && <button className="btn-sm" onClick={() => handleLockAccount(user.id)} title="Lock"><FiLock /></button>}
                  {user.status === 'locked' && <button className="btn-sm" onClick={() => handleUnlockAccount(user.id)} title="Unlock"><FiUnlock /></button>}
                  <button className="btn-sm" onClick={() => handleDisable(user.id)} title="Disable">⛔</button>
                  <button className="btn-sm" onClick={() => handleDelete(user.id)} title="Delete"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}