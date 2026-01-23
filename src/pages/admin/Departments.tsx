import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface Department {
  id: string;
  name: string;
  code: string;
  faculty: string;
  head: string;
  status: 'active' | 'inactive';
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Computer Science', code: 'CS', faculty: 'Science', head: 'Prof. John', status: 'active' },
    { id: '2', name: 'Mathematics', code: 'MATH', faculty: 'Science', head: 'Prof. Jane', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', faculty: '', head: '' });

  const handleAdd = () => {
    if (!formData.name || !formData.code) {
      alert('Please fill required fields');
      return;
    }
    setDepartments([...departments, { id: Date.now().toString(), ...formData, status: 'active' }]);
    setFormData({ name: '', code: '', faculty: '', head: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🏘️ Departments</h1>
          <p>Manage academic departments and their structure.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Add Department
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Create Department</h3>
          <div className="form-group">
            <label>Department Name</label>
            <input type="text" placeholder="Computer Science" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Department Code</label>
            <input type="text" placeholder="CS" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Faculty</label>
              <input type="text" placeholder="Science" value={formData.faculty} onChange={(e) => setFormData({...formData, faculty: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Department Head</label>
              <input type="text" placeholder="Prof. Name" value={formData.head} onChange={(e) => setFormData({...formData, head: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAdd}>Create</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Code</th>
              <th>Faculty</th>
              <th>Head</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept.id}>
                <td className="font-semibold">{dept.name}</td>
                <td>{dept.code}</td>
                <td>{dept.faculty}</td>
                <td>{dept.head}</td>
                <td><span className={`status-badge status-${dept.status}`}>{dept.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm"><FiEdit /></button>
                  <button className="btn-sm" onClick={() => handleDelete(dept.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}