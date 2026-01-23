import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiDownload } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface Course {
  id: string;
  code: string;
  name: string;
  students: number;
  status: 'draft' | 'submitted' | 'returned';
  submissionDate?: string;
  deadline: string;
}

export default function LecturerDashboard() {
  const [courses] = useState<Course[]>([
    {
      id: '1',
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      students: 120,
      status: 'submitted',
      submissionDate: '2024-01-20',
      deadline: '2024-01-25',
    },
    {
      id: '2',
      code: 'CS302',
      name: 'Web Development',
      students: 95,
      status: 'submitted',
      submissionDate: '2024-01-22',
      deadline: '2024-01-25',
    },
    {
      id: '3',
      code: 'CS401',
      name: 'Machine Learning',
      students: 60,
      status: 'draft',
      deadline: '2024-01-25',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FiCheckCircle color="#4CAF50" />;
      case 'returned':
        return <FiAlertCircle color="#F44336" />;
      default:
        return <FiClock color="#FF9800" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#4CAF50';
      case 'returned':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🧑‍🏫 Lecturer Dashboard</h1>
          <p>Submit and track course results</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Assigned Courses</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{courses.length}</h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Total Students</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {courses.reduce((sum, c) => sum + c.students, 0)}
          </h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Submitted</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
            {courses.filter(c => c.status === 'submitted').length}
          </h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Drafts</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>
            {courses.filter(c => c.status === 'draft').length}
          </h2>
        </div>
      </div>

      {/* Courses List */}
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>📚 My Courses</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {courses.map(course => (
            <div key={course.id} className="status-card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    {getStatusIcon(course.status)}
                    <h3>{course.name}</h3>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    {course.code} | {course.students} students
                  </p>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>
                    Deadline: {course.deadline}
                    {course.submissionDate && ` | Submitted: ${course.submissionDate}`}
                  </p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: getStatusColor(course.status),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {course.status.toUpperCase()}
                  </span>
                  {course.status === 'draft' && (
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Enter Results
                    </button>
                  )}
                  {course.status === 'returned' && (
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#F44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      View Feedback
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button className="btn-primary">Enter Results</button>
          <button className="btn-primary">Upload Excel</button>
          <button className="btn-primary">View Drafts</button>
          <button className="btn-primary">View Analytics</button>
        </div>
      </div>
    </div>
  );
}
