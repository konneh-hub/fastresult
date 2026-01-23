import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import '../admin/AdminPages.css';

interface Department {
  id: string;
  name: string;
  hod: string;
  hodEmail: string;
  passRate: number;
  avgGPA: number;
  status: 'active' | 'archived';
  createdDate: string;
}

export default function DeanDepartments() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Computer Science',
      hod: 'Prof. James Smith',
      hodEmail: 'james.smith@uni.edu',
      passRate: 92,
      avgGPA: 3.68,
      status: 'active',
      createdDate: '2022-01-15',
    },
    {
      id: '2',
      name: 'Mathematics',
      hod: 'Dr. Sarah Johnson',
      hodEmail: 'sarah.johnson@uni.edu',
      passRate: 84,
      avgGPA: 3.25,
      status: 'active',
      createdDate: '2022-01-15',
    },
    {
      id: '3',
      name: 'Physics',
      hod: 'Prof. Ahmed Ali',
      hodEmail: 'ahmed.ali@uni.edu',
      passRate: 76,
      avgGPA: 3.01,
      status: 'active',
      createdDate: '2022-01-15',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hod: '',
    hodEmail: '',
  });

  const handleAddDept = () => {
    if (!formData.name || !formData.hod || !formData.hodEmail) {
      alert('Please fill all required fields');
      return;
    }
    if (editingId) {
      setDepartments(departments.map(d => d.id === editingId ? { ...d, ...formData } : d));
      setEditingId(null);
    } else {
      setDepartments([
        ...departments,
        {
          id: Date.now().toString(),
          ...formData,
          passRate: 85,
          avgGPA: 3.3,
          status: 'active',
          createdDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setFormData({ name: '', hod: '', hodEmail: '' });
    setShowForm(false);
  };

  const handleEdit = (dept: Department) => {
    const { id, passRate, avgGPA, status, createdDate, ...data } = dept;
    setFormData(data);
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Archive this department?')) {
      setDepartments(departments.map(d => d.id === id ? { ...d, status: 'archived' } : d));
    }
  };

  const activeDepts = departments.filter(d => d.status === 'active');

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🏢 Departments</h1>
          <p>Manage departments and assign HODs</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: '', hod: '', hodEmail: '' });
        }}>
          <FiPlus /> New Department
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Department</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Department Name *</label>
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Head of Department (HOD) *</label>
              <input
                type="text"
                placeholder="Prof. John Doe"
                value={formData.hod}
                onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>HOD Email *</label>
              <input
                type="email"
                placeholder="hod@uni.edu"
                value={formData.hodEmail}
                onChange={(e) => setFormData({ ...formData, hodEmail: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={handleAddDept}>
              {editingId ? 'Update' : 'Create'} Department
            </button>
            <button className="btn-secondary" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({ name: '', hod: '', hodEmail: '' });
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
              <th>Department Name</th>
              <th>Head of Department</th>
              <th>Email</th>
              <th>Pass Rate</th>
              <th>Avg GPA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeDepts.map(dept => (
              <tr key={dept.id}>
                <td><strong>{dept.name}</strong></td>
                <td>{dept.hod}</td>
                <td>{dept.hodEmail}</td>
                <td>{dept.passRate}%</td>
                <td>{dept.avgGPA.toFixed(2)}</td>
                <td>
                  <span className="badge badge-success">{dept.status}</span>
                </td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => handleEdit(dept)}>
                    <FiEdit /> Edit
                  </button>
                  <button className="btn-sm btn-delete" onClick={() => handleDelete(dept.id)}>
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
