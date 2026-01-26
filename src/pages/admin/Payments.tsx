import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import './AdminPages.css';

interface Payment {
  id: string;
  studentName: string;
  amount: number;
  type: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('authToken');
        if (!user.id || !token) return;

        const response = await fetch(`http://localhost:5000/api/admin/${user.id}/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || p.reference.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const exportData = () => {
    const csv = ['Student,Amount,Type,Date,Status,Reference'].concat(
      filteredPayments.map(p => `${p.studentName},${p.amount},${p.type},${p.date},${p.status},${p.reference}`)
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>💳 Payments & Transactions</h1>
          <p>Manage student payments and financial transactions.</p>
        </div>
        <button className="btn-primary" onClick={exportData}>
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="form-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Total Amount</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#28a745' }}>Rs. {totalAmount.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Completed</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#007bff' }}>{payments.filter(p => p.status === 'completed').length}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Pending</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#ffc107' }}>{payments.filter(p => p.status === 'pending').length}</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by student name or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td className="font-semibold">{payment.studentName}</td>
                <td>Rs. {payment.amount.toLocaleString()}</td>
                <td>{payment.type}</td>
                <td>{payment.date}</td>
                <td><span className={`status-badge status-${payment.status}`}>{payment.status}</span></td>
                <td style={{ fontSize: '0.9em', color: '#666' }}>{payment.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}