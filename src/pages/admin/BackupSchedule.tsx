import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiPlay, FiPause } from 'react-icons/fi';
import './AdminPages.css';

interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  lastRun?: string;
  status: 'active' | 'paused';
  retentionDays: number;
}

export default function BackupSchedule() {
  const [schedules, setSchedules] = useState<BackupSchedule[]>([
    { id: '1', name: 'Daily Database Backup', frequency: 'daily', time: '02:00', lastRun: '2024-01-23 02:15', status: 'active', retentionDays: 30 },
    { id: '2', name: 'Weekly Full Backup', frequency: 'weekly', time: '03:00', lastRun: '2024-01-21 03:30', status: 'active', retentionDays: 90 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', frequency: 'daily' as const, time: '02:00', retentionDays: 30 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSchedule = () => {
    if (!formData.name) {
      alert('Please enter schedule name');
      return;
    }
    if (editingId) {
      setSchedules(schedules.map(s => s.id === editingId ? { ...s, ...formData } : s));
      setEditingId(null);
    } else {
      setSchedules([...schedules, { id: Date.now().toString(), ...formData, status: 'active' }]);
    }
    setFormData({ name: '', frequency: 'daily', time: '02:00', retentionDays: 30 });
    setShowForm(false);
  };

  const handleToggle = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this backup schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>⏰ Backup Schedule</h1>
          <p>Configure automatic backup schedules. Data is retained according to policy.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> Create Schedule
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Backup Schedule</h3>
          <div className="form-group">
            <label>Schedule Name</label>
            <input type="text" placeholder="Daily Database Backup" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Frequency</label>
              <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time (24-hour format)</label>
              <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Retention Days</label>
            <input type="number" min="1" value={formData.retentionDays} onChange={(e) => setFormData({...formData, retentionDays: parseInt(e.target.value)})} />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddSchedule}>{editingId ? 'Update' : 'Create'} Schedule</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', frequency: 'daily', time: '02:00', retentionDays: 30 }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Schedule Name</th>
              <th>Frequency</th>
              <th>Time</th>
              <th>Last Run</th>
              <th>Retention</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td className="font-semibold">{schedule.name}</td>
                <td>{schedule.frequency}</td>
                <td>{schedule.time}</td>
                <td>{schedule.lastRun || 'Never'}</td>
                <td>{schedule.retentionDays} days</td>
                <td><span className={`status-badge status-${schedule.status}`}>{schedule.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleToggle(schedule.id)}>
                    {schedule.status === 'active' ? <FiPause /> : <FiPlay />}
                  </button>
                  <button className="btn-sm" onClick={() => {
                    setFormData({ name: schedule.name, frequency: schedule.frequency, time: schedule.time, retentionDays: schedule.retentionDays });
                    setEditingId(schedule.id);
                    setShowForm(true);
                  }}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => handleDelete(schedule.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}