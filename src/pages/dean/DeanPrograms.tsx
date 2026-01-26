import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface Program {
  id: string;
  name: string;
  degree: 'BSc' | 'BA' | 'MSc' | 'Diploma';
  duration: number;
  creditLimit: number;
  departments: string[];
  status: 'active' | 'archived';
  createdDate: string;
}

export default function DeanPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    degree: 'BSc' as const,
    duration: 4,
    creditLimit: 120,
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/dean/${user.id}/programs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPrograms(data);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);

  const handleAddProgram = () => {
    if (!formData.name) {
      alert('Please fill all required fields');
      return;
    }
    if (editingId) {
      setPrograms(programs.map(p => p.id === editingId ? { ...p, ...formData } : p));
      setEditingId(null);
    } else {
      setPrograms([
        ...programs,
        {
          id: Date.now().toString(),
          ...formData,
          departments: [],
          status: 'active',
          createdDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setFormData({ name: '', degree: 'BSc', duration: 4, creditLimit: 120 });
    setShowForm(false);
  };

  const handleEdit = (prog: Program) => {
    const { id, departments, status, createdDate, ...data } = prog;
    setFormData(data);
    setEditingId(prog.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Archive this program?')) {
      setPrograms(programs.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    }
  };

  const activePrograms = programs.filter(p => p.status === 'active');

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📚 Academic Programs</h1>
          <p>Create and manage academic programs</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: '', degree: 'BSc', duration: 4, creditLimit: 120 });
        }}>
          <FiPlus /> New Program
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Program</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Program Name *</label>
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Degree Type *</label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value as any })}
              >
                <option value="BSc">BSc (Bachelor of Science)</option>
                <option value="BA">BA (Bachelor of Arts)</option>
                <option value="MSc">MSc (Master of Science)</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (years)</label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Credit Limit</label>
              <input
                type="number"
                min="30"
                max="200"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={handleAddProgram}>
              {editingId ? 'Update' : 'Create'} Program
            </button>
            <button className="btn-secondary" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({ name: '', degree: 'BSc', duration: 4, creditLimit: 120 });
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Degree Type</th>
              <th>Duration</th>
              <th>Credit Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activePrograms.map(prog => (
              <tr key={prog.id}>
                <td><strong>{prog.name}</strong></td>
                <td>{prog.degree}</td>
                <td>{prog.duration} years</td>
                <td>{prog.creditLimit} credits</td>
                <td>
                  <span className="badge badge-success">{prog.status}</span>
                </td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => handleEdit(prog)}>
                    <FiEdit /> Edit
                  </button>
                  <button className="btn-sm btn-delete" onClick={() => handleDelete(prog.id)}>
                    <FiTrash2 /> Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
