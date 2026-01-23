import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface CourseApproval {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  hodName: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'returned';
  students: number;
}

export default function DeanApprovals() {
  const [approvals, setApprovals] = useState<CourseApproval[]>([
    {
      id: '1',
      courseCode: 'CS301',
      courseName: 'Data Structures & Algorithms',
      department: 'Computer Science',
      hodName: 'Prof. James Smith',
      submittedDate: '2024-01-20',
      status: 'pending',
      students: 120,
    },
    {
      id: '2',
      courseCode: 'MATH401',
      courseName: 'Advanced Calculus',
      department: 'Mathematics',
      hodName: 'Dr. Sarah Johnson',
      submittedDate: '2024-01-18',
      status: 'pending',
      students: 85,
    },
    {
      id: '3',
      courseCode: 'PHYS201',
      courseName: 'Quantum Mechanics',
      department: 'Physics',
      hodName: 'Prof. Ahmed Ali',
      submittedDate: '2024-01-15',
      status: 'approved',
      students: 65,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  const handleApprove = (id: string) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    setSelectedId(null);
  };

  const handleReturn = (id: string) => {
    if (comments.trim()) {
      setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'returned' } : a));
      setSelectedId(null);
      setComments('');
    } else {
      alert('Please add comments before returning');
    }
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FiCheckCircle color="#4CAF50" />;
      case 'pending':
        return <FiClock color="#FF9800" />;
      case 'returned':
        return <FiAlertCircle color="#F44336" />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>✅ Result Approvals</h1>
          <p>Review and approve results from HODs</p>
        </div>
      </div>

      {/* Approval Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Pending Approvals</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>{pendingApprovals.length}</h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Total Approved</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{approvals.filter(a => a.status === 'approved').length}</h2>
        </div>
      </div>

      {/* Pending Approvals */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>⏳ Pending Approvals</h2>
        {pendingApprovals.map(approval => (
          <div key={approval.id} className="approval-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3>{approval.courseName}</h3>
                  <span style={{ backgroundColor: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {approval.courseCode}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Department: {approval.department} | HOD: {approval.hodName}
                </p>
                <p style={{ color: '#999', fontSize: '0.85rem' }}>
                  Submitted: {approval.submittedDate} | Students: {approval.students}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  className="btn-primary"
                  onClick={() => setSelectedId(selectedId === approval.id ? null : approval.id)}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Review
                </button>
              </div>
            </div>

            {selectedId === approval.id && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <div className="form-group">
                  <label>Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments or reasons for return..."
                    style={{ padding: '0.75rem', minHeight: '100px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    className="btn-primary"
                    style={{ backgroundColor: '#4CAF50' }}
                    onClick={() => {
                      handleApprove(approval.id);
                      alert('Results approved and forwarded to Exam Officer');
                    }}
                  >
                    Approve Results
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      handleReturn(approval.id);
                      alert('Results returned to HOD');
                    }}
                  >
                    Return to HOD
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* All Approvals Summary */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>📋 All Approvals Summary</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Department</th>
              <th>HOD</th>
              <th>Students</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map(approval => (
              <tr key={approval.id}>
                <td>
                  <strong>{approval.courseName}</strong>
                  <br />
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>{approval.courseCode}</span>
                </td>
                <td>{approval.department}</td>
                <td>{approval.hodName}</td>
                <td>{approval.students}</td>
                <td>{approval.submittedDate}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(approval.status)}
                    <span className={`badge badge-${approval.status === 'approved' ? 'success' : approval.status === 'pending' ? 'warning' : 'danger'}`}>
                      {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                    </span>
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
