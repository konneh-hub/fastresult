import React, { useState, useEffect } from 'react';
import { FiEye, FiDownload, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface SubmittedResult {
  id: string;
  courseCode: string;
  courseName: string;
  studentCount: number;
  faculty: string;
  department: string;
  program: string;
  level: string;
  submissionDate: string;
  status: 'submitted' | 'returned';
  returnReason?: string;
  examOfficerNotes?: string;
  passRate: number;
}

export default function SubmittedReturned() {
  const [submissions, setSubmissions] = useState<SubmittedResult[]>([]);

  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'returned'>('all');

  // Load real submissions from backend
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch lecturer's submitted/returned results
        const response = await fetch(`http://localhost:5000/api/results/lecturer/${user.id}/submitted`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          setSubmissions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.log('Could not fetch submissions from backend.');
        setSubmissions([]);
      }
    };

    loadSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleDownload = (submission: SubmittedResult) => {
    const csv = `Course Code,Course Name,Faculty,Department,Program,Level,Student Count,Pass Rate,Submission Date,Status
${submission.courseCode},${submission.courseName},${submission.faculty},${submission.department},${submission.program},${submission.level},${submission.studentCount},${submission.passRate}%,${submission.submissionDate},${submission.status}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submission.courseCode}_Submission.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    returned: submissions.filter(s => s.status === 'returned').length
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>✅ Submitted & Returned Results</h1>
          <p>Track your result submissions and any returned submissions</p>
        </div>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card" style={{ borderLeftColor: '#3B82F6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Total Submissions</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Submitted</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#22C55E' }}>{stats.submitted}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#EF4444' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Returned</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#EF4444' }}>{stats.returned}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.75rem 1.5rem',
            background: filter === 'all' ? '#3B82F6' : 'transparent',
            color: filter === 'all' ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          style={{
            padding: '0.75rem 1.5rem',
            background: filter === 'submitted' ? '#22C55E' : 'transparent',
            color: filter === 'submitted' ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          Submitted ({stats.submitted})
        </button>
        <button
          onClick={() => setFilter('returned')}
          style={{
            padding: '0.75rem 1.5rem',
            background: filter === 'returned' ? '#EF4444' : 'transparent',
            color: filter === 'returned' ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          Returned ({stats.returned})
        </button>
      </div>

      {/* Submissions Table */}
      <div className="table-card">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Faculty/Department</th>
              <th>Program</th>
              <th>Level</th>
              <th>Students</th>
              <th>Pass Rate</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => (
              <tr key={submission.id} style={{
                background: submission.status === 'returned' ? '#FEF2F2' : 'transparent'
              }}>
                <td>
                  <div>
                    <strong>{submission.courseCode}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{submission.courseName}</div>
                  </div>
                </td>
                <td style={{ fontSize: '0.9rem' }}>
                  <div>{submission.faculty}</div>
                  <div style={{ color: '#666' }}>{submission.department}</div>
                </td>
                <td style={{ fontSize: '0.9rem' }}>{submission.program}</td>
                <td style={{ textAlign: 'center' }}>Level {submission.level}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{submission.studentCount}</td>
                <td>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: submission.passRate >= 90 ? '#D1FAE5' : submission.passRate >= 75 ? '#E0E7FF' : '#FEF2F2',
                      color: submission.passRate >= 90 ? '#047857' : submission.passRate >= 75 ? '#3730a3' : '#b91c1c'
                    }}>
                      {submission.passRate}%
                    </span>
                  </div>
                </td>
                <td>{new Date(submission.submissionDate).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: submission.status === 'submitted' ? '#D1FAE5' : '#FEE2E2',
                    color: submission.status === 'submitted' ? '#047857' : '#991b1b',
                    width: 'fit-content'
                  }}>
                    {submission.status === 'submitted' ? <FiCheckCircle /> : <FiAlertCircle />}
                    {submission.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowDetails(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#3B82F6',
                      fontSize: '1.2rem'
                    }}
                    title="View Details"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => handleDownload(submission)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#10B981',
                      fontSize: '1.2rem'
                    }}
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubmissions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748B',
          fontSize: '1.1rem'
        }}>
          📭 No {filter !== 'all' ? filter : ''} submissions found
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedSubmission && (
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
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>📋 Submission Details</h2>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: selectedSubmission.status === 'submitted' ? '#D1FAE5' : '#FEE2E2',
                color: selectedSubmission.status === 'submitted' ? '#047857' : '#991b1b'
              }}>
                {selectedSubmission.status === 'submitted' ? <FiCheckCircle /> : <FiAlertCircle />}
                {selectedSubmission.status}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p><strong>Course Code:</strong> {selectedSubmission.courseCode}</p>
              <p><strong>Course Name:</strong> {selectedSubmission.courseName}</p>
              <p><strong>Faculty:</strong> {selectedSubmission.faculty}</p>
              <p><strong>Department:</strong> {selectedSubmission.department}</p>
              <p><strong>Program:</strong> {selectedSubmission.program}</p>
              <p><strong>Level:</strong> {selectedSubmission.level}</p>
              <p><strong>Student Count:</strong> {selectedSubmission.studentCount}</p>
              <p><strong>Pass Rate:</strong> {selectedSubmission.passRate}%</p>
              <p><strong>Submission Date:</strong> {new Date(selectedSubmission.submissionDate).toLocaleDateString()}</p>
            </div>

            {selectedSubmission.status === 'returned' && (
              <div style={{
                background: '#FEF2F2',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                borderLeft: '4px solid #EF4444'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>⚠️ Reason for Return</h3>
                <p style={{ margin: 0, color: '#7f1d1d' }}>{selectedSubmission.returnReason}</p>
              </div>
            )}

            {selectedSubmission.examOfficerNotes && (
              <div style={{
                background: '#F0F9FF',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                borderLeft: '4px solid #3B82F6'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMessageSquare /> Exam Officer Notes
                </h3>
                <p style={{ margin: 0, color: '#1e3a8a' }}>{selectedSubmission.examOfficerNotes}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#E2E8F0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
