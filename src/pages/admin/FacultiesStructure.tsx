import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface Faculty {
  id: string;
  name: string;
  code: string;
  dean: string;
  departments: number;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export default function FacultiesStructure() {
  const [faculties, setFaculties] = useState<Faculty[]>([
    { id: '1', name: 'Faculty of Science', code: 'FOS', dean: 'Prof. Adams', departments: 5, email: 'fos@uni.edu', phone: '+1-123-456', status: 'active' },
    { id: '2', name: 'Faculty of Engineering', code: 'FOE', dean: 'Prof. Smith', departments: 4, email: 'foe@uni.edu', phone: '+1-123-457', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', dean: '', email: '', phone: '' });

  const handleAddFaculty = () => {
    if (!formData.name || !formData.code) {
      alert('Please fill required fields');
      return;
    }
    if (editingId) {
      setFaculties(faculties.map(f => f.id === editingId ? { ...f, ...formData } : f));
      setEditingId(null);
    } else {
      setFaculties([...faculties, { id: Date.now().toString(), ...formData, departments: 0, status: 'active' }]);
    }
    setFormData({ name: '', code: '', dean: '', email: '', phone: '' });
    setShowForm(false);
  };

  const handleEdit = (faculty: Faculty) => {
    setFormData({ name: faculty.name, code: faculty.code, dean: faculty.dean, email: faculty.email, phone: faculty.phone });
    setEditingId(faculty.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this faculty?')) {
      setFaculties(faculties.filter(f => f.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>🏛️ Faculties & Structure</h1>
          <p>Manage academic faculties and organizational structure.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', code: '', dean: '', email: '', phone: '' }); }}>
          <FiPlus /> Add Faculty
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Faculty</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Faculty Name</label>
              <input type="text" placeholder="Faculty of Science" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Faculty Code</label>
              <input type="text" placeholder="FOS" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Dean Name</label>
              <input type="text" placeholder="Prof. Name" value={formData.dean} onChange={(e) => setFormData({ ...formData, dean: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="faculty@uni.edu" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+1-123-456" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddFaculty}>{editingId ? 'Update' : 'Create'} Faculty</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Code</th>
              <th>Dean</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Departments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map(faculty => (
              <tr key={faculty.id}>
                <td className="font-semibold">{faculty.name}</td>
                <td>{faculty.code}</td>
                <td>{faculty.dean}</td>
                <td>{faculty.email}</td>
                <td>{faculty.phone}</td>
                <td className="text-center">{faculty.departments}</td>
                <td><span className={`status-badge status-${faculty.status}`}>{faculty.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(faculty)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => handleDelete(faculty.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}