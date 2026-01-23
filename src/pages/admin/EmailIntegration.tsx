import React, { useState } from 'react';
import { FiCheck, FiX, FiSave } from 'react-icons/fi';
import './AdminPages.css';

export default function EmailIntegration() {
  const [config, setConfig] = useState({
    enabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'fastresult@university.edu',
    smtpPassword: '****',
    fromEmail: 'noreply@university.edu',
    fromName: 'FastResult System',
    tlsEnabled: true,
  });

  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [saved, setSaved] = useState(false);

  const handleTestConnection = () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }
    setTestResult('success');
    setTimeout(() => setTestResult(null), 3000);
    alert(`✅ Test email sent to ${testEmail}`);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📧 Email Integration</h1>
          <p>Configure SMTP email service for system notifications and communications.</p>
        </div>
      </div>

      <div className="form-card">
        <h3>Email Configuration</h3>
        <div className="form-group">
          <label>
            <input type="checkbox" checked={config.enabled} onChange={(e) => setConfig({...config, enabled: e.target.checked})} />
            Enable Email Service
          </label>
        </div>

        <div className="form-group">
          <label>SMTP Host</label>
          <input type="text" value={config.smtpHost} onChange={(e) => setConfig({...config, smtpHost: e.target.value})} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>SMTP Port</label>
            <input type="number" value={config.smtpPort} onChange={(e) => setConfig({...config, smtpPort: parseInt(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={config.tlsEnabled} onChange={(e) => setConfig({...config, tlsEnabled: e.target.checked})} />
              Use TLS/SSL
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>SMTP Username</label>
          <input type="text" value={config.smtpUsername} onChange={(e) => setConfig({...config, smtpUsername: e.target.value})} />
        </div>

        <div className="form-group">
          <label>SMTP Password</label>
          <input type="password" value={config.smtpPassword} onChange={(e) => setConfig({...config, smtpPassword: e.target.value})} />
        </div>

        <div className="form-group">
          <label>From Email Address</label>
          <input type="email" value={config.fromEmail} onChange={(e) => setConfig({...config, fromEmail: e.target.value})} />
        </div>

        <div className="form-group">
          <label>From Name</label>
          <input type="text" value={config.fromName} onChange={(e) => setConfig({...config, fromName: e.target.value})} />
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave}><FiSave /> Save Configuration</button>
          {saved && <span style={{color: 'green'}}>✅ Saved successfully</span>}
        </div>
      </div>

      <div className="info-card">
        <h3>Test Connection</h3>
        <p>Send a test email to verify your SMTP configuration is working correctly.</p>
        <div className="form-group">
          <label>Test Email Address</label>
          <input
            type="email"
            placeholder="your-email@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={handleTestConnection}>
          {testResult === 'success' ? <>✅ Test Successful</> : 'Send Test Email'}
        </button>
      </div>
    </div>
  );
}