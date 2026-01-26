import React, { useState } from 'react';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface DepartmentProgress {
  id: string;
  name: string;
  totalResults: number;
  submitted: number;
  approved: number;
  pending: number;
  rejected: number;
  progressPercentage: number;
}

export default function ResultProgressTracker() {
  const [departments] = useState<DepartmentProgress[]>([
    {
      id: '1',
      name: 'Computer Science',
      totalResults: 120,
      submitted: 95,
      approved: 85,
      pending: 10,
      rejected: 5,
      progressPercentage: 71,
    },
    {
      id: '2',
      name: 'Mathematics',
      totalResults: 150,
      submitted: 120,
      approved: 100,
      pending: 20,
      rejected: 0,
      progressPercentage: 67,
    },
    {
      id: '3',
      name: 'Physics',
      totalResults: 100,
      submitted: 60,
      approved: 50,
      pending: 10,
      rejected: 0,
      progressPercentage: 50,
    },
    {
      id: '4',
      name: 'Chemistry',
      totalResults: 90,
      submitted: 85,
      approved: 80,
      pending: 5,
      rejected: 0,
      progressPercentage: 89,
    },
  ]);

  const totalResults = departments.reduce((sum, d) => sum + d.totalResults, 0);
  const totalSubmitted = departments.reduce((sum, d) => sum + d.submitted, 0);
  const totalApproved = departments.reduce((sum, d) => sum + d.approved, 0);
  const totalPending = departments.reduce((sum, d) => sum + d.pending, 0);

  const overallProgress = Math.round((totalApproved / totalResults) * 100);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📈 Result Progress Tracker</h1>
          <p>Monitor real-time progress of result submissions across all departments.</p>
        </div>
      </div>

      {/* Overall Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div className="metric-card" style={{ borderLeftColor: '#2196F3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiTrendingUp size={24} style={{ color: '#2196F3' }} />
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Total Results</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{totalResults}</p>
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#4CAF50' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiCheckCircle size={24} style={{ color: '#4CAF50' }} />
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Approved</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{totalApproved}</p>
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#FF9800' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiClock size={24} style={{ color: '#FF9800' }} />
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Pending</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{totalPending}</p>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiTrendingUp size={24} style={{ color: '#9C27B0' }} />
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Overall Progress</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Overall Approval Progress</h3>
        <div style={{
          width: '100%',
          height: '30px',
          background: '#f0f0f0',
          borderRadius: '15px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${overallProgress}%`,
            height: '100%',
            background: `linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'width 0.3s',
          }}>
            {overallProgress > 10 && `${overallProgress}%`}
          </div>
        </div>
        <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '0.9em' }}>
          {totalApproved} of {totalResults} results approved and ready for publication
        </p>
      </div>

      {/* Department Progress */}
      <div className="form-card">
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Department Progress</h3>
        {departments.map(dept => (
          <div key={dept.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '1.05em' }}>{dept.name}</h4>
              <span style={{ color: '#666', fontSize: '0.9em' }}>{dept.progressPercentage}%</span>
            </div>

            <div style={{
              width: '100%',
              height: '8px',
              background: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}>
              <div style={{
                width: `${dept.progressPercentage}%`,
                height: '100%',
                background: `linear-gradient(90deg, #3B82F6 0%, #2196F3 100%)`,
              }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              fontSize: '0.9em',
            }}>
              <div>
                <span style={{ color: '#666' }}>Total</span>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1em' }}>{dept.totalResults}</p>
              </div>
              <div>
                <span style={{ color: '#666' }}>Submitted</span>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1em', color: '#2196F3' }}>{dept.submitted}</p>
              </div>
              <div>
                <span style={{ color: '#666' }}>Approved</span>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1em', color: '#4CAF50' }}>{dept.approved}</p>
              </div>
              <div>
                <span style={{ color: '#666' }}>Pending</span>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1em', color: '#FF9800' }}>{dept.pending}</p>
              </div>
              <div>
                <span style={{ color: '#666' }}>Rejected</span>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '1.1em', color: '#F44336' }}>{dept.rejected}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
