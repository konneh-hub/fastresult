import React, { useState, useEffect } from 'react';
import { FiUpload, FiCheck, FiX, FiDownload, FiFilter } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface CompiledResult {
  id: string;
  department: string;
  course: string;
  totalStudents: number;
  submitted: number;
  pending: number;
  status: 'completed' | 'in-progress' | 'pending';
  uploadDate: string;
  action?: string;
}

export default function ResultsCompilation() {
  const [compilations, setCompilations] = useState<CompiledResult[]>([]);

  useEffect(() => {
    const fetchCompilations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/examofficer/${user.id}/compilations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCompilations(data);
        }
      } catch (error) {
        console.error('Error fetching compilations:', error);
      }
    };

    fetchCompilations();
  }, []);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCompilations = filterStatus === 'all' 
    ? compilations 
    : compilations.filter(c => c.status === filterStatus);

  const handleApprove = (id: string) => {
    setCompilations(compilations.map(c => 
      c.id === id ? { ...c, status: 'completed' as const } : c
    ));
    alert('Results compilation approved!');
  };

  const handleReject = (id: string) => {
    setCompilations(compilations.map(c => 
      c.id === id ? { ...c, status: 'pending' as const } : c
    ));
    alert('Results compilation rejected. Returned for correction.');
  };

  const handleDownload = (id: string) => {
    alert('Downloading compilation report for ID: ' + id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22C55E';
      case 'in-progress': return '#F97316';
      case 'pending': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📋 Results Compilation</h1>
          <p>Compile and review results from all departments before publishing.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiUpload /> Upload Results
        </button>
      </div>

      {/* Filter Section */}
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filter Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '10px 15px',
              background: filterStatus === 'all' ? '#1E40AF' : '#f0f0f0',
              color: filterStatus === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            All ({compilations.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            style={{
              padding: '10px 15px',
              background: filterStatus === 'completed' ? '#22C55E' : '#f0f0f0',
              color: filterStatus === 'completed' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Completed ({compilations.filter(c => c.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            style={{
              padding: '10px 15px',
              background: filterStatus === 'in-progress' ? '#F97316' : '#f0f0f0',
              color: filterStatus === 'in-progress' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            In Progress ({compilations.filter(c => c.status === 'in-progress').length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            style={{
              padding: '10px 15px',
              background: filterStatus === 'pending' ? '#EF4444' : '#f0f0f0',
              color: filterStatus === 'pending' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Pending ({compilations.filter(c => c.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Compilations Table */}
      <div className="form-card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Department</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Course</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Students</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Submitted</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompilations.map(comp => (
              <tr key={comp.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem' }}>{comp.department}</td>
                <td style={{ padding: '1rem' }}>{comp.course}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{comp.totalStudents}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ background: '#DCFCE7', color: '#16A34A', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em', fontWeight: 600 }}>
                    {comp.submitted}/{comp.totalStudents}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    background: getStatusColor(comp.status) + '20',
                    color: getStatusColor(comp.status),
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}>
                    {comp.status.charAt(0).toUpperCase() + comp.status.slice(1).replace('-', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleApprove(comp.id)}
                      style={{
                        background: '#22C55E',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Approve"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      onClick={() => handleReject(comp.id)}
                      style={{
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Reject"
                    >
                      <FiX size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(comp.id)}
                      style={{
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Download"
                    >
                      <FiDownload size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
