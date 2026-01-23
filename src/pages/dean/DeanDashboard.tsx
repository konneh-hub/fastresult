import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface FacultyMetric {
  label: string;
  value: number | string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

interface DepartmentStatus {
  id: string;
  name: string;
  passRate: number;
  avgGPA: number;
  pendingApprovals: number;
  status: 'healthy' | 'warning' | 'critical';
}

export default function DeanDashboard() {
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const metrics: FacultyMetric[] = [
    {
      label: 'Faculty Pass Rate',
      value: '87.5%',
      change: '+2.3% from last semester',
      icon: <FiCheckCircle size={28} />,
      color: '#4CAF50',
    },
    {
      label: 'Average GPA',
      value: '3.42',
      change: '+0.15 points',
      icon: <FiTrendingUp size={28} />,
      color: '#2196F3',
    },
    {
      label: 'Pending Approvals',
      value: '12',
      change: '4 critical',
      icon: <FiClock size={28} />,
      color: '#FF9800',
    },
    {
      label: 'Flagged Courses',
      value: '3',
      change: 'Abnormal grading detected',
      icon: <FiAlertTriangle size={28} />,
      color: '#F44336',
    },
  ];

  const departments: DepartmentStatus[] = [
    {
      id: '1',
      name: 'Computer Science',
      passRate: 92,
      avgGPA: 3.68,
      pendingApprovals: 2,
      status: 'healthy',
    },
    {
      id: '2',
      name: 'Mathematics',
      passRate: 84,
      avgGPA: 3.25,
      pendingApprovals: 3,
      status: 'warning',
    },
    {
      id: '3',
      name: 'Physics',
      passRate: 76,
      avgGPA: 3.01,
      pendingApprovals: 4,
      status: 'critical',
    },
    {
      id: '4',
      name: 'Chemistry',
      passRate: 89,
      avgGPA: 3.45,
      pendingApprovals: 1,
      status: 'healthy',
    },
    {
      id: '5',
      name: 'Biology',
      passRate: 85,
      avgGPA: 3.32,
      pendingApprovals: 2,
      status: 'healthy',
    },
  ];

  const probationStudents = [
    { id: 1, name: 'Ahmed Hassan', program: 'BSc CS', dept: 'Computer Science', gpa: 1.8 },
    { id: 2, name: 'Zainab Mohammed', program: 'BSc Math', dept: 'Mathematics', gpa: 1.95 },
    { id: 3, name: 'Fatima Ali', program: 'BSc Physics', dept: 'Physics', gpa: 1.75 },
  ];

  const filteredDepts = departmentFilter === 'all' 
    ? departments 
    : departments.filter(d => d.id === departmentFilter);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🎓 Faculty Dashboard</h1>
          <p>Faculty-wide academic overview and monitoring</p>
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

      {/* Departments Status */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Department Status</h2>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredDepts.map(dept => (
            <div key={dept.id} className="status-card" style={{
              borderLeft: `4px solid ${dept.status === 'healthy' ? '#4CAF50' : dept.status === 'warning' ? '#FF9800' : '#F44336'}`
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{dept.name}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                    <div>
                      <p style={{ color: '#666', fontSize: '0.85rem' }}>Pass Rate</p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{dept.passRate}%</p>
                    </div>
                    <div>
                      <p style={{ color: '#666', fontSize: '0.85rem' }}>Average GPA</p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{dept.avgGPA.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div>
                    <p style={{ color: '#FF9800', fontSize: '1.5rem', fontWeight: 'bold' }}>{dept.pendingApprovals}</p>
                    <p style={{ color: '#666', fontSize: '0.85rem' }}>Pending Approvals</p>
                  </div>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      marginTop: '1rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students on Probation */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Students on Probation</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Student Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Program</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Department</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>CGPA</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {probationStudents.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{student.name}</td>
                <td style={{ padding: '1rem' }}>{student.program}</td>
                <td style={{ padding: '1rem' }}>{student.dept}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#F44336' }}>{student.gpa}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
