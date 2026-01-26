import React, { useState, useEffect } from 'react';
import { FiUpload, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface UploadRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  recordsCount: number;
  successCount: number;
  failureCount: number;
  status: 'processing' | 'completed' | 'failed';
}

export default function UploadExcel() {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/lecturer/${user.id}/uploads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUploads(data);
        }
      } catch (error) {
        console.error('Error fetching uploads:', error);
      }
    };

    fetchUploads();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
    } else {
      alert('❌ Please select a valid Excel (.xlsx, .xls) or CSV file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('❌ Please select a file first');
      return;
    }

    setUploading(true);

    // Simulate file upload and processing
    setTimeout(() => {
      const newUpload: UploadRecord = {
        id: String(Date.now()),
        fileName: selectedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        recordsCount: Math.floor(Math.random() * 100) + 50,
        successCount: Math.floor(Math.random() * 100) + 45,
        failureCount: Math.floor(Math.random() * 5),
        status: 'completed'
      };

      setUploads([newUpload, ...uploads]);
      setSelectedFile(null);
      setUploading(false);
      alert('✅ File uploaded and processed successfully!');
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    const template = `Matric No,Student Name,Course Code,Course Name,Faculty,Department,Program,Level,Score
CS/2021/001,John Adeyemi,CS301,Data Structures,Faculty of Science,Computer Science,BSc Computer Science,300,85
CS/2021/002,Jane Okafor,CS301,Data Structures,Faculty of Science,Computer Science,BSc Software Engineering,300,78`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Results_Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📤 Upload Results (Excel/CSV)</h1>
          <p>Bulk upload student results from Excel or CSV files</p>
        </div>
      </div>

      {/* Upload Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>📥 Upload Your Results File</h2>
        <p style={{ margin: '0 0 1.5rem 0' }}>Supported formats: .xlsx, .xls, .csv</p>

        <div style={{
          border: '2px dashed white',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '1.5rem',
          cursor: 'pointer',
          transition: 'all 0.3s',
          background: 'rgba(255,255,255,0.1)'
        }}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <FiUpload style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
            <p style={{ margin: '0.5rem 0' }}>
              {selectedFile ? selectedFile.name : 'Click to select file or drag and drop'}
            </p>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              fontSize: '1rem',
              opacity: selectedFile && !uploading ? 1 : 0.5
            }}
          >
            {uploading ? '⏳ Processing...' : '📤 Upload File'}
          </button>
          <button
            onClick={handleDownloadTemplate}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            <FiDownload style={{ marginRight: '0.5rem' }} /> Download Template
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: '#F0F9FF',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #BFE7FF'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>📋 File Format Instructions</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>Column Order:</strong> Matric No, Student Name, Course Code, Course Name, Faculty, Department, Program, Level, Score</li>
          <li><strong>Score Range:</strong> Must be between 0-100</li>
          <li><strong>Required Fields:</strong> Matric No, Student Name, Course Code, Faculty, Score</li>
          <li><strong>Max File Size:</strong> 5MB</li>
          <li><strong>Supported Sheets:</strong> Only the first sheet will be processed</li>
        </ul>
      </div>

      {/* Upload History */}
      <h2 style={{ marginBottom: '1rem' }}>📜 Upload History</h2>
      <div className="table-card">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Upload Date</th>
              <th>Total Records</th>
              <th>Success</th>
              <th>Failed</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(upload => (
              <tr key={upload.id}>
                <td style={{ fontWeight: 600 }}>{upload.fileName}</td>
                <td>{new Date(upload.uploadDate).toLocaleDateString()}</td>
                <td style={{ textAlign: 'center' }}>{upload.recordsCount}</td>
                <td style={{ textAlign: 'center', color: '#22C55E', fontWeight: 600 }}>{upload.successCount}</td>
                <td style={{ textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{upload.failureCount}</td>
                <td>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: upload.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                    color: upload.status === 'completed' ? '#047857' : '#92400E',
                    width: 'fit-content'
                  }}>
                    {upload.status === 'completed' ? <FiCheckCircle /> : <FiAlertCircle />}
                    {upload.status}
                  </span>
                </td>
                <td style={{ color: '#3B82F6', cursor: 'pointer' }}>View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uploads.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748B'
        }}>
          📭 No files uploaded yet. Start by uploading your first file!
        </div>
      )}
    </div>
  );
}
