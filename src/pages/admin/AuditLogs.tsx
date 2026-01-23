import React, { useState } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import './AdminPages.css';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
  details: string;
}

export default function AuditLogs() {
  const [logs] = useState<AuditLog[]>([
    { id: '1', user: 'admin@university.edu', action: 'Create', resource: 'User Account', timestamp: '2024-01-23 14:30:22', ipAddress: '192.168.1.100', status: 'success', details: 'Created user john.doe@university.edu' },
    { id: '2', user: 'admin@university.edu', action: 'Update', resource: 'Role', timestamp: '2024-01-23 13:45:11', ipAddress: '192.168.1.100', status: 'success', details: 'Updated role for jane.smith@university.edu' },
    { id: '3', user: 'dean@university.edu', action: 'Failed Login', resource: 'Authentication', timestamp: '2024-01-23 12:20:03', ipAddress: '10.0.0.50', status: 'failed', details: 'Invalid password attempt' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.includes(searchTerm) || log.action.includes(searchTerm) || log.resource.includes(searchTerm);
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const handleExport = () => {
    const csv = 'User,Action,Resource,Timestamp,IP,Status,Details\n' + filteredLogs.map(l => `${l.user},${l.action},${l.resource},${l.timestamp},${l.ipAddress},${l.status},${l.details}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📋 Audit Logs</h1>
          <p>System activity logs. Read-only for compliance and security investigation.</p>
        </div>
        <button className="btn-primary" onClick={handleExport}>
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="filters-card">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by user, action, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="all">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
            <option value="Login">Login</option>
            <option value="Logout">Logout</option>
            <option value="Failed Login">Failed Login</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td style={{fontSize: '0.85rem'}}>{log.timestamp}</td>
                <td>{log.user}</td>
                <td className="font-semibold">{log.action}</td>
                <td>{log.resource}</td>
                <td style={{fontSize: '0.85rem'}}>{log.ipAddress}</td>
                <td><span className={`status-badge status-${log.status}`}>{log.status}</span></td>
                <td style={{fontSize: '0.9rem', color: '#666'}}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


