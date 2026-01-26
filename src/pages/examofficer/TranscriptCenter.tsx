import React, { useState, useEffect } from 'react';
import { FiDownload, FiRefreshCw, FiMail, FiCheck } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface TranscriptRequest {
  id: string;
  studentName: string;
  matricNo: string;
  requestDate: string;
  status: 'pending' | 'generated' | 'sent' | 'completed';
  generatedDate?: string;
}

export default function TranscriptCenter() {
  const [transcripts, setTranscripts] = useState<TranscriptRequest[]>([]);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/examofficer/${user.id}/transcripts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTranscripts(data);
        }
      } catch (error) {
        console.error('Error fetching transcripts:', error);
      }
    };

    fetchTranscripts();
  }, []);

  const handleGenerate = (id: string) => {
    setTranscripts(transcripts.map(t =>
      t.id === id
        ? { ...t, status: 'generated' as const, generatedDate: new Date().toISOString().split('T')[0] }
        : t
    ));
    alert('✅ Transcript generated successfully!');
  };

  const handleSend = (id: string) => {
    setTranscripts(transcripts.map(t =>
      t.id === id ? { ...t, status: 'sent' as const } : t
    ));
    alert('📧 Transcript sent to student email!');
  };

  const handleComplete = (id: string) => {
    setTranscripts(transcripts.map(t =>
      t.id === id ? { ...t, status: 'completed' as const } : t
    ));
    alert('✅ Transcript marked as completed!');
  };

  const handleDownload = (id: string) => {
    alert('Downloading transcript for request ID: ' + id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F97316';
      case 'generated': return '#3B82F6';
      case 'sent': return '#8B5CF6';
      case 'completed': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const pendingCount = transcripts.filter(t => t.status === 'pending').length;
  const generatedCount = transcripts.filter(t => t.status === 'generated').length;
  const sentCount = transcripts.filter(t => t.status === 'sent').length;
  const completedCount = transcripts.filter(t => t.status === 'completed').length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📜 Transcript Center</h1>
          <p>Generate and manage student academic transcripts and certificates.</p>
        </div>
        <button className="btn-primary">Generate Batch Transcripts</button>
      </div>

      {/* Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div className="metric-card" style={{ borderLeftColor: '#F97316' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Pending</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{pendingCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#3B82F6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Generated</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{generatedCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#8B5CF6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Sent</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{sentCount}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Completed</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{completedCount}</p>
        </div>
      </div>

      {/* Transcripts Table */}
      <div className="form-card">
        <h3 style={{ marginTop: 0 }}>Transcript Requests</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Student Name</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Matric No</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Request Date</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transcripts.map(transcript => (
              <tr key={transcript.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem' }}>{transcript.studentName}</td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#666' }}>{transcript.matricNo}</td>
                <td style={{ padding: '1rem', color: '#666' }}>{transcript.requestDate}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    background: getStatusColor(transcript.status) + '20',
                    color: getStatusColor(transcript.status),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}>
                    {transcript.status.charAt(0).toUpperCase() + transcript.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {transcript.status === 'pending' && (
                      <button
                        onClick={() => handleGenerate(transcript.id)}
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
                        <FiRefreshCw size={14} /> Generate
                      </button>
                    )}
                    {(transcript.status === 'generated' || transcript.status === 'sent') && (
                      <>
                        <button
                          onClick={() => handleDownload(transcript.id)}
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
                          <FiDownload size={14} />
                        </button>
                        {transcript.status === 'generated' && (
                          <button
                            onClick={() => handleSend(transcript.id)}
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
                            <FiMail size={14} /> Send
                          </button>
                        )}
                        {transcript.status === 'sent' && (
                          <button
                            onClick={() => handleComplete(transcript.id)}
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
                            <FiCheck size={14} /> Complete
                          </button>
                        )}
                      </>
                    )}
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
