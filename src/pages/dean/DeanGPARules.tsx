import React, { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface GradeRule {
  minScore: number;
  maxScore: number;
  grade: string;
  gpaPoint: number;
  remark: string;
}

export default function DeanGPARules() {
  const [gpaScale, setGpaScale] = useState<'4.0' | '5.0'>('4.0');
  const [degreeClassification, setDegreeClassification] = useState({
    firstClass: 3.5,
    upperSecond: 3.0,
    lowerSecond: 2.5,
    third: 2.0,
  });

  const gradeRules: GradeRule[] = gpaScale === '4.0' ? [
    { minScore: 90, maxScore: 100, grade: 'A+', gpaPoint: 4.0, remark: 'Excellent' },
    { minScore: 80, maxScore: 89, grade: 'A', gpaPoint: 3.7, remark: 'Very Good' },
    { minScore: 70, maxScore: 79, grade: 'B', gpaPoint: 3.0, remark: 'Good' },
    { minScore: 60, maxScore: 69, grade: 'C', gpaPoint: 2.0, remark: 'Pass' },
    { minScore: 50, maxScore: 59, grade: 'D', gpaPoint: 1.0, remark: 'Pass (Low)' },
    { minScore: 0, maxScore: 49, grade: 'F', gpaPoint: 0.0, remark: 'Fail' },
  ] : [
    { minScore: 90, maxScore: 100, grade: 'A+', gpaPoint: 5.0, remark: 'Excellent' },
    { minScore: 80, maxScore: 89, grade: 'A', gpaPoint: 4.6, remark: 'Very Good' },
    { minScore: 70, maxScore: 79, grade: 'B+', gpaPoint: 4.0, remark: 'Good' },
    { minScore: 65, maxScore: 69, grade: 'B', gpaPoint: 3.5, remark: 'Good' },
    { minScore: 60, maxScore: 64, grade: 'C', gpaPoint: 3.0, remark: 'Pass' },
    { minScore: 55, maxScore: 59, grade: 'D', gpaPoint: 2.0, remark: 'Pass (Low)' },
    { minScore: 0, maxScore: 54, grade: 'F', gpaPoint: 0.0, remark: 'Fail' },
  ];

  const handleUpdateClassification = (field: string, value: number) => {
    setDegreeClassification({
      ...degreeClassification,
      [field]: value,
    });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📊 Faculty GPA Rules & Classification</h1>
          <p>Configure grading policy and degree classification at faculty level</p>
        </div>
        <button className="btn-primary">
          <FiSave /> Save Changes
        </button>
      </div>

      {/* GPA Scale Selection */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3>GPA Scale Configuration</h3>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gpaScale"
              value="4.0"
              checked={gpaScale === '4.0'}
              onChange={(e) => setGpaScale('4.0')}
            />
            <span>4.0 Scale (Default)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gpaScale"
              value="5.0"
              checked={gpaScale === '5.0'}
              onChange={(e) => setGpaScale('5.0')}
            />
            <span>5.0 Scale</span>
          </label>
        </div>
        <p style={{ color: '#666', marginTop: '1rem', fontSize: '0.95rem' }}>
          This setting applies to all departments within the faculty. Admin template rules will be applied.
        </p>
      </div>

      {/* Grade Boundaries */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3>Grade Boundaries (Current Scale: {gpaScale})</h3>
        <table className="data-table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Score Range</th>
              <th>Grade</th>
              <th>GPA Points</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {gradeRules.map((rule, idx) => (
              <tr key={idx}>
                <td>{rule.minScore} - {rule.maxScore}</td>
                <td><strong>{rule.grade}</strong></td>
                <td>{rule.gpaPoint}</td>
                <td>{rule.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ color: '#999', marginTop: '1rem', fontSize: '0.85rem' }}>
          ⚠️ Grade boundaries are set by Admin. To modify, contact System Admin.
        </p>
      </div>

      {/* Degree Classification */}
      <div className="form-card">
        <h3>Degree Classification Rules</h3>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Set the minimum CGPA thresholds for degree classifications
        </p>

        <div className="form-row">
          <div className="form-group">
            <label>First Class (≥)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={degreeClassification.firstClass}
                onChange={(e) => handleUpdateClassification('firstClass', parseFloat(e.target.value))}
              />
              <span style={{ color: '#666', fontSize: '0.9rem' }}>GPA</span>
            </div>
          </div>
          <div className="form-group">
            <label>Upper Second (≥)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={degreeClassification.upperSecond}
                onChange={(e) => handleUpdateClassification('upperSecond', parseFloat(e.target.value))}
              />
              <span style={{ color: '#666', fontSize: '0.9rem' }}>GPA</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Lower Second (≥)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={degreeClassification.lowerSecond}
                onChange={(e) => handleUpdateClassification('lowerSecond', parseFloat(e.target.value))}
              />
              <span style={{ color: '#666', fontSize: '0.9rem' }}>GPA</span>
            </div>
          </div>
          <div className="form-group">
            <label>Third Class (≥)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={degreeClassification.third}
                onChange={(e) => handleUpdateClassification('third', parseFloat(e.target.value))}
              />
              <span style={{ color: '#666', fontSize: '0.9rem' }}>GPA</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px', borderLeft: '4px solid #4CAF50' }}>
          <p style={{ margin: 0, color: '#2e7d32', fontSize: '0.95rem' }}>
            💾 <strong>Example:</strong> A student with CGPA {degreeClassification.firstClass}+ will graduate with First Class Honours.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn-primary">
            <FiSave /> Save Rules
          </button>
          <button className="btn-secondary">
            <FiRefreshCw /> Reset to Default
          </button>
        </div>
      </div>

      {/* Information Box */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px', borderLeft: '4px solid #2196F3' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>ℹ️ Important Information</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1565c0', fontSize: '0.95rem' }}>
          <li>GPA rules apply to entire faculty, not individual students</li>
          <li>All departments in this faculty use the selected GPA scale</li>
          <li>Degree classifications are automatic based on CGPA</li>
          <li>Changes take effect for future result publications only</li>
        </ul>
      </div>
    </div>
  );
}
