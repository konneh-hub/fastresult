import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface Course {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  credits: number;
  level: number;
  prerequisites: string;
  status: 'active' | 'archived';
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', code: 'CS101', title: 'Introduction to Programming', faculty: 'Science', department: 'Computer Science', credits: 3, level: 100, prerequisites: 'None', status: 'active' },
    { id: '2', code: 'CS201', title: 'Data Structures', faculty: 'Science', department: 'Computer Science', credits: 4, level: 200, prerequisites: 'CS101', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    faculty: '',
    department: '',
    credits: 3,
    level: 100,
    prerequisites: '',
  });

  const handleAddCourse = () => {
    if (!formData.code || !formData.title) {
      alert('Please fill required fields');
      return;
    }
    if (editingId) {
      setCourses(courses.map(c => c.id === editingId ? { ...c, ...formData } : c));
      setEditingId(null);
    } else {
      setCourses([...courses, { id: Date.now().toString(), ...formData, status: 'active' }]);
    }
    setFormData({ code: '', title: '', faculty: '', department: '', credits: 3, level: 100, prerequisites: '' });
    setShowForm(false);
  };

  const handleEdit = (course: Course) => {
    const { id, status, ...data } = course;
    setFormData(data);
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'archived' : 'active' } : c));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📖 Courses & Modules</h1>
          <p>Manage all courses and academic modules.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ code: '', title: '', faculty: '', department: '', credits: 3, level: 100, prerequisites: '' }); }}>
          <FiPlus /> Add Course
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Course</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Course Code</label>
              <input type="text" placeholder="CS101" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Course Title</label>
              <input type="text" placeholder="Introduction to Programming" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Faculty</label>
              <input type="text" placeholder="Science" value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" placeholder="Computer Science" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Credits</label>
              <input type="number" min="1" max="6" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Level</label>
              <input type="number" min="100" max="400" step="100" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Prerequisites</label>
              <input type="text" placeholder="None" value={formData.prerequisites} onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddCourse}>{editingId ? 'Update' : 'Create'} Course</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Faculty</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Level</th>
              <th>Prerequisites</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td className="font-semibold">{course.code}</td>
                <td>{course.title}</td>
                <td>{course.faculty}</td>
                <td>{course.department}</td>
                <td className="text-center">{course.credits}</td>
                <td className="text-center">{course.level}</td>
                <td>{course.prerequisites}</td>
                <td><span className={`status-badge status-${course.status}`}>{course.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(course)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => toggleStatus(course.id)}>Toggle</button>
                  <button className="btn-sm" onClick={() => handleDelete(course.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}