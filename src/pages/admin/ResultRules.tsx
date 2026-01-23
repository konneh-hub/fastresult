import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './AdminPages.css';

interface ResultRule {
  id: string;
  name: string;
  description: string;
  gradeThreshold: number;
  action: 'promote' | 'repeat' | 'supplement' | 'withhold';
  status: 'active' | 'inactive';
}

export default function ResultRules() {
  const [rules, setRules] = useState<ResultRule[]>([
    { id: '1', name: 'Pass Rule', description: 'Student passes if score >= 40%', gradeThreshold: 40, action: 'promote', status: 'active' },
    { id: '2', name: 'Supplement Rule', description: 'Supplement exam for 30-39%', gradeThreshold: 30, action: 'supplement', status: 'active' },
    { id: '3', name: 'Repeat Rule', description: 'Repeat course if score < 30%', gradeThreshold: 0, action: 'repeat', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gradeThreshold: 40,
    action: 'promote' as const,
  });

  const handleAddRule = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill all fields');
      return;
    }
    if (editingId) {
      setRules(rules.map(r => r.id === editingId ? { ...r, ...formData } : r));
      setEditingId(null);
    } else {
      setRules([...rules, { id: Date.now().toString(), ...formData, status: 'active' }]);
    }
    setFormData({ name: '', description: '', gradeThreshold: 40, action: 'promote' });
    setShowForm(false);
  };

  const handleEdit = (rule: ResultRule) => {
    setFormData({ name: rule.name, description: rule.description, gradeThreshold: rule.gradeThreshold, action: rule.action });
    setEditingId(rule.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this rule?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>⚙️ Result Rules</h1>
          <p>Configure result processing rules and automation.</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', description: '', gradeThreshold: 40, action: 'promote' }); }}>
          <FiPlus /> Add Rule
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit' : 'Create'} Result Rule</h3>
          <div className="form-group">
            <label>Rule Name</label>
            <input type="text" placeholder="e.g., Pass Rule" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Describe when this rule applies" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Grade Threshold (%)</label>
              <input type="number" min="0" max="100" value={formData.gradeThreshold} onChange={(e) => setFormData({ ...formData, gradeThreshold: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Action</label>
              <select value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value as any })}>
                <option value="promote">Promote</option>
                <option value="repeat">Repeat Course</option>
                <option value="supplement">Supplement Exam</option>
                <option value="withhold">Withhold Result</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAddRule}>{editingId ? 'Update' : 'Create'} Rule</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Description</th>
              <th>Threshold</th>
              <th>Action</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.id}>
                <td className="font-semibold">{rule.name}</td>
                <td>{rule.description}</td>
                <td>{rule.gradeThreshold}%</td>
                <td><span className="badge">{rule.action}</span></td>
                <td><span className={`status-badge status-${rule.status}`}>{rule.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-sm" onClick={() => handleEdit(rule)}><FiEdit /></button>
                  <button className="btn-sm" onClick={() => toggleStatus(rule.id)}>Toggle</button>
                  <button className="btn-sm" onClick={() => handleDelete(rule.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}