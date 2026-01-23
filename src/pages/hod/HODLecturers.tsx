import React, { useState } from 'react';
import { FiFilter, FiDownload } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface Lecturer {
  id: string;
  name: string;
  email: string;
  qualification: string;
  courses: string[];
  submissionStatus: 'submitted' | 'pending' | 'overdue';
  lastSubmission?: string;
}

export default function HODLecturers() {
  const [filterStatus, setFilterStatus] = useState('all');

  const [lecturers] = useState<Lecturer[]>([
    {
      id: '1',
      name: 'Prof. James Smith',
      email: 'james.smith@uni.edu',
      qualification: 'PhD Computer Science',
      courses: ['CS301', 'CS302', 'CS401'],
      submissionStatus: 'submitted',
      lastSubmission: '2024-01-20',
    },
    {
      id: '2',
      name: 'Dr. Jane Doe',
      email: 'jane.doe@uni.edu',
      qualification: 'MSc Information Systems',
      courses: ['CS205', 'CS305'],
      submissionStatus: 'pending',
    },
    {
      id: '3',
      name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@uni.edu',
      qualification: 'PhD Artificial Intelligence',
      courses: ['CS401', 'CS402'],
      submissionStatus: 'overdue',
    },
  ]);

  const filteredLecturers = filterStatus === 'all'
    ? lecturers
    : lecturers.filter(l => l.submissionStatus === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'overdue':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👨‍🏫 Lecturers</h1>
          <p>Manage department teaching staff and monitor submissions</p>
        </div>
        <button className="btn-primary">
          <FiDownload /> Export List
        </button>
      </div>

      {/* Filters */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FiFilter /> Filter by Submission Status
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="all"
              checked={filterStatus === 'all'}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <span>All Lecturers</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="submitted"
              checked={filterStatus === 'submitted'}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <span>Submitted</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="pending"
              checked={filterStatus === 'pending'}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <span>Pending</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="status"
              value="overdue"
              checked={filterStatus === 'overdue'}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <span>Overdue</span>
          </label>
        </div>
      </div>

      {/* Lecturers List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {filteredLecturers.map(lecturer => (
          <div key={lecturer.id} className="status-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{lecturer.name}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  {lecturer.email}
                </p>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Qualification: {lecturer.qualification}
                </p>
                <div>
                  <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Assigned Courses:</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {lecturer.courses.map(course => (
                      <span
                        key={course}
                        style={{
                          backgroundColor: '#f0f0f0',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: getStatusColor(lecturer.submissionStatus),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '0.5rem',
                  }}
                >
                  {lecturer.submissionStatus.toUpperCase()}
                </span>
                {lecturer.lastSubmission && (
                  <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                    Last: {lecturer.lastSubmission}
                  </p>
                )}
                {lecturer.submissionStatus === 'pending' && (
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginTop: '0.5rem',
                    }}
                  >
                    Send Reminder
                  </button>
                )}
                {lecturer.submissionStatus === 'overdue' && (
                  <button
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#F44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'block',
                      marginTop: '0.5rem',
                    }}
                  >
                    Urgent Follow-up
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLecturers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          No lecturers found with selected status.
        </div>
      )}
    </div>
  );
}
