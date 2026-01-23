import React, { useState } from 'react';
import { FiCheckCircle, FiClock, FiAlertCircle, FiSearch, FiChevronRight } from 'react-icons/fi';
import './AdminPages.css';

interface Ticket {
  id: string;
  subject: string;
  reporter: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdDate: string;
  assignedTo?: string;
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', subject: 'Cannot login to system', reporter: 'john@university.edu', issue: 'Account locked after password reset', priority: 'high', status: 'open', createdDate: '2024-01-23' },
    { id: '2', subject: 'Missing grades', reporter: 'jane@university.edu', issue: 'Result submission not reflected', priority: 'critical', status: 'in-progress', createdDate: '2024-01-20', assignedTo: 'admin' },
    { id: '3', subject: 'PDF generation error', reporter: 'mark@university.edu', issue: 'Cannot generate transcript PDF', priority: 'medium', status: 'resolved', createdDate: '2024-01-15' },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  const handleStatusChange = (id: string, newStatus: Ticket['status']) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAssign = (id: string) => {
    const newAssignee = prompt('Assign to (email):');
    if (newAssignee) {
      setTickets(tickets.map(t => t.id === id ? { ...t, assignedTo: newAssignee } : t));
    }
  };

  const handleResolve = (id: string) => {
    if (resolution.trim()) {
      handleStatusChange(id, 'resolved');
      alert('✅ Ticket resolved. Resolution notes recorded.');
      setSelectedTicket(null);
      setResolution('');
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesSearch = t.subject.includes(searchTerm) || t.reporter.includes(searchTerm);
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = { low: '#4CAF50', medium: '#FF9800', high: '#FF5722', critical: '#F44336' };
    return colors[priority] || '#999';
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🎫 Support Tickets</h1>
          <p>Manage system and account issues reported by users.</p>
        </div>
      </div>

      <div className="filters-card">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Reporter</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td className="font-semibold">{ticket.subject}</td>
                <td>{ticket.reporter}</td>
                <td><span style={{color: getPriorityColor(ticket.priority), fontWeight: 'bold'}}>{ticket.priority}</span></td>
                <td><span className={`status-badge status-${ticket.status}`}>{ticket.status}</span></td>
                <td>{ticket.assignedTo || '—'}</td>
                <td>{new Date(ticket.createdDate).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => setSelectedTicket(ticket.id)}><FiChevronRight /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{tickets.find(t => t.id === selectedTicket)?.subject}</h2>
              <button onClick={() => setSelectedTicket(null)}>✕</button>
            </div>
            {tickets.find(t => t.id === selectedTicket) && (
              <div className="modal-body">
                <p><strong>Reporter:</strong> {tickets.find(t => t.id === selectedTicket)?.reporter}</p>
                <p><strong>Issue:</strong> {tickets.find(t => t.id === selectedTicket)?.issue}</p>
                <p><strong>Priority:</strong> <span style={{color: getPriorityColor(tickets.find(t => t.id === selectedTicket)?.priority || '')}}>{tickets.find(t => t.id === selectedTicket)?.priority}</span></p>
                <p><strong>Status:</strong> {tickets.find(t => t.id === selectedTicket)?.status}</p>
                <div className="form-group">
                  <label>Resolution Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Enter resolution notes..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => handleResolve(selectedTicket)}>Mark as Resolved</button>
                  <button className="btn-secondary" onClick={() => setSelectedTicket(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}