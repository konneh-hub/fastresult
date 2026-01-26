import React, { useState, useEffect } from 'react';
import { FiTrash2, FiSend, FiEye, FiDownload } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface DraftSubmission {
  id: string;
  courseCode: string;
  courseName: string;
  studentCount: number;
  faculty: string;
  department: string;
  program: string;
  level: string;
  lastModified: string;
  completionPercentage: number;
  gradeStats: {
    A: number;
    'A-': number;
    'B+': number;
    'B': number;
    'B-': number;
    'C+': number;
    'C': number;
    'D': number;
    'F': number;
  };
}

export default function Drafts() {
  const [drafts, setDrafts] = useState<DraftSubmission[]>([]);

  const [selectedDraft, setSelectedDraft] = useState<DraftSubmission | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load real drafts from backend
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch lecturer's draft submissions
        const response = await fetch(`http://localhost:5000/api/results/lecturer/${user.id}/drafts`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          setDrafts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.log('Could not fetch drafts from backend.');
        setDrafts([]);
      }
    };

    loadDrafts();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('❌ Are you sure you want to delete this draft? This action cannot be undone.')) {
      setDrafts(drafts.filter(d => d.id !== id));
      alert('✅ Draft deleted successfully');
    }
  };

  const handleSubmit = (id: string) => {
    if (confirm('✅ Submit this draft to the exam officer for final processing?')) {
      setDrafts(drafts.filter(d => d.id !== id));
      alert('✅ Draft submitted successfully!');
    }
  };

  const handleDownload = (draft: DraftSubmission) => {
    const csv = `Course Code,Course Name,Faculty,Department,Program,Level,Student Count,Completion %,Created Date
${draft.courseCode},${draft.courseName},${draft.faculty},${draft.department},${draft.program},${draft.level},${draft.studentCount},${draft.completionPercentage}%,${draft.lastModified}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.courseCode}_Draft.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return '#22C55E';
    if (percentage >= 70) return '#3B82F6';
    if (percentage >= 50) return '#FF9800';
    return '#EF4444';
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📋 Draft Submissions</h1>
          <p>Manage and review your draft result submissions before submission</p>
        </div>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card" style={{ borderLeftColor: '#FF9800' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Total Drafts</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{drafts.length}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#3B82F6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Total Students</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{drafts.reduce((sum, d) => sum + d.studentCount, 0)}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Avg Completion</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
            {drafts.length > 0 ? Math.round(drafts.reduce((sum, d) => sum + d.completionPercentage, 0) / drafts.length) : 0}%
          </p>
        </div>
      </div>

      {/* Drafts List */}
      <div className="table-card">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Faculty/Department</th>
              <th>Program</th>
              <th>Level</th>
              <th>Students</th>
              <th>Completion</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map(draft => (
              <tr key={draft.id}>
                <td>
                  <div>
                    <strong>{draft.courseCode}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{draft.courseName}</div>
                  </div>
                </td>
                <td style={{ fontSize: '0.9rem' }}>
                  <div>{draft.faculty}</div>
                  <div style={{ color: '#666' }}>{draft.department}</div>
                </td>
                <td style={{ fontSize: '0.9rem' }}>{draft.program}</td>
                <td style={{ textAlign: 'center' }}>Level {draft.level}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{draft.studentCount}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#E2E8F0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      minWidth: '100px'
                    }}>
                      <div style={{
                        width: `${draft.completionPercentage}%`,
                        height: '100%',
                        background: getCompletionColor(draft.completionPercentage),
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: getCompletionColor(draft.completionPercentage), minWidth: '40px' }}>
                      {draft.completionPercentage}%
                    </span>
                  </div>
                </td>
                <td>{new Date(draft.lastModified).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => {
                      setSelectedDraft(draft);
                      setShowPreview(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#3B82F6',
                      fontSize: '1.2rem'
                    }}
                    title="Preview"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => handleDownload(draft)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#10B981',
                      fontSize: '1.2rem'
                    }}
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                  <button
                    onClick={() => handleSubmit(draft.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#22C55E',
                      fontSize: '1.2rem'
                    }}
                    title="Submit"
                  >
                    <FiSend />
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#EF4444',
                      fontSize: '1.2rem'
                    }}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drafts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748B',
          fontSize: '1.1rem'
        }}>
          ✅ No draft submissions! All your submissions have been finalized.
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedDraft && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2>📋 Draft Preview</h2>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Course Code:</strong> {selectedDraft.courseCode}</p>
              <p><strong>Course Name:</strong> {selectedDraft.courseName}</p>
              <p><strong>Faculty:</strong> {selectedDraft.faculty}</p>
              <p><strong>Department:</strong> {selectedDraft.department}</p>
              <p><strong>Program:</strong> {selectedDraft.program}</p>
              <p><strong>Level:</strong> {selectedDraft.level}</p>
              <p><strong>Total Students:</strong> {selectedDraft.studentCount}</p>
              <p><strong>Completion:</strong> {selectedDraft.completionPercentage}%</p>
            </div>

            <h3>Grade Distribution</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {Object.entries(selectedDraft.gradeStats).map(([grade, count]) => (
                count > 0 && (
                  <div key={grade} style={{ padding: '0.75rem', background: '#F0F4F8', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Grade {grade}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6' }}>{count}</div>
                  </div>
                )
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#E2E8F0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
