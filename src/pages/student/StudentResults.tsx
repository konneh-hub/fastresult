import React, { useState, useEffect } from 'react';
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
  const [semesters, setSemesters] = useState<SemesterResult[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/results/${user.id}/semesters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setSemesters(data.semesters || []);
          setCourses(data.courses || []);
          if (data.semesters && data.semesters.length > 0) {
            setSelectedSemester(data.semesters[0].id || '2024-1');
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  const currentSemester = semesters.length > 0 ? semesters[0] : null;

  if (!currentSemester) {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>📊 My Results</h1>
          <p>View your semester results and grades</p>
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>Loading results...</p>
      </div>
    );
  }

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
