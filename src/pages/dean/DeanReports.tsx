import React, { useState } from 'react';
import { FiDownload, FiFilter, FiBarChart2 } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface FacultyReport {
  period: string;
  passRate: number;
  failRate: number;
  avgGPA: number;
  totalStudents: number;
  topDept: string;
  bottomDept: string;
}

export default function DeanReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-1');
  const [reportType, setReportType] = useState('overview');

  const reports: { [key: string]: FacultyReport } = {
    '2024-1': {
      period: 'Jan - Apr 2024',
      passRate: 87.5,
      failRate: 12.5,
      avgGPA: 3.42,
      totalStudents: 2450,
      topDept: 'Computer Science (92%)',
      bottomDept: 'Physics (76%)',
    },
    '2023-2': {
      period: 'Sep - Dec 2023',
      passRate: 85.2,
      failRate: 14.8,
      avgGPA: 3.35,
      totalStudents: 2380,
      topDept: 'Biology (89%)',
      bottomDept: 'Chemistry (78%)',
    },
  };

  const currentReport = reports[selectedPeriod];

  const departmentData = [
    { name: 'Computer Science', passRate: 92, avgGPA: 3.68, students: 320 },
    { name: 'Mathematics', passRate: 84, avgGPA: 3.25, students: 280 },
    { name: 'Physics', passRate: 76, avgGPA: 3.01, students: 240 },
    { name: 'Chemistry', passRate: 88, avgGPA: 3.42, students: 260 },
    { name: 'Biology', passRate: 89, avgGPA: 3.45, students: 290 },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📊 Faculty Reports</h1>
          <p>Comprehensive faculty performance analysis</p>
        </div>
        <button className="btn-primary">
          <FiDownload /> Export Report
        </button>
      </div>

      {/* Report Filters */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiFilter /> Report Filters
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>Period</label>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="2024-1">Jan - Apr 2024</option>
              <option value="2023-2">Sep - Dec 2023</option>
            </select>
          </div>
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="overview">Faculty Overview</option>
              <option value="department">Department Comparison</option>
              <option value="gpa">GPA Distribution</option>
              <option value="performance">Performance Metrics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {reportType === 'overview' && (
        <>
          <h2 style={{ marginBottom: '1rem' }}>📈 Overview - {currentReport.period}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="metric-card">
              <p style={{ color: '#666' }}>Pass Rate</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4CAF50' }}>{currentReport.passRate}%</h2>
            </div>
            <div className="metric-card">
              <p style={{ color: '#666' }}>Fail Rate</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#F44336' }}>{currentReport.failRate}%</h2>
            </div>
            <div className="metric-card">
              <p style={{ color: '#666' }}>Average GPA</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2196F3' }}>{currentReport.avgGPA}</h2>
            </div>
            <div className="metric-card">
              <p style={{ color: '#666' }}>Total Students</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF9800' }}>{currentReport.totalStudents}</h2>
            </div>
          </div>

          <div className="status-card" style={{ marginBottom: '2rem' }}>
            <h3>Faculty Highlights</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
              <div>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>🏆 Best Performing Department</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentReport.topDept}</p>
              </div>
              <div>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>⚠️ Needs Attention</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F44336' }}>{currentReport.bottomDept}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Department Comparison */}
      {reportType === 'department' && (
        <>
          <h2 style={{ marginBottom: '1rem' }}>🏢 Department Comparison</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Pass Rate</th>
                <th>Avg GPA</th>
                <th>Total Students</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, idx) => (
                <tr key={idx}>
                  <td><strong>{dept.name}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${dept.passRate}%`,
                          height: '100%',
                          backgroundColor: dept.passRate > 85 ? '#4CAF50' : '#FF9800'
                        }} />
                      </div>
                      <span style={{ fontWeight: 'bold' }}>{dept.passRate}%</span>
                    </div>
                  </td>
                  <td>{dept.avgGPA.toFixed(2)}</td>
                  <td>{dept.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Export Options */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>📥 Export Options</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-primary" style={{ backgroundColor: '#2196F3' }}>
            <FiDownload /> Export as PDF
          </button>
          <button className="btn-primary" style={{ backgroundColor: '#4CAF50' }}>
            <FiDownload /> Export as Excel
          </button>
          <button className="btn-primary" style={{ backgroundColor: '#FF9800' }}>
            <FiDownload /> Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
