import React, { useState } from 'react';
import { FiDownload, FiTrash2, FiRefreshCw, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'failed' | 'in-progress';
  location: string;
}

export default function Backups() {
  const [backups, setBackups] = useState<Backup[]>([
    { id: '1', name: 'Full Backup Jan 23', date: '2024-01-23 02:00 AM', size: '2.5 GB', type: 'full', status: 'completed', location: 'Cloud Storage' },
    { id: '2', name: 'Incremental Jan 22', date: '2024-01-22 02:00 AM', size: '450 MB', type: 'incremental', status: 'completed', location: 'Cloud Storage' },
    { id: '3', name: 'Full Backup Jan 15', date: '2024-01-15 02:00 AM', size: '2.4 GB', type: 'full', status: 'completed', location: 'External Drive' },
  ]);

  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'daily',
    time: '02:00',
    retention: '30',
  });

  const handleCreateBackup = () => {
    const newBackup: Backup = {
      id: Date.now().toString(),
      name: `Full Backup ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleString(),
      size: '0 GB',
      type: 'full',
      status: 'in-progress',
      location: 'Cloud Storage',
    };
    setBackups([newBackup, ...backups]);
    alert('Backup process started...');
  };

  const handleDownload = (id: string) => {
    alert('Downloading backup...');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this backup?')) {
      setBackups(backups.filter(b => b.id !== id));
    }
  };

  const handleScheduleSave = () => {
    alert(`Backup scheduled ${scheduleForm.frequency} at ${scheduleForm.time}`);
    setShowSchedule(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>💾 Backups & Recovery</h1>
          <p>Manage system backups and data recovery options.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleCreateBackup}>
            <FiPlus /> Create Backup
          </button>
          <button className="btn-secondary" onClick={() => setShowSchedule(!showSchedule)}>
            <FiRefreshCw /> Schedule
          </button>
        </div>
      </div>

      {showSchedule && (
        <div className="form-card">
          <h3>Schedule Automated Backups</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Frequency</label>
              <select value={scheduleForm.frequency} onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time (24-hour)</label>
              <input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Retention Period (days)</label>
              <input type="number" value={scheduleForm.retention} onChange={(e) => setScheduleForm({ ...scheduleForm, retention: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleScheduleSave}>Save Schedule</button>
            <button className="btn-secondary" onClick={() => setShowSchedule(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="form-card">
        <h3>📊 Backup Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Total Backups</div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{backups.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Last Backup</div>
            <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{backups[0]?.date || 'None'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Total Size</div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>5.4 GB</div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Backup Name</th>
              <th>Date & Time</th>
              <th>Size</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.id}>
                <td className="font-semibold">{backup.name}</td>
                <td>{backup.date}</td>
                <td>{backup.size}</td>
                <td>{backup.type === 'full' ? '📦 Full' : '📝 Incremental'}</td>
                <td><span className={`status-badge status-${backup.status}`}>{backup.status}</span></td>
                <td>{backup.location}</td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleDownload(backup.id)}><FiDownload /></button>
                  <button className="btn-sm" onClick={() => handleDelete(backup.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
