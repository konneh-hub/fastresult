import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface DepartmentMetric {
  label: string;
  value: number | string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

interface CourseSubmission {
  courseCode: string;
  courseName: string;
  lecturer: string;
  status: 'submitted' | 'pending' | 'returned';
  students: number;
  submissionDate?: string;
}

export default function HODDashboard() {
  const [departmentName] = useState('Computer Science Department');

  const metrics: DepartmentMetric[] = [
    {
      label: 'Pass Rate',
      value: '92%',
      change: '+3% from last semester',
      icon: <FiCheckCircle size={28} />,
      color: '#4CAF50',
    },
    {
      label: 'Average GPA',
      value: '3.68',
      change: '+0.25 points',
      icon: <FiTrendingUp size={28} />,
      color: '#2196F3',
    },
    {
      label: 'Pending Submissions',
      value: '3',
      change: '2 overdue',
      icon: <FiClock size={28} />,
      color: '#FF9800',
    },
    {
      label: 'Problem Areas',
      value: '1',
      change: 'Abnormal grading detected',
      icon: <FiAlertTriangle size={28} />,
      color: '#F44336',
    },
  ];

  const submissions: CourseSubmission[] = [
    {
      courseCode: 'CS301',
      courseName: 'Data Structures',
      lecturer: 'Dr. John Smith',
      status: 'submitted',
      students: 120,
      submissionDate: '2024-01-20',
    },
    {
      courseCode: 'CS302',
      courseName: 'Web Development',
      lecturer: 'Prof. Jane Doe',
      status: 'submitted',
      students: 95,
      submissionDate: '2024-01-22',
    },
    {
      courseCode: 'CS401',
      courseName: 'Machine Learning',
      lecturer: 'Dr. Ahmed Hassan',
      status: 'pending',
      students: 60,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'returned':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🏢 Department Dashboard</h1>
          <p>Department-level academic control and monitoring</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card" style={{ borderLeftColor: metric.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>{metric.label}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{metric.value}</h2>
                {metric.change && <p style={{ color: '#999', fontSize: '0.85rem' }}>{metric.change}</p>}
              </div>
              <div style={{ color: metric.color, opacity: 0.7 }}>{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Lecturer Submissions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📋 Lecturer Result Submissions</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {submissions.map((submission, idx) => (
            <div key={idx} className="status-card" style={{ borderLeft: `4px solid ${getStatusColor(submission.status)}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>
                    {submission.courseCode} - {submission.courseName}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    Lecturer: {submission.lecturer} | Students: {submission.students}
                  </p>
                  {submission.submissionDate && (
                    <p style={{ color: '#999', fontSize: '0.85rem' }}>
                      Submitted: {submission.submissionDate}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: getStatusColor(submission.status),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {submission.status.toUpperCase()}
                  </span>
                  {submission.status === 'pending' && (
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Send Reminder
                    </button>
                  )}
                  {submission.status === 'submitted' && (
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button className="btn-primary">View All Students</button>
          <button className="btn-primary">Manage Lecturers</button>
          <button className="btn-primary">Assign Courses</button>
          <button className="btn-primary">View Reports</button>
        </div>
      </div>
    </div>
  );
}
