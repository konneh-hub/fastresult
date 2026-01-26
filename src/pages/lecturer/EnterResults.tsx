import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiDownload, FiCheck } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface StudentResult {
  id: string;
  matricNo: string;
  name: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  department: string;
  program: string;
  level: string;
  score: number;
  grade: string;
  status: 'draft' | 'submitted';
  enteredDate: string;
}

export default function EnterResults() {
  const faculties = [
    "Faculty of Science",
    "Faculty of Engineering",
    "Faculty of Arts",
    "Faculty of Law"
  ];

  const departments = {
    "Faculty of Science": ["Computer Science", "Mathematics", "Physics"],
    "Faculty of Engineering": ["Civil Engineering", "Mechanical Engineering"],
    "Faculty of Arts": ["History", "English", "Philosophy"],
    "Faculty of Law": ["Public Law", "Private Law"]
  };

  const programs = {
    "Computer Science": ["BSc Computer Science", "BSc Software Engineering"],
    "Mathematics": ["BSc Mathematics", "BSc Applied Mathematics"],
    "Physics": ["BSc Physics", "BSc Theoretical Physics"],
    "Civil Engineering": ["BEng Civil Engineering"],
    "Mechanical Engineering": ["BEng Mechanical Engineering"],
    "History": ["BA History"],
    "English": ["BA English"],
    "Philosophy": ["BA Philosophy"],
    "Public Law": ["LLB Public Law"],
    "Private Law": ["LLB Private Law"]
  };

  const levels = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

  const [results, setResults] = useState<StudentResult[]>([]);

  const [filters, setFilters] = useState({
    faculty: '',
    department: '',
    program: '',
    level: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StudentResult>>({
    matricNo: '',
    name: '',
    courseCode: '',
    courseName: '',
    faculty: '',
    department: '',
    program: '',
    level: '',
    score: 0,
    status: 'draft'
  });

  // Load real results from backend
  useEffect(() => {
    const loadResults = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch lecturer's course results
        const response = await fetch(`http://localhost:5000/api/results/lecturer/${user.id}`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const data = await response.json();
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.log('Could not fetch results from backend. Using empty list.');
        setResults([]);
      }
    };

    loadResults();
  }, []);

  const getGrade = (score: number): string => {
    if (score >= 80) return 'A';
    if (score >= 75) return 'A-';
    if (score >= 70) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 60) return 'B-';
    if (score >= 55) return 'C+';
    if (score >= 50) return 'C';
    if (score >= 45) return 'C-';
    if (score >= 40) return 'D';
    return 'F';
  };

  const handleAddResult = () => {
    if (!formData.matricNo || !formData.name || !formData.courseCode || !formData.faculty) {
      alert('❌ Please fill all required fields');
      return;
    }

    if (editingId) {
      setResults(results.map(r => r.id === editingId ? {
        ...r,
        ...formData,
        score: formData.score || 0,
        grade: getGrade(formData.score || 0),
        enteredDate: r.enteredDate
      } as StudentResult : r));
      alert('✅ Result updated successfully');
      setEditingId(null);
    } else {
      const newResult: StudentResult = {
        id: String(Date.now()),
        matricNo: formData.matricNo,
        name: formData.name,
        courseCode: formData.courseCode,
        courseName: formData.courseName || '',
        faculty: formData.faculty,
        department: formData.department || '',
        program: formData.program || '',
        level: formData.level || '',
        score: formData.score || 0,
        grade: getGrade(formData.score || 0),
        status: 'draft',
        enteredDate: new Date().toISOString().split('T')[0]
      };
      setResults([...results, newResult]);
      alert('✅ Result added successfully');
    }
    
    setFormData({
      matricNo: '',
      name: '',
      courseCode: '',
      courseName: '',
      faculty: '',
      department: '',
      program: '',
      level: '',
      score: 0,
      status: 'draft'
    });
    setShowForm(false);
  };

  const handleEdit = (result: StudentResult) => {
    setFormData(result);
    setEditingId(result.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this result?')) {
      setResults(results.filter(r => r.id !== id));
      alert('✅ Result deleted');
    }
  };

  const handleSubmit = (id: string) => {
    setResults(results.map(r => r.id === id ? { ...r, status: 'submitted' } : r));
    alert('✅ Result submitted to exam officer');
  };

  const filteredResults = results.filter(r => {
    if (filters.faculty && r.faculty !== filters.faculty) return false;
    if (filters.department && r.department !== filters.department) return false;
    if (filters.program && r.program !== filters.program) return false;
    if (filters.level && r.level !== filters.level) return false;
    return true;
  });

  const stats = {
    total: results.length,
    draft: results.filter(r => r.status === 'draft').length,
    submitted: results.filter(r => r.status === 'submitted').length
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>✏️ Enter Student Results</h1>
          <p>Input and manage grades for your students</p>
        </div>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card" style={{ borderLeftColor: '#3B82F6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Total Results</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#FF9800' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Drafts</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>{stats.draft}</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#22C55E' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748B' }}>Submitted</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#22C55E' }}>{stats.submitted}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: '#F8FAFC',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #E2E8F0'
      }}>
        <h3 style={{ marginTop: 0 }}>🔍 Filter Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Faculty</label>
            <select
              value={filters.faculty}
              onChange={(e) => setFilters({ ...filters, faculty: e.target.value, department: '', program: '' })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Faculties</option>
              {faculties.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value, program: '' })}
              disabled={!filters.faculty}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '1rem',
                opacity: !filters.faculty ? 0.5 : 1
              }}
            >
              <option value="">All Departments</option>
              {filters.faculty && departments[filters.faculty as keyof typeof departments]?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Program</label>
            <select
              value={filters.program}
              onChange={(e) => setFilters({ ...filters, program: e.target.value })}
              disabled={!filters.department}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '1rem',
                opacity: !filters.department ? 0.5 : 1
              }}
            >
              <option value="">All Programs</option>
              {filters.department && programs[filters.department as keyof typeof programs]?.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Level/Year</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">All Levels</option>
              {levels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Result Form */}
      {showForm && (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '2px solid #3B82F6'
        }}>
          <h3>{editingId ? '✏️ Edit Result' : '➕ Add New Result'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Student Matric No *</label>
              <input
                type="text"
                placeholder="e.g., CS/2021/001"
                value={formData.matricNo || ''}
                onChange={(e) => setFormData({ ...formData, matricNo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Student Name *</label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Course Code *</label>
              <input
                type="text"
                placeholder="e.g., CS301"
                value={formData.courseCode || ''}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Course Name</label>
              <input
                type="text"
                placeholder="Course title"
                value={formData.courseName || ''}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Faculty *</label>
              <select
                value={formData.faculty || ''}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value, department: '', program: '' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Faculty</option>
                {faculties.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Department</label>
              <select
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value, program: '' })}
                disabled={!formData.faculty}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  opacity: !formData.faculty ? 0.5 : 1
                }}
              >
                <option value="">Select Department</option>
                {formData.faculty && departments[formData.faculty as keyof typeof departments]?.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Program</label>
              <select
                value={formData.program || ''}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                disabled={!formData.department}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  opacity: !formData.department ? 0.5 : 1
                }}
              >
                <option value="">Select Program</option>
                {formData.department && programs[formData.department as keyof typeof programs]?.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Level/Year</label>
              <select
                value={formData.level || ''}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Level</option>
                {levels.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Score (0-100) *</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={formData.score || 0}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Grade</label>
              <input
                type="text"
                disabled
                value={getGrade(formData.score || 0)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  background: '#F0F4F8'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleAddResult}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              <FiSave /> {editingId ? 'Update' : 'Add'} Result
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ matricNo: '', name: '', courseCode: '', courseName: '', faculty: '', department: '', program: '', level: '', score: 0, status: 'draft' });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#E2E8F0',
                color: '#1e293b',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Result Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            marginBottom: '2rem'
          }}
        >
          <FiPlus /> Add Result
        </button>
      )}

      {/* Results Table */}
      <div className="table-card">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Matric No</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Faculty</th>
              <th>Department</th>
              <th>Program</th>
              <th>Level</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map(result => (
              <tr key={result.id}>
                <td style={{ fontWeight: 600 }}>{result.matricNo}</td>
                <td>{result.name}</td>
                <td>{result.courseCode}</td>
                <td style={{ fontSize: '0.9rem' }}>{result.faculty}</td>
                <td style={{ fontSize: '0.9rem' }}>{result.department}</td>
                <td style={{ fontSize: '0.9rem' }}>{result.program}</td>
                <td style={{ textAlign: 'center' }}>{result.level}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{result.score}</td>
                <td style={{ textAlign: 'center', fontWeight: 600, color: result.score >= 70 ? '#22C55E' : result.score >= 50 ? '#FF9800' : '#EF4444' }}>
                  {result.grade}
                </td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: result.status === 'submitted' ? '#D1FAE5' : '#FEF3C7',
                    color: result.status === 'submitted' ? '#047857' : '#92400E'
                  }}>
                    {result.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    onClick={() => handleEdit(result)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#3B82F6',
                      fontSize: '1.2rem'
                    }}
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  {result.status === 'draft' && (
                    <button
                      onClick={() => handleSubmit(result.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#22C55E',
                        fontSize: '1.2rem'
                      }}
                      title="Submit"
                    >
                      <FiCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(result.id)}
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

      {filteredResults.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748B',
          fontSize: '1.1rem'
        }}>
          📭 No results found. Add a new result to get started!
        </div>
      )}
    </div>
  );
}
