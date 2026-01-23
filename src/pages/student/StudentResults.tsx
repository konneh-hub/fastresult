import React, { useState } from 'react';
import { FiDownload, FiFilter } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface SemesterResult {
  semester: string;
  year: string;
  gpa: number;
  status: 'published' | 'pending_approval' | 'not_published';
  courseCount: number;
  passedCourses: number;
}

interface Course {
  code: string;
  name: string;
  credit: number;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  gpaPoint: number;
}

export default function StudentResults() {
  const [selectedSemester, setSelectedSemester] = useState('2024-1');

  const semesters: SemesterResult[] = [
    {
      semester: 'Semester 1',
      year: '2024',
      gpa: 3.68,
      status: 'published',
      courseCount: 6,
      passedCourses: 6,
    },
    {
      semester: 'Semester 2',
      year: '2023',
      gpa: 3.52,
      status: 'published',
      courseCount: 6,
      passedCourses: 6,
    },
    {
      semester: 'Semester 1',
      year: '2023',
      gpa: 3.45,
      status: 'published',
      courseCount: 6,
      passedCourses: 6,
    },
  ];

  const courses: Course[] = [
    {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      credit: 3,
      ca: 18,
      exam: 72,
      total: 90,
      grade: 'A',
      gpaPoint: 4.0,
    },
    {
      code: 'CS302',
      name: 'Web Development',
      credit: 3,
      ca: 16,
      exam: 68,
      total: 84,
      grade: 'A',
      gpaPoint: 3.7,
    },
    {
      code: 'CS303',
      name: 'Database Management',
      credit: 4,
      ca: 17,
      exam: 70,
      total: 87,
      grade: 'A',
      gpaPoint: 3.7,
    },
    {
      code: 'CS304',
      name: 'Software Engineering',
      credit: 3,
      ca: 19,
      exam: 75,
      total: 94,
      grade: 'A+',
      gpaPoint: 4.0,
    },
    {
      code: 'CS305',
      name: 'Network Security',
      credit: 3,
      ca: 15,
      exam: 65,
      total: 80,
      grade: 'B',
      gpaPoint: 3.0,
    },
    {
      code: 'GEN401',
      name: 'General Education',
      credit: 2,
      ca: 19,
      exam: 78,
      total: 97,
      grade: 'A+',
      gpaPoint: 4.0,
    },
  ];

  const currentSemester = semesters[0];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📊 My Results</h1>
          <p>View your semester results and grades</p>
        </div>
        <button className="btn-primary">
          <FiDownload /> Download Slip
        </button>
      </div>

      {/* Semester Selection */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FiFilter /> Select Semester
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {semesters.map((sem, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSemester(`${sem.year}-${idx}`)}
              style={{
                padding: '1rem',
                backgroundColor: selectedSemester === `${sem.year}-${idx}` ? '#667eea' : '#f0f0f0',
                color: selectedSemester === `${sem.year}-${idx}` ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s',
              }}
            >
              {sem.semester} {sem.year}
            </button>
          ))}
        </div>
      </div>

      {/* Semester Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Semester GPA</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{currentSemester.gpa}</h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Courses Passed</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196F3' }}>
            {currentSemester.passedCourses}/{currentSemester.courseCount}
          </h2>
        </div>
        <div className="metric-card">
          <p style={{ color: '#666' }}>Status</p>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4CAF50' }}>
            {currentSemester.status === 'published' ? '✓ Published' : 'Pending'}
          </h2>
        </div>
      </div>

      {/* Course Results */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>📚 Course Details</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credit</th>
                <th>CA</th>
                <th>Exam</th>
                <th>Total</th>
                <th>Grade</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx}>
                  <td><strong>{course.code}</strong></td>
                  <td>{course.name}</td>
                  <td>{course.credit}</td>
                  <td>{course.ca}</td>
                  <td>{course.exam}</td>
                  <td><strong>{course.total}</strong></td>
                  <td><strong style={{ color: '#4CAF50' }}>{course.grade}</strong></td>
                  <td>{course.gpaPoint.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px', borderLeft: '4px solid #4CAF50' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>✓ Semester Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Total Credits Earned</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32', margin: 0 }}>18 credits</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Current CGPA</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32', margin: 0 }}>3.68</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Academic Standing</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32', margin: 0 }}>Good Standing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
