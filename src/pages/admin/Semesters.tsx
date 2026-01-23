import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiLock } from 'react-icons/fi';
import './AdminPages.css';

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYear: string;
  status: 'active' | 'ended' | 'locked';
}

export default function Semesters() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'First Semester 2024/2025', startDate: '2024-09-15', endDate: '2025-01-31', academicYear: '2024/2025', status: 'active' },
    { id: '2', name: 'Second Semester 2024/2025', startDate: '2025-02-15', endDate: '2025-06-30', academicYear: '2024/2025', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', academicYear: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSemester = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    if (editingId) {
      setSemesters(semesters.map(s => s.id === editingId ? { ...s, ...formData } : s));
      setEditingId(null);
    } else {
      setSemesters([...semesters, { id: Date.now().toString(), ...formData, status: 'active' }]);
    }
    setFormData({ name: '', startDate: '', endDate: '', academicYear: '' });
    setShowForm(false);
  };

  const handleEdit = (semester: Semester) => {
    setFormData({ name: semester.name, startDate: semester.startDate, endDate: semester.endDate, academicYear: semester.academicYear });
    setEditingId(semester.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this semester? This cannot be undone.')) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const handleLock = (id: string) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, status: 'locked' } : s));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📆 Semesters / Terms</h1>
          <p>Manage academic semesters. Lock semester after exams to prevent changes.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> Create Semester
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Semester</h3>
          <div className="form-group">
            <label>Semester Name (e.g., First Semester 2024/2025)</label>
            <input type="text" placeholder="First Semester 2024/2025" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Academic Year</label>
            <input type="text" placeholder="2024/2025" value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddSemester}>{editingId ? 'Update' : 'Create'} Semester</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', startDate: '', endDate: '', academicYear: '' }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Academic Year</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map(sem => (
              <tr key={sem.id}>
                <td className="font-semibold">{sem.name}</td>
                <td>{sem.academicYear}</td>
                <td>{new Date(sem.startDate).toLocaleDateString()}</td>
                <td>{new Date(sem.endDate).toLocaleDateString()}</td>
                <td><span className={`status-badge status-${sem.status}`}>{sem.status}</span></td>
                <td className="action-buttons">
                  {sem.status !== 'locked' && (
                    <>
                      <button className="btn-sm" onClick={() => handleEdit(sem)}><FiEdit /></button>
                      <button className="btn-sm" onClick={() => handleLock(sem.id)}><FiLock /></button>
                      <button className="btn-sm" onClick={() => handleDelete(sem.id)}><FiTrash2 /></button>
                    </>
                  )}
                  {sem.status === 'locked' && <span>🔒 Locked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}