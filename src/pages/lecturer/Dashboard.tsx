import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LecturerDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'My Courses', value: '6', icon: '📚', color: '#2196F3' },
    { label: 'Total Students', value: '184', icon: '👥', color: '#4CAF50' },
    { label: 'Pending Grades', value: '28', icon: '📝', color: '#FF9800' },
    { label: 'Submissions', value: '156', icon: '📤', color: '#F44336' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Lecturer Dashboard</h1>
        <p className="page-subtitle">View and manage your courses and student submissions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            border: `1px solid #e0e0e0`,
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#999', fontWeight: 500 }}>{stat.label}</p>
                <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 600, color: '#333' }}>{stat.value}</h3>
              </div>
              <div style={{ fontSize: '32px' }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: '#333' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <button 
            onClick={() => navigate('/lecturer/my-courses')}
            style={{ padding: '12px 16px', border: '1px solid #2a5298', background: 'white', color: '#2a5298', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2a5298'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#2a5298'; }}
          >My Courses</button>
          <button 
            onClick={() => navigate('/lecturer/enter-results')}
            style={{ padding: '12px 16px', border: '1px solid #2a5298', background: 'white', color: '#2a5298', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2a5298'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#2a5298'; }}
          >Enter Results</button>
          <button 
            onClick={() => navigate('/lecturer/drafts')}
            style={{ padding: '12px 16px', border: '1px solid #2a5298', background: 'white', color: '#2a5298', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2a5298'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#2a5298'; }}
          >Drafts</button>
          <button 
            onClick={() => navigate('/lecturer/analytics')}
            style={{ padding: '12px 16px', border: '1px solid #2a5298', background: 'white', color: '#2a5298', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2a5298'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#2a5298'; }}
          >Analytics</button>
        </div>
      </div>
    </div>
  );
}
