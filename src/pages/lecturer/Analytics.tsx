import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface CourseAnalytics {
  courseCode: string;
  courseName: string;
  studentCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  gradeDistribution: Record<string, number>;
}

export default function Analytics() {
  const [courses, setCourses] = useState<CourseAnalytics[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<CourseAnalytics | null>(null);

  // Load real analytics from backend
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch lecturer's course analytics
        const response = await fetch(`http://localhost:5000/api/results/lecturer/${user.id}/analytics`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          const coursesList = Array.isArray(data) ? data : [];
          setCourses(coursesList);
          if (coursesList.length > 0) {
            setSelectedCourse(coursesList[0]);
          }
        }
      } catch (err) {
        console.log('Could not fetch analytics from backend.');
        setCourses([]);
      }
    };

    loadAnalytics();
  }, []);
  const [showChartModal, setShowChartModal] = useState(false);

  const overallStats = {
    totalStudents: courses.reduce((sum, c) => sum + c.studentCount, 0),
    averageScore: (courses.reduce((sum, c) => sum + c.averageScore, 0) / courses.length).toFixed(1),
    overallPassRate: (courses.reduce((sum, c) => sum + c.passRate, 0) / courses.length).toFixed(1),
    courses: courses.length
  };

  const BarChart = ({ data, height = 200 }: { data: number[]; height?: number }) => {
    const maxValue = Math.max(...data);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: `${height}px`, marginTop: '1rem' }}>
        {data.map((value, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: `${(value / maxValue) * 100}%`,
              background: `hsl(${idx * 30}, 70%, 50%)`,
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              transition: 'all 0.3s'
            }}
            title={`Value: ${value}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📊 Course Analytics & Performance</h1>
          <p>Detailed analytics and insights about your courses and student performance</p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card" style={{ borderLeftColor: '#3B82F6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Total Students</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overallStats.totalStudents}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#10B981' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Average Score</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overallStats.averageScore}/100</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Pass Rate</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overallStats.overallPassRate}%</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#F59E0B' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Courses</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overallStats.courses}</p>
        </div>
      </div>

      {/* Course Selection */}
      <div style={{
        background: '#F8FAFC',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0 }}>📚 Select Course for Detailed Analysis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {courses.map(course => (
            <div
              key={course.courseCode}
              onClick={() => setSelectedCourse(course)}
              style={{
                padding: '1rem',
                background: selectedCourse.courseCode === course.courseCode ? '#3B82F6' : 'white',
                color: selectedCourse.courseCode === course.courseCode ? 'white' : 'black',
                border: `2px solid ${selectedCourse.courseCode === course.courseCode ? '#3B82F6' : '#E2E8F0'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{course.courseCode}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{course.courseName}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                {course.studentCount} students
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Course Detailed Analysis */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0' }}>
          {selectedCourse.courseCode} - {selectedCourse.courseName}
        </h2>

        {/* Course Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', background: '#F0F9FF', borderRadius: '6px', borderLeft: '4px solid #3B82F6' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Total Students</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedCourse.studentCount}</p>
          </div>
          <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '6px', borderLeft: '4px solid #22C55E' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Average Score</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#22C55E' }}>{selectedCourse.averageScore.toFixed(1)}</p>
          </div>
          <div style={{ padding: '1rem', background: '#F7F4FF', borderRadius: '6px', borderLeft: '4px solid #7C3AED' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Highest Score</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#7C3AED' }}>{selectedCourse.highestScore}</p>
          </div>
          <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '6px', borderLeft: '4px solid #EF4444' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Lowest Score</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#EF4444' }}>{selectedCourse.lowestScore}</p>
          </div>
          <div style={{ padding: '1rem', background: '#FFFBEB', borderRadius: '6px', borderLeft: '4px solid #F59E0B' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Pass Rate</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#F59E0B' }}>{selectedCourse.passRate}%</p>
          </div>
          <div style={{ padding: '1rem', background: '#F5F3FF', borderRadius: '6px', borderLeft: '4px solid #8B5CF6' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Score Range</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#8B5CF6' }}>{selectedCourse.highestScore - selectedCourse.lowestScore}</p>
          </div>
        </div>

        {/* Grade Distribution */}
        <h3 style={{ marginBottom: '1rem' }}>📊 Grade Distribution</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {Object.entries(selectedCourse.gradeDistribution).map(([grade, count]) => (
            count > 0 && (
              <div key={grade} style={{
                textAlign: 'center',
                padding: '1rem',
                background: '#F8FAFC',
                borderRadius: '6px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem' }}>
                  {grade}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{count}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                  {((count / selectedCourse.studentCount) * 100).toFixed(0)}%
                </div>
              </div>
            )
          ))}
        </div>

        {/* Score Distribution Chart */}
        <h3 style={{ marginBottom: '0.5rem' }}>📈 Score Distribution Visualization</h3>
        <BarChart
          data={Object.values(selectedCourse.gradeDistribution).filter(count => count > 0)}
          height={250}
        />
      </div>

      {/* Performance Summary */}
      <div style={{
        background: '#F0F9FF',
        padding: '1.5rem',
        borderRadius: '8px',
        borderLeft: '4px solid #3B82F6'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiTrendingUp /> Performance Summary
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>
            <strong>Excellence Rate:</strong> {((Object.values(selectedCourse.gradeDistribution).slice(0, 2).reduce((a, b) => a + b, 0) / selectedCourse.studentCount) * 100).toFixed(1)}% of students achieved A or A- grade
          </li>
          <li>
            <strong>Performance:</strong> Average score of {selectedCourse.averageScore.toFixed(1)}/100 indicates {selectedCourse.averageScore >= 80 ? 'excellent' : selectedCourse.averageScore >= 70 ? 'good' : 'average'} class performance
          </li>
          <li>
            <strong>Consistency:</strong> Score range of {selectedCourse.highestScore - selectedCourse.lowestScore} points shows {selectedCourse.highestScore - selectedCourse.lowestScore > 50 ? 'varied' : 'consistent'} student performance
          </li>
        </ul>
      </div>
    </div>
  );
}
