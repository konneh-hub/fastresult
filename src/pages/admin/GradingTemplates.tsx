import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface GradeScale {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  gpaValue: number;
  description: string;
}

interface GradingTemplate {
  id: string;
  name: string;
  type: '4.0' | '5.0';
  passMark: number;
  grades: GradeScale[];
}

export default function GradingTemplates() {
  const [templates, setTemplates] = useState<GradingTemplate[]>([
    {
      id: '1',
      name: 'Standard 4.0 Scale',
      type: '4.0',
      passMark: 40,
      grades: [
        { id: '1', grade: 'A', minScore: 80, maxScore: 100, gpaValue: 4.0, description: 'Excellent' },
        { id: '2', grade: 'B', minScore: 70, maxScore: 79, gpaValue: 3.0, description: 'Good' },
        { id: '3', grade: 'C', minScore: 60, maxScore: 69, gpaValue: 2.0, description: 'Average' },
        { id: '4', grade: 'D', minScore: 50, maxScore: 59, gpaValue: 1.0, description: 'Pass' },
        { id: '5', grade: 'F', minScore: 0, maxScore: 49, gpaValue: 0.0, description: 'Fail' },
      ]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; type: '4.0' | '5.0'; passMark: number }>({ name: '', type: '4.0', passMark: 40 });

  const handleAddTemplate = () => {
    if (!formData.name) {
      alert('Please enter template name');
      return;
    }
    if (editingId) {
      setTemplates(templates.map(t => t.id === editingId ? { ...t, name: formData.name, type: formData.type, passMark: formData.passMark } : t));
      setEditingId(null);
    } else {
      setTemplates([...templates, { id: Date.now().toString(), ...formData, grades: [] }]);
    }
    setFormData({ name: '', type: '4.0', passMark: 40 });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📝 Grading Templates</h1>
          <p>Define global grading templates with grade letters and GPA values. Templates are applied by Deans.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
          <FiPlus /> New Template
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Grading Template</h3>
          <div className="form-group">
            <label>Template Name</label>
            <input type="text" placeholder="e.g., Standard 4.0 Scale" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GPA Scale</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as ('4.0' | '5.0')})}>
                <option value="4.0">4.0 Scale</option>
                <option value="5.0">5.0 Scale</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pass Mark (%)</label>
              <input type="number" min="0" max="100" value={formData.passMark} onChange={(e) => setFormData({...formData, passMark: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddTemplate}>{editingId ? 'Update' : 'Create'} Template</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', type: '4.0', passMark: 40 }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <div>
                <h3>{template.name}</h3>
                <p>{template.type} Scale | Pass Mark: {template.passMark}%</p>
              </div>
              <div className="action-buttons">
                <button className="btn-sm" onClick={() => {
                  setFormData({ name: template.name, type: template.type as ('4.0' | '5.0'), passMark: template.passMark });
                  setEditingId(template.id);
                  setShowForm(true);
                }}><FiEdit /></button>
                <button className="btn-sm" onClick={() => handleDelete(template.id)}><FiTrash2 /></button>
              </div>
            </div>
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Grade</th>
                  <th>Min Score</th>
                  <th>Max Score</th>
                  <th>GPA Value</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {template.grades.map(g => (
                  <tr key={g.id}>
                    <td className="font-semibold">{g.grade}</td>
                    <td>{g.minScore}%</td>
                    <td>{g.maxScore}%</td>
                    <td>{g.gpaValue.toFixed(1)}</td>
                    <td>{g.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}