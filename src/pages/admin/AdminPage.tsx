import React from 'react';

interface PageProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function AdminPage({ title, subtitle, icon }: PageProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{icon && `${icon} `}{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ color: '#666', marginBottom: '10px' }}>Page Content Coming Soon</h2>
        <p style={{ color: '#999' }}>This page is being developed. Check back soon for updates.</p>
      </div>
    </div>
  );
}
