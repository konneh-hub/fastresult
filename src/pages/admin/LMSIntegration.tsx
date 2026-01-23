import React, { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import './AdminPages.css';

interface LMSConfig {
  platform: 'moodle' | 'canvas' | 'blackboard';
  baseUrl: string;
  apiKey: string;
  enabled: boolean;
  autoSync: boolean;
  syncInterval: number;
  lastSync: string;
}

export default function LMSIntegration() {
  const [config, setConfig] = useState<LMSConfig>({
    platform: 'moodle',
    baseUrl: 'https://lms.university.edu',
    apiKey: 'key1234567890abcdef',
    enabled: false,
    autoSync: false,
    syncInterval: 6,
    lastSync: 'Never',
  });

  const [tempConfig, setTempConfig] = useState<LMSConfig>(config);
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    setConfig(tempConfig);
    setIsEditing(false);
    alert('LMS Integration settings saved successfully!');
  };

  const handleCancel = () => {
    setTempConfig(config);
    setIsEditing(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setConfig({ ...config, lastSync: new Date().toLocaleString() });
      setIsSyncing(false);
      alert('Sync completed successfully!');
    }, 2000);
  };

  const handleToggle = (field: 'enabled' | 'autoSync') => {
    if (field === 'enabled') {
      setTempConfig({ ...tempConfig, enabled: !tempConfig.enabled });
    } else {
      setTempConfig({ ...tempConfig, autoSync: !tempConfig.autoSync });
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🌐 LMS Integration</h1>
          <p>Configure Learning Management System integration for course data sync.</p>
        </div>
        {!isEditing && <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Settings</button>}
      </div>

      <div className="form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Platform Configuration</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9em', color: '#666' }}>Status:</span>
            <span className={`status-badge status-${tempConfig.enabled ? 'active' : 'inactive'}`}>
              {tempConfig.enabled ? 'Connected' : 'Disconnected'}
            </span>
            {isEditing && (
              <button className="btn-sm" onClick={() => handleToggle('enabled')}>
                {tempConfig.enabled ? 'Disconnect' : 'Connect'}
              </button>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>LMS Platform</label>
            <select
              disabled={!isEditing}
              value={tempConfig.platform}
              onChange={(e) => setTempConfig({ ...tempConfig, platform: e.target.value as any })}
            >
              <option value="moodle">Moodle</option>
              <option value="canvas">Canvas</option>
              <option value="blackboard">Blackboard</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Base URL</label>
            <input
              disabled={!isEditing}
              type="url"
              value={tempConfig.baseUrl}
              onChange={(e) => setTempConfig({ ...tempConfig, baseUrl: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>API Key</label>
            <input
              disabled={!isEditing}
              type="password"
              value={tempConfig.apiKey}
              onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Auto-Sync Enabled</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <input
                disabled={!isEditing}
                type="checkbox"
                checked={tempConfig.autoSync}
                onChange={() => handleToggle('autoSync')}
              />
              <span>{tempConfig.autoSync ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="form-group">
            <label>Sync Interval (hours)</label>
            <input
              disabled={!isEditing || !tempConfig.autoSync}
              type="number"
              min="1"
              max="24"
              value={tempConfig.syncInterval}
              onChange={(e) => setTempConfig({ ...tempConfig, syncInterval: parseInt(e.target.value) })}
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button className="btn-primary" onClick={handleSave}><FiSave /> Save Settings</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>

      <div className="form-card">
        <h3>Synchronization</h3>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9em', color: '#666' }}>Last Sync:</span>
            <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{config.lastSync}</div>
          </div>
          <button className="btn-primary" onClick={handleSync} disabled={isSyncing}>
            <FiRefreshCw /> {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      <div className="form-card">
        <h3>📋 Sync Data Types</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li>✓ Course Information</li>
          <li>✓ Student Enrollment Data</li>
          <li>✓ Course Materials</li>
          <li>✓ Assessment Data</li>
          <li>✓ Gradebook Updates</li>
        </ul>
      </div>
    </div>
  );
}