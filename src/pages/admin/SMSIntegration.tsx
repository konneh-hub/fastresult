import React, { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import './AdminPages.css';

interface SMSConfig {
  provider: 'twilio' | 'aws' | 'nexmo';
  apiKey: string;
  apiSecret: string;
  senderPhone: string;
  enabled: boolean;
  dailyLimit: number;
}

export default function SMSIntegration() {
  const [config, setConfig] = useState<SMSConfig>({
    provider: 'twilio',
    apiKey: 'AC1234567890abcdef',
    apiSecret: '****',
    senderPhone: '+1234567890',
    enabled: false,
    dailyLimit: 1000,
  });

  const [tempConfig, setTempConfig] = useState<SMSConfig>(config);
  const [isEditing, setIsEditing] = useState(false);
  const [testPhone, setTestPhone] = useState('');

  const handleSave = () => {
    setConfig(tempConfig);
    setIsEditing(false);
    alert('SMS Integration settings saved successfully!');
  };

  const handleCancel = () => {
    setTempConfig(config);
    setIsEditing(false);
  };

  const handleTestSMS = () => {
    if (!testPhone) {
      alert('Please enter a phone number');
      return;
    }
    alert(`Test SMS sent to ${testPhone}`);
  };

  const handleToggle = () => {
    setTempConfig({ ...tempConfig, enabled: !tempConfig.enabled });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📱 SMS Integration</h1>
          <p>Configure SMS service integration for notifications.</p>
        </div>
        {!isEditing && <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Settings</button>}
      </div>

      <div className="form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Service Configuration</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9em', color: '#666' }}>Status:</span>
            <span className={`status-badge status-${tempConfig.enabled ? 'active' : 'inactive'}`}>
              {tempConfig.enabled ? 'Enabled' : 'Disabled'}
            </span>
            {isEditing && (
              <button className="btn-sm" onClick={handleToggle}>
                {tempConfig.enabled ? 'Disable' : 'Enable'}
              </button>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>SMS Provider</label>
            <select
              disabled={!isEditing}
              value={tempConfig.provider}
              onChange={(e) => setTempConfig({ ...tempConfig, provider: e.target.value as any })}
            >
              <option value="twilio">Twilio</option>
              <option value="aws">AWS SNS</option>
              <option value="nexmo">Nexmo</option>
            </select>
          </div>
          <div className="form-group">
            <label>API Key</label>
            <input
              disabled={!isEditing}
              type="text"
              value={tempConfig.apiKey}
              onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>API Secret</label>
            <input
              disabled={!isEditing}
              type="password"
              value={tempConfig.apiSecret}
              onChange={(e) => setTempConfig({ ...tempConfig, apiSecret: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Sender Phone</label>
            <input
              disabled={!isEditing}
              type="tel"
              value={tempConfig.senderPhone}
              onChange={(e) => setTempConfig({ ...tempConfig, senderPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Daily SMS Limit</label>
            <input
              disabled={!isEditing}
              type="number"
              value={tempConfig.dailyLimit}
              onChange={(e) => setTempConfig({ ...tempConfig, dailyLimit: parseInt(e.target.value) })}
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
        <h3>Test SMS Service</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Send a test SMS to verify your configuration is working properly.</p>
        <div className="form-row" style={{ alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleTestSMS}><FiRefreshCw /> Send Test SMS</button>
        </div>
      </div>

      <div className="form-card">
        <h3>📊 SMS Usage Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Today's Count</div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>147</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Monthly Total</div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>8,450</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Remaining Today</div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#28a745' }}>853</div>
          </div>
        </div>
      </div>
    </div>
  );
}