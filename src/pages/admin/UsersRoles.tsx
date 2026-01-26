import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'locked';
}

export default function UsersRoles() {
  const storedUsersRoles = (() => { try { return JSON.parse(localStorage.getItem('appUsers') || 'null') || null } catch { return null } })();
  const [users, setUsers] = useState<User[]>(storedUsersRoles || [
    { id: '1', name: 'John Admin', email: 'john@uni.edu', role: 'Admin', department: 'IT', phone: '+1-111-1111', lastLogin: '2024-01-23', status: 'active' },
    { id: '2', name: 'Jane Dean', email: 'jane@uni.edu', role: 'Dean', department: 'Science', phone: '+1-111-1112', lastLogin: '2024-01-22', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Lecturer',
    department: '',
    phone: '',
  });

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill required fields');
      return;
    }
    if (editingId) {
      const updated = users.map(u => u.id === editingId ? { ...u, ...formData } : u);
      setUsers(updated); setEditingId(null);
      try { localStorage.setItem('appUsers', JSON.stringify(updated)); } catch(e){}
    } else {
      const updated = [...users, { id: Date.now().toString(), ...formData, lastLogin: '', status: 'active' }];
      setUsers(updated);
      try { localStorage.setItem('appUsers', JSON.stringify(updated)); } catch(e){}
    }
    setFormData({ name: '', email: '', role: 'Lecturer', department: '', phone: '' });
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    const { id, lastLogin, status, ...data } = user;
    setFormData(data);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated); try { localStorage.setItem('appUsers', JSON.stringify(updated)); } catch(e){}
    }
  };

  const toggleStatus = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u);
    setUsers(updated); try { localStorage.setItem('appUsers', JSON.stringify(updated)); } catch(e){}
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👥 Users & Roles</h1>
          <p>Manage system users and assign roles.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', email: '', role: 'Lecturer', department: '', phone: '' }); }}>
          <FiPlus /> Add User
        </button>
      </div>

      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Add'} User</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="john@uni.edu" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="Admin">Admin</option>
                <option value="Dean">Dean</option>
                <option value="HOD">Head of Department</option>
                <option value="Exam Officer">Exam Officer</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" placeholder="Computer Science" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+1-111-1111" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddUser}>{editingId ? 'Update' : 'Add'} User</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="font-semibold">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td>{user.phone}</td>
                <td>{user.lastLogin || 'Never'}</td>
                <td><span className={`status-badge status-${user.status}`}>{user.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(user)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => toggleStatus(user.id)}>Toggle</button>
                  <button className="btn-sm" onClick={() => handleDelete(user.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
