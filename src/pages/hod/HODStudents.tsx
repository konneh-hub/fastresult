import React, { useState } from 'react';
import { FiFilter, FiDownload } from 'react-icons/fi';
import '../admin/AdminPages.css';
import { ACADEMIC_LEVELS } from '../../config/constants';

interface Student {
  id: string;
  name: string;
  studentId: string;
  program: string;
  level: string;
  cgpa: number;
  status: 'active' | 'probation' | 'deferred';
  enrollmentDate: string;
}

export default function HODStudents() {
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      studentId: 'CS/2020/001',
      program: 'BSc Computer Science',
      level: '400 Level',
      cgpa: 3.68,
      status: 'active',
      enrollmentDate: '2020-09-01',
    },
    {
      id: '2',
      name: 'Zainab Mohammed',
      studentId: 'CS/2021/045',
      program: 'BSc Computer Science',
      level: '300 Level',
      cgpa: 1.8,
      status: 'probation',
      enrollmentDate: '2021-09-01',
    },
    {
      id: '3',
      name: 'Fatima Ali',
      studentId: 'CS/2020/032',
      program: 'BSc Information Systems',
      level: '400 Level',
      cgpa: 2.95,
      status: 'active',
      enrollmentDate: '2020-09-01',
    },
    {
      id: '4',
      name: 'Kamal Ibrahim',
      studentId: 'CS/2021/078',
      program: 'BSc Computer Science',
      level: '300 Level',
      cgpa: 3.2,
      status: 'deferred',
      enrollmentDate: '2021-09-01',
    },
  ]);

  const programs = ['All Programs', 'BSc Computer Science', 'BSc Information Systems'];
  const levels = ['All Levels', ...ACADEMIC_LEVELS];

  const filteredStudents = students.filter(s => {
    const matchProgram = filterProgram === 'all' || s.program === filterProgram;
    const matchLevel = filterLevel === 'all' || s.level === filterLevel;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchProgram && matchLevel && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'probation':
        return '#F44336';
      case 'deferred':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👨‍🎓 Students</h1>
          <p>Department-level student oversight</p>
        </div>
        <button className="btn-primary">
          <FiDownload /> Export List
        </button>
      </div>

      {/* Filters */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FiFilter /> Filters
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>Program</label>
            <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)}>
              <option value="all">All Programs</option>
              {programs.slice(1).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Level</label>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="all">All Levels</option>
              {levels.slice(1).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="probation">On Probation</option>
              <option value="deferred">Deferred</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Program</th>
              <th>Level</th>
              <th>CGPA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td><strong>{student.name}</strong></td>
                <td>{student.studentId}</td>
                <td>{student.program}</td>
                <td>{student.level}</td>
                <td style={{ fontWeight: 'bold', color: student.cgpa < 2.0 ? '#F44336' : '#333' }}>
                  {student.cgpa.toFixed(2)}
                </td>
                <td>
                  <span
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: getStatusColor(student.status),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    View Record
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          No students match the selected filters.
        </div>
      )}

      {/* Summary */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Total Students</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{students.length}</h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Active Students</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
            {students.filter(s => s.status === 'active').length}
          </h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>On Probation</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F44336' }}>
            {students.filter(s => s.status === 'probation').length}
          </h2>
        </div>
      </div>
    </div>
  );
}
