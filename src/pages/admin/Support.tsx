import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import './AdminPages.css';

interface SupportTicket {
  id: string;
  title: string;
  submitter: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdDate: string;
  description: string;
}

export default function Support() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: '1', title: 'Password Reset Issue', submitter: 'john@student.edu', category: 'Account', priority: 'high', status: 'in-progress', createdDate: '2024-01-23', description: 'Unable to reset password' },
    { id: '2', title: 'Grade Discrepancy', submitter: 'jane@student.edu', category: 'Academic', priority: 'medium', status: 'open', createdDate: '2024-01-22', description: 'Grade showing different from expected' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    priority: 'medium' as const,
    description: '',
  });

  const handleAdd = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill required fields');
      return;
    }
    if (editingId) {
      setTickets(tickets.map(t => t.id === editingId ? { ...t, title: formData.title, category: formData.category, priority: formData.priority, description: formData.description } : t));
      setEditingId(null);
    } else {
      setTickets([...tickets, { id: Date.now().toString(), ...formData, submitter: 'admin@uni.edu', status: 'open', createdDate: new Date().toISOString().split('T')[0] }]);
    }
    setFormData({ title: '', category: 'Technical', priority: 'medium', description: '' });
    setShowForm(false);
  };

  const handleEdit = (ticket: SupportTicket) => {
    setFormData({ title: ticket.title, category: ticket.category, priority: ticket.priority, description: ticket.description });
    setEditingId(ticket.id);
    setShowForm(true);
  };

  const toggleStatus = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: t.status === 'open' ? 'in-progress' : t.status === 'in-progress' ? 'resolved' : 'open' } : t));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this ticket?')) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🎫 Support & Helpdesk</h1>
          <p>Manage user support tickets and assistance requests.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> New Ticket
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Support Ticket</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="Technical">Technical</option>
                <option value="Account">Account</option>
                <option value="Academic">Academic</option>
                <option value="Payment">Payment</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAdd}>{editingId ? 'Update' : 'Create'} Ticket</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Submitter</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="font-semibold">{ticket.title}</td>
                <td>{ticket.submitter}</td>
                <td>{ticket.category}</td>
                <td><span className={`status-badge status-${ticket.priority}`}>{ticket.priority}</span></td>
                <td><span className={`status-badge status-${ticket.status}`}>{ticket.status}</span></td>
                <td style={{ fontSize: '0.9em' }}>{ticket.createdDate}</td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(ticket)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => toggleStatus(ticket.id)}><FiCheck /></button>
                  <button className="btn-sm" onClick={() => handleDelete(ticket.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
