import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiLock, FiArchive } from 'react-icons/fi';

interface AcademicSession {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'archived' | 'locked';
}

export default function AcademicSessions() {
  const [sessions, setSessions] = useState<AcademicSession[]>([
    { id: '1', year: '2024/2025', startDate: '2024-09-01', endDate: '2025-08-31', status: 'active' },
    { id: '2', year: '2023/2024', startDate: '2023-09-01', endDate: '2024-08-31', status: 'archived' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ year: '', startDate: '', endDate: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSession = () => {
    if (!formData.year || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }
    if (editingId) {
      setSessions(sessions.map(s => s.id === editingId ? { ...s, ...formData } : s));
      setEditingId(null);
    } else {
      setSessions([...sessions, { id: Date.now().toString(), ...formData, status: 'active' }]);
    }
    setFormData({ year: '', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const handleEdit = (session: AcademicSession) => {
    setFormData({ year: session.year, startDate: session.startDate, endDate: session.endDate });
    setEditingId(session.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleLock = (id: string) => {
    setSessions(sessions.map(s => s.id === id && s.status !== 'locked' ? { ...s, status: 'locked' } : s));
  };

  const handleArchive = (id: string) => {
    setSessions(sessions.map(s => s.id === id && s.status !== 'locked' ? { ...s, status: 'archived' } : s));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📅 Academic Sessions</h1>
          <p>Create and manage academic years. Lock sessions after exams to prevent changes.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> Create Session
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Academic Session</h3>
          <div className="form-group">
            <label>Academic Year (e.g., 2024/2025)</label>
            <input type="text" placeholder="2024/2025" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
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
            <button className="btn-primary" onClick={handleAddSession}>{editingId ? 'Update' : 'Create'} Session</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ year: '', startDate: '', endDate: '' }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td className="font-semibold">{session.year}</td>
                <td>{new Date(session.startDate).toLocaleDateString()}</td>
                <td>{new Date(session.endDate).toLocaleDateString()}</td>
                <td><span className={`status-badge status-${session.status}`}>{session.status}</span></td>
                <td className="action-buttons">
                  {session.status !== 'locked' && (
                    <>
                      <button className="btn-sm" onClick={() => handleEdit(session)}><FiEdit /></button>
                      <button className="btn-sm" onClick={() => handleArchive(session.id)}><FiArchive /></button>
                      <button className="btn-sm" onClick={() => handleLock(session.id)}><FiLock /></button>
                    </>
                  )}
                  {session.status === 'locked' && <span>🔒 Locked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}