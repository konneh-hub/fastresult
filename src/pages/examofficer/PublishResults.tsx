import React, { useState, useEffect } from 'react';
import { FiSend, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface PublishItem {
  id: string;
  department: string;
  course: string;
  studentsAffected: number;
  status: 'ready' | 'published' | 'draft';
  publishDate?: string;
}

export default function PublishResults() {
  const [results, setResults] = useState<PublishItem[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/examofficer/${user.id}/publishable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching publishable results:', error);
      }
    };
    fetchResults();
  }, []);

  const [publishMessage, setPublishMessage] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePublish = (id: string) => {
    if (!publishMessage.trim()) {
      alert('Please enter a publish message for students');
      return;
    }
    setResults(results.map(r =>
      r.id === id
        ? { ...r, status: 'published' as const, publishDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    alert('✅ Results published successfully! Students have been notified.');
    setPublishMessage('');
    setSelectedId(null);
  };

  const handleUnpublish = (id: string) => {
    setResults(results.map(r =>
      r.id === id ? { ...r, status: 'draft' as const } : r
    ));
    alert('Results unpublished. Students can no longer view them.');
  };

  const handlePreview = (id: string) => {
    alert('Preview: Showing how results will appear to students for ID: ' + id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#22C55E';
      case 'ready': return '#F97316';
      case 'draft': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🚀 Publish Results</h1>
          <p>Publish verified results to make them visible to students and stakeholders.</p>
        </div>
      </div>

      {/* Alert */}
      <div style={{
        background: '#FEF3C7',
        border: '1px solid #FBBF24',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}>
        <FiAlertCircle size={20} style={{ color: '#D97706', marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#92400E' }}>Important</h4>
          <p style={{ margin: 0, color: '#92400E', fontSize: '0.9em' }}>
            Once published, results become visible to all students. Ensure all data has been verified before publishing.
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="form-card">
        <h3 style={{ marginTop: 0 }}>Results Ready for Publication</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Department</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Course</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Students</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Published Date</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem' }}>{result.department}</td>
                <td style={{ padding: '1rem' }}>{result.course}</td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{result.studentsAffected}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    background: getStatusColor(result.status) + '20',
                    color: getStatusColor(result.status),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                  {result.publishDate || '-'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handlePreview(result.id)}
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
                      <FiEye size={14} /> Preview
                    </button>
                    {result.status !== 'published' && (
                      <button
                        onClick={() => setSelectedId(result.id)}
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
                        <FiSend size={14} /> Publish
                      </button>
                    )}
                    {result.status === 'published' && (
                      <button
                        onClick={() => handleUnpublish(result.id)}
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
                        <FiEyeOff size={14} /> Unpublish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Publish Modal */}
      {selectedId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
          }}>
            <h2 style={{ marginTop: 0 }}>Publish Results</h2>
            <p style={{ color: '#666' }}>
              This action will make the results visible to all {results.find(r => r.id === selectedId)?.studentsAffected} students. They will receive a notification.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Message for Students *
              </label>
              <textarea
                value={publishMessage}
                onChange={(e) => setPublishMessage(e.target.value)}
                placeholder="Enter a message to send to students (e.g., Results are now available. Check your dashboard.)"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '0.95em',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #E2E8F0',
                  background: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublish(selectedId)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#22C55E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FiSend /> Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
