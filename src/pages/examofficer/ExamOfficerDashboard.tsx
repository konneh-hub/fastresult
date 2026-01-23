import React, { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface ExamMetric {
  label: string;
  value: number | string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

interface ResultPipeline {
  stage: string;
  status: 'completed' | 'in-progress' | 'pending';
  count: number;
  percentage: number;
}

export default function ExamOfficerDashboard() {
  const metrics: ExamMetric[] = [
    {
      label: 'Results to Publish',
      value: '156',
      change: '12 faculties',
      icon: <FiClock size={28} />,
      color: '#FF9800',
    },
    {
      label: 'Departments Completed',
      value: '18',
      change: 'of 24 total',
      icon: <FiCheckCircle size={28} />,
      color: '#4CAF50',
    },
    {
      label: 'Transcripts Generated',
      value: '2,340',
      change: '+125 today',
      icon: <FiTrendingUp size={28} />,
      color: '#2196F3',
    },
    {
      label: 'Pending Approvals',
      value: '6',
      change: '3 critical',
      icon: <FiAlertTriangle size={28} />,
      color: '#F44336',
    },
  ];

  const pipeline: ResultPipeline[] = [
    { stage: 'Lecturer Submitted', status: 'completed', count: 156, percentage: 100 },
    { stage: 'HOD Reviewed', status: 'completed', count: 148, percentage: 95 },
    { stage: 'Dean Approved', status: 'in-progress', count: 142, percentage: 91 },
    { stage: 'Ready to Publish', status: 'pending', count: 120, percentage: 77 },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📊 Exam Cycle Dashboard</h1>
          <p>Track entire exam lifecycle and results publication</p>
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

      {/* Results Pipeline */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🔄 Results Pipeline</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {pipeline.map((item, idx) => (
            <div key={idx} className="status-card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{item.stage}</h3>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor:
                        item.status === 'completed' ? '#4CAF50' :
                          item.status === 'in-progress' ? '#FF9800' : '#ccc'
                    }} />
                  </div>
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>
                    {item.count} results ({item.percentage}%)
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor:
                        item.status === 'completed' ? '#4CAF50' :
                          item.status === 'in-progress' ? '#FF9800' : '#ccc',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incomplete Departments */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Bottleneck Departments</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="status-card" style={{ borderLeft: '4px solid #F44336' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Physics Department</h4>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>Stuck at HOD approval stage</p>
              </div>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#F44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                Follow Up
              </button>
            </div>
          </div>
          <div className="status-card" style={{ borderLeft: '4px solid #FF9800' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Chemistry Department</h4>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>Awaiting Dean approval</p>
              </div>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button className="btn-primary">Compile Results</button>
          <button className="btn-primary">Publish Results</button>
          <button className="btn-primary">Generate Transcripts</button>
          <button className="btn-primary">View Reports</button>
        </div>
      </div>
    </div>
  );
}
