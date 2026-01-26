import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ACADEMIC_LEVELS, PROGRAM_TYPES, DEPARTMENTS } from '../../config/constants';

interface Student {
  id: string;
  name: string;
  matricNo: string;
  email: string;
  department: string;
  program: string;
  level: string;
  gpa: number;
  status: 'active' | 'inactive' | 'graduated';
}

export default function ManageFacultyStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const departments = DEPARTMENTS;
  const programs = PROGRAM_TYPES;
  const levels = ACADEMIC_LEVELS;

  const [formData, setFormData] = useState({
    name: '',
    matricNo: '',
    email: '',
    department: '',
    program: '',
    level: '',
  });

  // Fetch students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/students', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        console.warn('Could not fetch students:', response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const transformedStudents: Student[] = (data || []).map((student: any) => ({
        id: student.id?.toString() || student.user_id?.toString(),
        name: student.full_name || student.name || 'Unknown',
        matricNo: student.matric_no || student.matricNo || '',
        email: student.email || '',
        department: student.department || '',
        program: student.program || '',
        level: student.level_id?.toString() || student.level || '',
        gpa: parseFloat(student.gpa) || 0,
        status: student.status || 'active',
      }));

      setStudents(transformedStudents);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment;
    const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
    const matchesLevel = selectedLevel === 'all' || student.level === selectedLevel;

    return matchesSearch && matchesDepartment && matchesProgram && matchesLevel;
  });

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      matricNo: student.matricNo,
      email: student.email,
      department: student.department,
      program: student.program,
      level: student.level,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((s) => s.id !== id));
      alert('Student deleted successfully');
    }
  };

  const handleSaveForm = async () => {
    if (!formData.name || !formData.email || !formData.matricNo) {
      alert('Please fill all required fields');
      return;
    }

    if (editingId) {
      setStudents(
        students.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                email: formData.email,
                matricNo: formData.matricNo,
                department: formData.department,
                program: formData.program,
                level: formData.level,
              }
            : s
        )
      );
      alert('Student updated successfully');
    }

    setFormData({ name: '', matricNo: '', email: '', department: '', program: '', level: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Matric No', 'Email', 'Department', 'Program', 'Level', 'GPA', 'Status'],
      ...filteredStudents.map((s) => [s.name, s.matricNo, s.email, s.department, s.program, s.level, s.gpa, s.status]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty_students.csv';
    a.click();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 600 }}>Faculty Students Management</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>Manage and track student information by department, program, and level</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#E3F2FD', padding: '1.5rem', borderRadius: '8px', border: '1px solid #BBDEFB' }}>
          <div style={{ fontSize: '0.85rem', color: '#1976D2', fontWeight: 600 }}>Total Students</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0D47A1', marginTop: '0.5rem' }}>{students.length}</div>
        </div>
        <div style={{ background: '#F3E5F5', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E1BEE7' }}>
          <div style={{ fontSize: '0.85rem', color: '#7B1FA2', fontWeight: 600 }}>Active Students</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4A148C', marginTop: '0.5rem' }}>
            {students.filter((s) => s.status === 'active').length}
          </div>
        </div>
        <div style={{ background: '#E8F5E9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #C8E6C9' }}>
          <div style={{ fontSize: '0.85rem', color: '#388E3C', fontWeight: 600 }}>Departments</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1B5E20', marginTop: '0.5rem' }}>{departments.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <FiFilter size={20} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Filter & Search</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              <FiSearch size={16} style={{ marginRight: '0.5rem' }} />
              Search (Name, Matric No, Email)
            </label>
            <input
              type="text"
              placeholder="Enter search term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Department Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Program Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              Program
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="all">All Programs</option>
              {programs.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              Level/Year
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="all">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleExport}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#45a049')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#4CAF50')}
            >
              <FiDownload size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No students found. Try adjusting your filters.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F5F5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>Matric No</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>Department</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>Program</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>Level</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#333' }}>GPA</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#333' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')} onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                    <td style={{ padding: '1rem' }}>{student.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <code style={{ background: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.85rem' }}>{student.matricNo}</code>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{student.email}</td>
                    <td style={{ padding: '1rem' }}>{student.department}</td>
                    <td style={{ padding: '1rem' }}>{student.program}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>Level {student.level}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: student.gpa >= 3.5 ? '#4CAF50' : student.gpa >= 2.5 ? '#FF9800' : '#F44336' }}>
                      {student.gpa.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(student)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.5rem 0.75rem',
                          cursor: 'pointer',
                          marginRight: '0.5rem',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        style={{
                          background: '#F44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.5rem 0.75rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {editingId ? 'Edit Student' : 'Add New Student'}
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Matric No *</label>
              <input
                type="text"
                value={formData.matricNo}
                onChange={(e) => setFormData({ ...formData, matricNo: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Program</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              >
                <option value="">Select Program</option>
                {programs.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Level/Year</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
              >
                <option value="">Select Level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', matricNo: '', email: '', department: '', program: '', level: '' });
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ddd',
                  background: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveForm}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
