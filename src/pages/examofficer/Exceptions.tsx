import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface Exception {
  id: string;
  type: string;
  student: string;
  course: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  date: string;
  status: 'open' | 'resolved' | 'escalated';
}

export default function Exceptions() {
  const [exceptions, setExceptions] = useState<Exception[]>([]);

  useEffect(() => {
    const fetchExceptions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/examofficer/${user.id}/exceptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setExceptions(data);
        }
      } catch (error) {
        console.error('Error fetching exceptions:', error);
      }
    };

    fetchExceptions();
  }, []);

  const handleResolve = (id: string) => {
    setExceptions(exceptions.map(e =>
      e.id === id ? { ...e, status: 'resolved' as const } : e
    ));
    alert('Exception resolved!');
  };

  const handleEscalate = (id: string) => {
    setExceptions(exceptions.map(e =>
      e.id === id ? { ...e, status: 'escalated' as const } : e
    ));
    alert('Exception escalated to management!');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#F97316';
      case 'resolved': return '#22C55E';
      case 'escalated': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const openCount = exceptions.filter(e => e.status === 'open').length;
  const resolvedCount = exceptions.filter(e => e.status === 'resolved').length;
  const escalatedCount = exceptions.filter(e => e.status === 'escalated').length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>⚠️ Exceptions & Issues</h1>
          <p>Manage and resolve result processing exceptions and anomalies.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div className="metric-card" style={{ borderLeftColor: '#F97316' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Open Issues</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#F97316' }}>{openCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Resolved</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#22C55E' }}>{resolvedCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#EF4444' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Escalated</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#EF4444' }}>{escalatedCount}</p>
        </div>
      </div>

      {/* Exceptions Table */}
      <div className="form-card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Student</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Course</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Message</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Severity</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map(exc => (
              <tr key={exc.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiAlertTriangle size={16} style={{ color: getSeverityColor(exc.severity) }} />
                    {exc.type}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{exc.student}</td>
                <td style={{ padding: '1rem' }}>{exc.course}</td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.9em' }}>{exc.message}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    background: getSeverityColor(exc.severity) + '20',
                    color: getSeverityColor(exc.severity),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}>
                    {exc.severity.charAt(0).toUpperCase() + exc.severity.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    background: getStatusColor(exc.status) + '20',
                    color: getStatusColor(exc.status),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}>
                    {exc.status.charAt(0).toUpperCase() + exc.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    {exc.status === 'open' && (
                      <>
                        <button
                          onClick={() => handleResolve(exc.id)}
                          style={{
                            background: '#22C55E',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FiCheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => handleEscalate(exc.id)}
                          style={{
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FiAlertTriangle size={14} />
                        </button>
                      </>
                    )}
                    <button
                      style={{
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FiMessageCircle size={14} /> Notes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
