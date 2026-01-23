import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import './AdminPages.css';

interface Escalation {
  id: string;
  title: string;
  submittedBy: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved';
  date: string;
  assignedTo: string;
}

export default function Escalations() {
  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: '1', title: 'Critical System Downtime', submittedBy: 'Dr. Admin', issue: 'Results portal not accessible', severity: 'critical', status: 'investigating', date: '2024-01-23', assignedTo: 'Tech Lead' },
    { id: '2', title: 'Grade Entry Bug', submittedBy: 'Dean', issue: 'Unable to submit grades for some courses', severity: 'high', status: 'investigating', date: '2024-01-22', assignedTo: 'Dev Team' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    issue: '',
    severity: 'medium' as const,
    assignedTo: '',
  });

  const handleAdd = () => {
    if (!formData.title || !formData.issue) {
      alert('Please fill required fields');
      return;
    }
    if (editingId) {
      setEscalations(escalations.map(e => e.id === editingId ? { ...e, title: formData.title, issue: formData.issue, severity: formData.severity, assignedTo: formData.assignedTo } : e));
      setEditingId(null);
    } else {
      setEscalations([...escalations, { id: Date.now().toString(), ...formData, submittedBy: 'Admin', status: 'pending', date: new Date().toISOString().split('T')[0] }]);
    }
    setFormData({ title: '', issue: '', severity: 'medium', assignedTo: '' });
    setShowForm(false);
  };

  const handleEdit = (escalation: Escalation) => {
    setFormData({ title: escalation.title, issue: escalation.issue, severity: escalation.severity, assignedTo: escalation.assignedTo });
    setEditingId(escalation.id);
    setShowForm(true);
  };

  const toggleStatus = (id: string) => {
    setEscalations(escalations.map(e => e.id === id ? { ...e, status: e.status === 'pending' ? 'investigating' : e.status === 'investigating' ? 'resolved' : 'pending' } : e));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this escalation?')) {
      setEscalations(escalations.filter(e => e.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📢 Issue Escalations</h1>
          <p>Manage escalated issues and priority complaints.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> New Escalation
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Escalation</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Severity</label>
              <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Issue Description</label>
              <textarea value={formData.issue} onChange={(e) => setFormData({ ...formData, issue: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Assign To</label>
              <input type="text" placeholder="Technical Team" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAdd}>{editingId ? 'Update' : 'Create'} Escalation</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Submitted By</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {escalations.map(escalation => (
              <tr key={escalation.id}>
                <td className="font-semibold">{escalation.title}</td>
                <td>{escalation.submittedBy}</td>
                <td><span className={`status-badge status-${escalation.severity}`}>{escalation.severity}</span></td>
                <td><span className={`status-badge status-${escalation.status}`}>{escalation.status}</span></td>
                <td>{escalation.assignedTo}</td>
                <td>{escalation.date}</td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(escalation)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => toggleStatus(escalation.id)}><FiCheck /></button>
                  <button className="btn-sm" onClick={() => handleDelete(escalation.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}