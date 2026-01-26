import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import './AdminPages.css';
import { PROGRAM_TYPES } from '../../config/constants';

interface Program {
  id: string;
  name: string;
  code: string;
  faculty: string;
  duration: string;
  type: 'Degree' | 'Diploma' | 'Masters' | 'Ordinary Diploma' | 'Certificate';
  semester: number;
  status: 'active' | 'inactive';
  students: number;
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([
    { id: '1', name: 'Bachelor of Computer Science', code: 'BCS', faculty: 'Science', duration: '4 years', type: 'Degree', semester: 8, status: 'active', students: 240 },
    { id: '2', name: 'Bachelor of Engineering', code: 'BEng', faculty: 'Engineering', duration: '4 years', type: 'Degree', semester: 8, status: 'active', students: 180 },
    { id: '3', name: 'Master of Science in CS', code: 'MCS', faculty: 'Science', duration: '2 years', type: 'Masters', semester: 4, status: 'active', students: 60 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    faculty: '',
    duration: '',
    type: 'Degree' as const,
    semester: 8,
  });

  const handleAdd = () => {
    if (!formData.name || !formData.code) {
      alert('Please fill required fields');
      return;
    }
    if (editingId) {
      setPrograms(programs.map(p => p.id === editingId ? { ...p, ...formData } : p));
      setEditingId(null);
    } else {
      setPrograms([...programs, { id: Date.now().toString(), ...formData, status: 'active', students: 0 }]);
    }
    setFormData({ name: '', code: '', faculty: '', duration: '', type: 'Degree', semester: 8 });
    setShowForm(false);
  };

  const handleEdit = (program: Program) => {
    const { id, status, students, ...data } = program;
    setFormData(data);
    setEditingId(program.id);
    setShowForm(true);
  };

  const toggleStatus = (id: string) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this program?')) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📚 Academic Programs</h1>
          <p>Manage degree programs and academic offerings.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', code: '', faculty: '', duration: '', type: 'Degree', semester: 8 }); }}>
          <FiPlus /> Add Program
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Add'} Program</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Program Name</label>
              <input type="text" placeholder="Bachelor of Science" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Program Code</label>
              <input type="text" placeholder="BSc" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Faculty</label>
              <input type="text" placeholder="Science" value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input type="text" placeholder="4 years" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
                {PROGRAM_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Total Semesters</label>
              <input type="number" min="1" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAdd}>{editingId ? 'Update' : 'Add'} Program</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Code</th>
              <th>Faculty</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Semesters</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(program => (
              <tr key={program.id}>
                <td className="font-semibold">{program.name}</td>
                <td>{program.code}</td>
                <td>{program.faculty}</td>
                <td>{program.type}</td>
                <td>{program.duration}</td>
                <td>{program.semester}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{program.students}</td>
                <td><span className={`status-badge status-${program.status}`}>{program.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(program)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => toggleStatus(program.id)}>Toggle</button>
                  <button className="btn-sm" onClick={() => handleDelete(program.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}