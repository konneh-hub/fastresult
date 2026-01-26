import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiLock, FiArchive, FiUnlock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface LockLog {
  id: string;
  timestamp: string;
  action: 'locked' | 'unlock_requested' | 'reopened';
  requestedBy: string;
  approvedBy?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AcademicSession {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'archived' | 'locked' | 'results_published';
  resultsPublished: boolean;
  lockedAt?: string;
  lockLogs: LockLog[];
}

export default function AcademicSessions() {
  const [sessions, setSessions] = useState<AcademicSession[]>([
    { id: '1', year: '2024/2025', startDate: '2024-09-01', endDate: '2025-08-31', status: 'results_published', resultsPublished: true, lockedAt: '2025-01-15', lockLogs: [
      { id: 'log1', timestamp: '2025-01-15 14:30', action: 'locked', requestedBy: 'Admin', reason: 'Results published and locked', status: 'approved' }
    ]},
    { id: '2', year: '2023/2024', startDate: '2023-09-01', endDate: '2024-08-31', status: 'archived', resultsPublished: true, lockedAt: '2024-01-15', lockLogs: [] },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ year: '', startDate: '', endDate: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLockDetails, setShowLockDetails] = useState<string | null>(null);
  const [showUnlockRequest, setShowUnlockRequest] = useState<string | null>(null);
  const [unlockReason, setUnlockReason] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleAddSession = () => {
    if (!formData.year || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }
    if (editingId) {
      setSessions(sessions.map(s => s.id === editingId ? { ...s, year: formData.year, startDate: formData.startDate, endDate: formData.endDate } : s));
      setEditingId(null);
    } else {
      setSessions([...sessions, { 
        id: Date.now().toString(), 
        year: formData.year, 
        startDate: formData.startDate, 
        endDate: formData.endDate, 
        status: 'active',
        resultsPublished: false,
        lockLogs: []
      }]);
    }
    setFormData({ year: '', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const handleEdit = (session: AcademicSession) => {
    setFormData({ year: session.year, startDate: session.startDate, endDate: session.endDate });
    setEditingId(session.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  // Hard lock after results published
  const handlePublishResults = (id: string) => {
    setSessions(sessions.map(s => {
      if (s.id === id && !s.resultsPublished) {
        const newLog: LockLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: 'locked',
          requestedBy: currentUser.name || 'Admin',
          reason: 'Results published - Hard lock applied',
          status: 'approved'
        };
        return { 
          ...s, 
          resultsPublished: true, 
          status: 'results_published',
          lockedAt: new Date().toISOString(),
          lockLogs: [...s.lockLogs, newLog]
        };
      }
      return s;
    }));
  };

  // Request to re-open (unlock)
  const handleRequestReopen = (id: string) => {
    if (!unlockReason.trim()) {
      alert('Please provide a reason for re-opening');
      return;
    }
    
    setSessions(sessions.map(s => {
      if (s.id === id) {
        const newLog: LockLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: 'unlock_requested',
          requestedBy: currentUser.name || 'Exam Officer',
          reason: unlockReason,
          status: 'pending'
        };
        return { 
          ...s, 
          lockLogs: [...s.lockLogs, newLog]
        };
      }
      return s;
    }));
    
    setUnlockReason('');
    setShowUnlockRequest(null);
    alert('✅ Re-open request submitted. Awaiting Dean approval.');
  };

  // Dean approval to re-open
  const handleApproveReopen = (sessionId: string, logId: string) => {
    setSessions(sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          lockLogs: s.lockLogs.map(log => {
            if (log.id === logId) {
              return {
                ...log,
                status: 'approved',
                approvedBy: currentUser.name || 'Dean'
              };
            }
            return log;
          }),
          status: 'active',
          resultsPublished: false
        };
      }
      return s;
    }));
    alert('✅ Results reopened. Exams can now be modified.');
  };

  // Reject re-open request
  const handleRejectReopen = (sessionId: string, logId: string) => {
    setSessions(sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          lockLogs: s.lockLogs.map(log => {
            if (log.id === logId) {
              return {
                ...log,
                status: 'rejected',
                approvedBy: currentUser.name || 'Dean'
              };
            }
            return log;
          })
        };
      }
      return s;
    }));
    alert('❌ Re-open request rejected. Results remain locked.');
  };

  const handleArchive = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session?.status === 'results_published') {
      alert('⚠️ Cannot archive a session with published results. You must re-open and unpublish first.');
      return;
    }
    setSessions(sessions.map(s => s.id === id ? { ...s, status: 'archived' } : s));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📅 Academic Sessions</h1>
          <p>Manage academic years with secure result lock & re-open workflow for credibility protection.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> Create Session
        </button>
      </div>

      {/* Security Info Box */}
      <div style={{
        background: '#FEF3C7',
        border: '2px solid #F59E0B',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <FiAlertCircle size={24} style={{ color: '#D97706', flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400E' }}>🔐 Result Lock Security</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#78350F' }}>
            ✅ Results are <strong>hard locked</strong> after publishing to prevent silent grade manipulation
          </p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#78350F' }}>
            ✅ Re-open requires <strong>Exam Officer request + Dean approval</strong> with logged reasons
          </p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#78350F' }}>
            ✅ Complete audit trail maintained for all lock/unlock actions
          </p>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Academic Session</h3>
          <div className="form-group">
            <label>Academic Year (e.g., 2024/2025)</label>
            <input type="text" placeholder="2024/2025" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddSession}>{editingId ? 'Update' : 'Create'} Session</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ year: '', startDate: '', endDate: '' }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Lock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <React.Fragment key={session.id}>
                <tr>
                  <td className="font-semibold">{session.year}</td>
                  <td>{new Date(session.startDate).toLocaleDateString()}</td>
                  <td>{new Date(session.endDate).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${session.status}`}>{session.status.replace('_', ' ')}</span></td>
                  <td>
                    {session.resultsPublished ? (
                      <span style={{ color: '#DC2626', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiLock size={16} /> Hard Locked
                      </span>
                    ) : (
                      <span style={{ color: '#059669', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiUnlock size={16} /> Unlocked
                      </span>
                    )}
                  </td>
                  <td className="action-buttons">
                    {!session.resultsPublished && (
                      <>
                        <button className="btn-sm" onClick={() => handleEdit(session)} title="Edit Session"><FiEdit /></button>
                        <button className="btn-sm" onClick={() => handlePublishResults(session.id)} style={{ background: '#DC2626', color: 'white' }} title="Publish & Lock Results">📊 Publish</button>
                        <button className="btn-sm" onClick={() => handleArchive(session.id)} title="Archive Session"><FiArchive /></button>
                      </>
                    )}
                    {session.resultsPublished && (
                      <>
                        <button className="btn-sm" onClick={() => setShowLockDetails(session.id)} style={{ background: '#2563EB', color: 'white' }} title="View Lock Details">🔒 Details</button>
                        <button className="btn-sm" onClick={() => setShowUnlockRequest(session.id)} style={{ background: '#F59E0B', color: 'white' }} title="Request to Re-open">🔓 Reopen</button>
                      </>
                    )}
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(session.id)} title="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lock Details Modal */}
      {showLockDetails && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <h2 style={{ marginTop: 0, color: '#1F2937' }}>🔐 Result Lock & Re-open Audit Trail</h2>
            
            {sessions.find(s => s.id === showLockDetails)?.lockLogs.map((log, idx) => (
              <div key={log.id} style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                background: log.status === 'pending' ? '#FEF3C7' : log.status === 'approved' ? '#DBEAFE' : '#FEE2E2'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {log.action === 'locked' && <FiLock size={20} style={{ color: '#DC2626' }} />}
                  {log.action === 'unlock_requested' && <FiAlertCircle size={20} style={{ color: '#F59E0B' }} />}
                  {log.action === 'reopened' && <FiCheckCircle size={20} style={{ color: '#059669' }} />}
                  <strong>{log.action === 'locked' ? '🔒 Results Locked' : log.action === 'unlock_requested' ? '🔓 Unlock Requested' : '✅ Results Reopened'}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>({log.timestamp})</span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                  <strong>Requested by:</strong> {log.requestedBy}
                </p>
                <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                  <strong>Reason:</strong> {log.reason}
                </p>
                {log.approvedBy && (
                  <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                    <strong>Approved/Rejected by:</strong> {log.approvedBy}
                  </p>
                )}
                <p style={{ margin: '0.5rem 0' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: log.status === 'pending' ? '#FCD34D' : log.status === 'approved' ? '#86EFAC' : '#FCA5A5',
                    color: log.status === 'pending' ? '#78350F' : log.status === 'approved' ? '#166534' : '#7F1D1D'
                  }}>
                    {log.status.toUpperCase()}
                  </span>
                </p>

                {/* Approval Buttons for Pending Requests */}
                {log.status === 'pending' && log.action === 'unlock_requested' && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleApproveReopen(showLockDetails, log.id)}
                      style={{
                        background: '#059669',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      ✅ Approve Re-open
                    </button>
                    <button
                      onClick={() => handleRejectReopen(showLockDetails, log.id)}
                      style={{
                        background: '#DC2626',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      ❌ Reject Request
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowLockDetails(null)}
              style={{
                background: '#6B7280',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                width: '100%'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Unlock Request Modal */}
      {showUnlockRequest && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            padding: '2rem'
          }}>
            <h2 style={{ marginTop: 0, color: '#1F2937' }}>🔓 Request to Re-open Results</h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Provide a reason for re-opening locked results. This will be submitted to the Dean for approval.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                Reason for Re-opening *
              </label>
              <textarea
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="e.g., Grade correction needed for students affected by system error..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: '#92400E'
            }}>
              ⚠️ <strong>Note:</strong> This request will be logged and requires Dean approval. A complete audit trail will be maintained.
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowUnlockRequest(null)}
                style={{
                  flex: 1,
                  background: '#E5E7EB',
                  color: '#374151',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestReopen(showUnlockRequest)}
                style={{
                  flex: 1,
                  background: '#F59E0B',
                  color: 'white',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}