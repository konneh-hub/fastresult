import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiMail, FiCalendar } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  createdDate: string;
  status: 'draft' | 'ready' | 'distributed';
  recipientCount: number;
}

export default function SenateReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/examofficer/${user.id}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleDistribute = (id: string) => {
    setReports(reports.map(r =>
      r.id === id ? { ...r, status: 'distributed' as const, recipientCount: 45 } : r
    ));
    alert('✅ Report distributed to senate members!');
  };

  const handleDownload = (id: string) => {
    alert('Downloading report: ' + reports.find(r => r.id === id)?.title);
  };

  const handlePreview = (id: string) => {
    alert('Previewing report: ' + reports.find(r => r.id === id)?.title);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6B7280';
      case 'ready': return '#F97316';
      case 'distributed': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const draftCount = reports.filter(r => r.status === 'draft').length;
  const readyCount = reports.filter(r => r.status === 'ready').length;
  const distributedCount = reports.filter(r => r.status === 'distributed').length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📑 Senate Reports</h1>
          <p>Generate and distribute academic reports to senate and administration.</p>
        </div>
        <button className="btn-primary">Create New Report</button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div className="metric-card" style={{ borderLeftColor: '#6B7280' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Draft</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{draftCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#F97316' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Ready</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{readyCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Distributed</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{distributedCount}</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="form-card">
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Generated Reports</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Period</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Created</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Recipients</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{report.title}</td>
                <td style={{ padding: '1rem', color: '#666' }}>
                  <span style={{
                    background: '#F3F4F6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85em',
                  }}>
                    {report.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.9em' }}>{report.period}</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9em' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <FiCalendar size={14} /> {report.createdDate}
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    background: getStatusColor(report.status) + '20',
                    color: getStatusColor(report.status),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 500 }}>
                  {report.recipientCount > 0 ? (
                    <span style={{ color: '#22C55E' }}>{report.recipientCount}</span>
                  ) : (
                    <span style={{ color: '#999' }}>-</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handlePreview(report.id)}
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
                      <FiEye size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(report.id)}
                      style={{
                        background: '#8B5CF6',
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
                      <FiDownload size={14} />
                    </button>
                    {report.status !== 'distributed' && (
                      <button
                        onClick={() => handleDistribute(report.id)}
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
                        <FiMail size={14} /> Send
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Templates */}
      <div className="form-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Available Report Templates</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
        }}>
          {['Semester Summary', 'Faculty Analytics', 'Grade Distribution', 'Compliance Report', 'Student Performance', 'Course Analysis'].map((template, idx) => (
            <div
              key={idx}
              style={{
                padding: '15px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F9FAFB';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              <p style={{ margin: '0 0 10px 0', fontWeight: 600, fontSize: '0.95em' }}>{template}</p>
              <button
                style={{
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                  fontWeight: 500,
                }}
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
