import React, { useState } from 'react';
import { FiAlertTriangle, FiDownload } from 'react-icons/fi';
import './AdminPages.css';

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  status: 'successful' | 'failed' | 'pending';
}

export default function Restore() {
  const [backups] = useState<Backup[]>([
    { id: '1', name: 'Daily Backup 2024-01-23', date: '2024-01-23 02:15', size: '2.3 GB', status: 'successful' },
    { id: '2', name: 'Daily Backup 2024-01-22', date: '2024-01-22 02:15', size: '2.2 GB', status: 'successful' },
    { id: '3', name: 'Weekly Full Backup 2024-01-21', date: '2024-01-21 03:30', size: '5.8 GB', status: 'successful' },
  ]);

  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');

  const handleRestore = () => {
    if (!selectedBackup) {
      alert('Please select a backup first');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmRestore = () => {
    if (!password) {
      alert('Please enter your password to confirm');
      return;
    }
    alert('✅ Restore started. The system will restart. Do not close this window.');
    setShowConfirm(false);
    setPassword('');
    setSelectedBackup(null);
  };

  const selectedBackupData = backups.find(b => b.id === selectedBackup);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>♻️ Restore from Backup</h1>
          <p>Restore system data from previous backups. This action requires authentication.</p>
        </div>
      </div>

      <div className="alert alert-warning">
        <FiAlertTriangle /> <strong>Warning:</strong> Restoring from a backup will replace current data. All changes since the backup was created will be lost.
      </div>

      <div className="table-card">
        <h3>Available Backups</h3>
        <table>
          <thead>
            <tr>
              <th>Backup</th>
              <th>Date</th>
              <th>Size</th>
              <th>Status</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.id} className={selectedBackup === backup.id ? 'selected' : ''}>
                <td>{backup.name}</td>
                <td>{backup.date}</td>
                <td>{backup.size}</td>
                <td><span className={`status-badge status-${backup.status}`}>{backup.status}</span></td>
                <td>
                  <input
                    type="radio"
                    name="backup"
                    checked={selectedBackup === backup.id}
                    onChange={() => setSelectedBackup(backup.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBackupData && (
        <div className="info-card">
          <h3>Restore: {selectedBackupData.name}</h3>
          <p>Created: {selectedBackupData.date}</p>
          <p>Size: {selectedBackupData.size}</p>
          <button className="btn-primary" onClick={handleRestore}>
            <FiDownload /> Proceed with Restore
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>⚠️ Confirm Restore</h2>
            <p>You are about to restore the system from: <strong>{selectedBackupData?.name}</strong></p>
            <p>All current data will be replaced. This action cannot be undone.</p>
            <p>Enter your password to confirm:</p>
            <input
              type="password"
              placeholder="Your admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleConfirmRestore}>Yes, Restore</button>
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}