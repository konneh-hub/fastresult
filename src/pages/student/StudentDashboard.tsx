import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiBell } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface StudentAcademicData {
  currentCGPA: number;
  academicStanding: string;
  completedCredits: number;
  totalCreditsRequired: number;
  semester: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
}

export default function StudentDashboard() {
  const [academic, setAcademic] = useState<StudentAcademicData>({
    currentCGPA: 0,
    academicStanding: 'Loading...',
    completedCredits: 0,
    totalCreditsRequired: 120,
    semester: 'Loading...',
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real student data
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch student results/academic data
        try {
          const resultsResponse = await fetch(`http://localhost:5000/api/results/${user.id}`, {
            method: 'GET',
            headers
          });

          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json();
            if (resultsData) {
              setAcademic(prev => ({
                ...prev,
                currentCGPA: resultsData.cgpa || 0,
                academicStanding: resultsData.standing || 'Active',
                completedCredits: resultsData.completedCredits || 0,
                semester: resultsData.currentSemester || '2024/2025 - Semester 1'
              }));
            }
          }
        } catch (err) {
          console.log('Could not fetch academic data');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading student data:', err);
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle color="#4CAF50" />;
      case 'warning':
        return <FiAlertTriangle color="#F44336" />;
      default:
        return <FiBell color="#2196F3" />;
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👨‍🎓 Dashboard</h1>
          <p>Your academic summary and performance overview</p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Loading your academic data...
        </div>
      )}

      {!loading && (
        <>
          {/* Academic Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="metric-card" style={{ borderLeftColor: '#4CAF50' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>Current CGPA</p>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                    {academic.currentCGPA.toFixed(2)}
                  </h2>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>out of 4.0</p>
                </div>
                <FiTrendingUp size={32} color="#4CAF50" style={{ opacity: 0.7 }} />
              </div>
            </div>

            <div className="metric-card" style={{ borderLeftColor: '#2196F3' }}>
              <div>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Academic Standing</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#2196F3' }}>
                  {academic.academicStanding}
            </h2>
            <p style={{ color: '#999', fontSize: '0.85rem' }}>Maintaining good progress</p>
          </div>
        </div>

        <div className="metric-card" style={{ borderLeftColor: '#FF9800' }}>
          <div>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>Credits Completed</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
              {academic.completedCredits}/{academic.totalCreditsRequired}
            </h2>
            <p style={{ color: '#999', fontSize: '0.85rem' }}>
              {Math.round((academic.completedCredits / academic.totalCreditsRequired) * 100)}% complete
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="status-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Degree Progress</h3>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#e0e0e0',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            width: `${(academic.completedCredits / academic.totalCreditsRequired) * 100}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
          }} />
        </div>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          {academic.completedCredits} of {academic.totalCreditsRequired} credits completed
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>📢 Recent Notifications</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {notifications.map(notif => (
              <div key={notif.id} className="status-card">
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{notif.title}</h4>
                    <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>
                      {notif.message}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.8rem', margin: 0 }}>
                      {notif.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>⚡ Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button className="btn-primary">View My Results</button>
          <button className="btn-primary">View Transcript</button>
          <button className="btn-primary">My Profile</button>
          <button className="btn-primary">Support</button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
