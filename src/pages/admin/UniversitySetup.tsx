import React, { useState } from 'react';
import './AdminPages.css';

interface UniversityConfig {
  name: string;
  code: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  academicCalendarStart: string;
  academicCalendarEnd: string;
  minGPA: number;
  maxGPA: number;
  passingGrade: string;
}

export default function UniversitySetup() {
  const [config, setConfig] = useState<UniversityConfig>({
    name: 'Fast Result University',
    code: 'FRU',
    email: 'admin@university.edu',
    phone: '+1-800-123-4567',
    website: 'www.university.edu',
    address: '123 Campus Drive',
    city: 'University City',
    country: 'United States',
    academicCalendarStart: '2024-01-15',
    academicCalendarEnd: '2024-12-15',
    minGPA: 0.0,
    maxGPA: 4.0,
    passingGrade: 'D',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState<UniversityConfig>(config);

  const handleSave = () => {
    setConfig(tempConfig);
    setIsEditing(false);
    alert('University settings updated successfully!');
  };

  const handleCancel = () => {
    setTempConfig(config);
    setIsEditing(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🏫 University Setup</h1>
          <p>Configure university-wide settings and parameters.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Settings'}
        </button>
      </div>

      <div className="form-card">
        <h3>University Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>University Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={isEditing ? tempConfig.name : config.name}
              onChange={(e) => setTempConfig({ ...tempConfig, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>University Code</label>
            <input
              type="text"
              disabled={!isEditing}
              value={isEditing ? tempConfig.code : config.code}
              onChange={(e) => setTempConfig({ ...tempConfig, code: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              disabled={!isEditing}
              value={isEditing ? tempConfig.email : config.email}
              onChange={(e) => setTempConfig({ ...tempConfig, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              disabled={!isEditing}
              value={isEditing ? tempConfig.phone : config.phone}
              onChange={(e) => setTempConfig({ ...tempConfig, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            disabled={!isEditing}
            value={isEditing ? tempConfig.website : config.website}
            onChange={(e) => setTempConfig({ ...tempConfig, website: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            disabled={!isEditing}
            value={isEditing ? tempConfig.address : config.address}
            onChange={(e) => setTempConfig({ ...tempConfig, address: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              disabled={!isEditing}
              value={isEditing ? tempConfig.city : config.city}
              onChange={(e) => setTempConfig({ ...tempConfig, city: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              disabled={!isEditing}
              value={isEditing ? tempConfig.country : config.country}
              onChange={(e) => setTempConfig({ ...tempConfig, country: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-card">
        <h3>Academic Calendar</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Academic Year Start</label>
            <input
              type="date"
              disabled={!isEditing}
              value={isEditing ? tempConfig.academicCalendarStart : config.academicCalendarStart}
              onChange={(e) => setTempConfig({ ...tempConfig, academicCalendarStart: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Academic Year End</label>
            <input
              type="date"
              disabled={!isEditing}
              value={isEditing ? tempConfig.academicCalendarEnd : config.academicCalendarEnd}
              onChange={(e) => setTempConfig({ ...tempConfig, academicCalendarEnd: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-card">
        <h3>Grading Configuration</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Minimum GPA</label>
            <input
              type="number"
              disabled={!isEditing}
              step="0.1"
              value={isEditing ? tempConfig.minGPA : config.minGPA}
              onChange={(e) => setTempConfig({ ...tempConfig, minGPA: parseFloat(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Maximum GPA</label>
            <input
              type="number"
              disabled={!isEditing}
              step="0.1"
              value={isEditing ? tempConfig.maxGPA : config.maxGPA}
              onChange={(e) => setTempConfig({ ...tempConfig, maxGPA: parseFloat(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Passing Grade</label>
            <select
              disabled={!isEditing}
              value={isEditing ? tempConfig.passingGrade : config.passingGrade}
              onChange={(e) => setTempConfig({ ...tempConfig, passingGrade: e.target.value })}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
