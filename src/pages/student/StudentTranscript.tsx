import React, { useState } from 'react';
import { FiDownload, FiFileText } from 'react-icons/fi';
import '../admin/AdminPages.css';

export default function StudentTranscript() {
  const [transcriptType, setTranscriptType] = useState('unofficial');

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🎓 Official Transcript</h1>
          <p>Academic records and degree progress</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-primary">
            <FiDownload /> Download
          </button>
          <button className="btn-primary" style={{ backgroundColor: '#f44336' }}>
            <FiFileText /> Print
          </button>
        </div>
      </div>

      {/* Transcript Type Selection */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Transcript Type</h3>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="transcriptType"
              value="unofficial"
              checked={transcriptType === 'unofficial'}
              onChange={(e) => setTranscriptType(e.target.value)}
            />
            <span>Unofficial Transcript (Free)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="transcriptType"
              value="official"
              checked={transcriptType === 'official'}
              onChange={(e) => setTranscriptType(e.target.value)}
            />
            <span>Official Transcript (Request)</span>
          </label>
        </div>
      </div>

      {/* Transcript Preview */}
      <div style={{
        padding: '3rem 2rem',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '2rem',
        fontFamily: 'Georgia, serif',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #333' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>UNIVERSITY OF EXCELLENCE</h1>
          <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>Official Academic Transcript</p>
        </div>

        {/* Student Information */}
        <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Student Name:</p>
            <p style={{ margin: '0 0 1rem 0' }}>Ahmed Hassan Ibrahim</p>

            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Student ID:</p>
            <p style={{ margin: '0 0 1rem 0' }}>CS/2020/001</p>

            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Date of Birth:</p>
            <p style={{ margin: 0 }}>15th January, 2002</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Program:</p>
            <p style={{ margin: '0 0 1rem 0' }}>Bachelor of Science (BSc) in Computer Science</p>

            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Admission Date:</p>
            <p style={{ margin: '0 0 1rem 0' }}>September 2020</p>

            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Expected Graduation:</p>
            <p style={{ margin: 0 }}>May 2024</p>
          </div>
        </div>

        {/* Academic Record */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Academic Record
          </h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Semester</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>GPA</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Credits</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Semester 1</td>
                <td style={{ padding: '0.5rem' }}>2020/2021</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>3.45</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>18</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Semester 2</td>
                <td style={{ padding: '0.5rem' }}>2020/2021</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>3.52</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>18</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>Semester 1</td>
                <td style={{ padding: '0.5rem' }}>2023/2024</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>3.68</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>18</td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', borderTop: '2px solid #333', borderBottom: '2px solid #333' }}>
                <td colSpan={2} style={{ padding: '0.5rem' }}>Cumulative GPA</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>3.55</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>54</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Degree Classification */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>Degree Classification:</p>
          <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold', fontSize: '1.1rem' }}>First Class Honours</p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
            Based on Cumulative GPA ≥ 3.50
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid #333', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>This is an official transcript issued by the University of Excellence</p>
          <p style={{ margin: 0 }}>Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Request Official Transcript */}
      {transcriptType === 'official' && (
        <div className="form-card">
          <h3>Request Official Transcript</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Official transcripts are sealed academic records. Fill the form below to request official copies.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label>Number of Copies</label>
              <input type="number" min="1" max="10" defaultValue="1" />
            </div>
            <div className="form-group">
              <label>Delivery Method</label>
              <select>
                <option>Digital (Email)</option>
                <option>Physical (Mail)</option>
                <option>In-Person Pickup</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: '1rem' }}>
            <FiDownload /> Request Official Transcript
          </button>
        </div>
      )}
    </div>
  );
}
