import React, { useState } from 'react';
import { FiToggle2, FiSettings } from 'react-icons/fi';
import './AdminPages.css';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  lastSync: string;
  description: string;
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'Email Service', type: 'SMTP', status: 'active', lastSync: '2024-01-23 10:30 AM', description: 'Send system emails and notifications' },
    { id: '2', name: 'SMS Gateway', type: 'Twilio', status: 'inactive', lastSync: '2024-01-20', description: 'Send SMS notifications to users' },
    { id: '3', name: 'LMS Integration', type: 'Moodle', status: 'active', lastSync: '2024-01-23 09:15 AM', description: 'Sync with Learning Management System' },
    { id: '4', name: 'Payment Gateway', type: 'Stripe', status: 'active', lastSync: '2024-01-23 11:00 AM', description: 'Process tuition and fee payments' },
  ]);

  const toggleStatus = (id: string) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🔗 External Integrations</h1>
          <p>Manage integrations with external systems and services.</p>
        </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {integrations.map(integration => (
          <div key={integration.id} className="form-card" style={{ borderLeft: `4px solid ${integration.status === 'active' ? '#28a745' : '#dc3545'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{integration.name}</h3>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>{integration.type}</p>
              </div>
              <span className={`status-badge status-${integration.status}`}>{integration.status}</span>
            </div>
            <p style={{ color: '#555', fontSize: '0.95em', marginBottom: '15px' }}>{integration.description}</p>
            <div style={{ fontSize: '0.85em', color: '#999', marginBottom: '15px' }}>Last Sync: {integration.lastSync}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-sm" onClick={() => toggleStatus(integration.id)} style={{ flex: 1 }}>
                {integration.status === 'active' ? 'Disable' : 'Enable'}
              </button>
              <button className="btn-sm" style={{ flex: 1 }}>Configure</button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-card">
        <h3>Available Integration Services</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {[
            { name: 'Email', icon: '📧' },
            { name: 'SMS', icon: '📱' },
            { name: 'LMS', icon: '🎓' },
            { name: 'Payments', icon: '💳' },
            { name: 'Calendar', icon: '📅' },
            { name: 'Analytics', icon: '📊' },
          ].map((service, idx) => (
            <div key={idx} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>{service.icon}</div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{service.name}</div>
              <button className="btn-sm">Add Integration</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
