import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './EnhancedLayout.css';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [viewAsUser, setViewAsUser] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const menuSections = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', path: '/admin', icon: '📊' },
      ],
    },
    {
      title: 'User Management',
      items: [
        { label: 'Account Management', path: '/admin/account-management', icon: '👥' },
        { label: 'Student Verification', path: '/admin/student-verification', icon: '✓' },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { label: 'University Setup', path: '/admin/university-setup', icon: '🏛️' },
        { label: 'Academic Sessions', path: '/admin/academic-sessions', icon: '📅' },
        { label: 'Semesters/Terms', path: '/admin/semesters', icon: '📆' },
        { label: 'Grading Templates', path: '/admin/grading-templates', icon: '📝' },
        { label: 'Result Rules', path: '/admin/result-rules', icon: '⚙️' },
      ],
    },
    {
      title: 'Organization',
      items: [
        { label: 'Faculties & Structure', path: '/admin/faculties-structure', icon: '🏢' },
        { label: 'Departments', path: '/admin/departments', icon: '🏘️' },
        { label: 'Programs', path: '/admin/programs', icon: '📚' },
        { label: 'Courses/Modules', path: '/admin/courses', icon: '📖' },
      ],
    },
    {
      title: 'Access & Security',
      items: [
        { label: 'Users & Roles', path: '/admin/users-roles', icon: '👥' },
        { label: 'User Accounts', path: '/admin/user-accounts', icon: '👤' },
        { label: 'Role Assignment', path: '/admin/role-assignment', icon: '🔐' },
        { label: 'Permissions', path: '/admin/permissions', icon: '🔑' },
        { label: 'Role-Permission Matrix', path: '/admin/role-permission-matrix', icon: '🗂️' },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: '📋' },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Backups', path: '/admin/backups', icon: '💾' },
        { label: 'Backup Schedule', path: '/admin/backup-schedule', icon: '⏰' },
        { label: 'Restore', path: '/admin/restore', icon: '♻️' },
        { label: 'Integrations', path: '/admin/integrations', icon: '🔗' },
        { label: 'Email Integration', path: '/admin/email-integration', icon: '📧' },
        { label: 'SMS Integration', path: '/admin/sms-integration', icon: '📱' },
        { label: 'LMS Integration', path: '/admin/lms-integration', icon: '🌐' },
        { label: 'Payments', path: '/admin/payments', icon: '💳' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Tickets', path: '/admin/tickets', icon: '🎫' },
        { label: 'Escalations', path: '/admin/escalations', icon: '📢' },
        { label: 'Help & Support', path: '/admin/support', icon: '❓' },
      ],
    },
    {
      title: 'User Settings',
      items: [
        { label: 'Profile Settings', path: '/admin/profile-settings', icon: '👤' },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="role-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">⚙️</div>
          <h2 className="sidebar-title">Admin Panel</h2>
        </div>

        <nav className="sidebar-content">
          {menuSections.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <h3 className="sidebar-section-title">{section.title}</h3>
              <ul className="sidebar-menu">
                {section.items.map((item) => (
                  <li key={item.path} className="sidebar-item">
                    <Link
                      to={item.path}
                      className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.85)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="main-container">
        {/* TOPBAR */}
        <div className="topbar">
          {/* LEFT: BREADCRUMB */}
          <div className="topbar-left">
            <div className="breadcrumb">
              Admin / <span style={{ fontWeight: 600, color: '#1e3c72' }}>Dashboard</span>
            </div>
          </div>

          {/* CENTER: SEARCH */}
          <div className="topbar-center">
            <div className="search-box">
              <span style={{ fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search pages, users, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT: ACTIONS & PROFILE */}
          <div className="topbar-right">
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-button"
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                <span className="notification-badge">3</span>
              </button>
              {showNotifications && (
                <div className="dropdown-menu" style={{ right: 0, width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                  <div style={{ padding: '10px 12px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>Notifications</div>
                  <button className="dropdown-item">System maintenance scheduled for tonight</button>
                  <button className="dropdown-item">3 new user registrations pending approval</button>
                  <button className="dropdown-item">Backup completed successfully</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" style={{ justifyContent: 'center', color: '#2a5298' }}>View All</button>
                </div>
              )}
            </div>

            {/* System Status */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-button"
                title="System Status"
                onClick={() => setShowSystemStatus(!showSystemStatus)}
              >
                ✅
              </button>
              {showSystemStatus && (
                <div className="dropdown-menu" style={{ right: 0, width: '250px' }}>
                  <div style={{ padding: '10px 12px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>System Status</div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em' }}>
                      <span>API Server</span>
                      <span style={{ color: '#28a745' }}>✓ Healthy</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em' }}>
                      <span>Database</span>
                      <span style={{ color: '#28a745' }}>✓ Healthy</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em' }}>
                      <span>Email Service</span>
                      <span style={{ color: '#28a745' }}>✓ Healthy</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9em' }}>
                      <span>Storage</span>
                      <span style={{ color: '#28a745' }}>✓ 87% Used</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Maintenance Mode */}
            <button
              className="topbar-button"
              title={maintenanceMode ? 'Maintenance Mode: ON' : 'Maintenance Mode: OFF'}
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                alert(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
              }}
              style={{
                background: maintenanceMode ? 'rgba(255,193,7,0.2)' : 'transparent',
                color: maintenanceMode ? '#ff9800' : 'inherit',
              }}
            >
              🔧
            </button>

            {/* View As User */}
            <button
              className="topbar-button"
              title="View as Student"
              onClick={() => {
                setViewAsUser(!viewAsUser);
                alert(`Switched to ${!viewAsUser ? 'student' : 'admin'} view`);
              }}
              style={{
                background: viewAsUser ? 'rgba(76,175,80,0.2)' : 'transparent',
                color: viewAsUser ? '#4CAF50' : 'inherit',
              }}
            >
              👁️
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-menu">
                  <div className="profile-avatar">{currentUser.name?.charAt(0) || 'A'}</div>
                  <div className="profile-info">
                    <div className="profile-name">{currentUser.name || 'Admin'}</div>
                    <div className="profile-role">Administrator</div>
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu" style={{ right: 0, width: '180px' }}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate('/admin/profile-settings');
                      setShowProfileMenu(false);
                    }}
                  >
                    👤 Profile Settings
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      alert('Change password functionality');
                      setShowProfileMenu(false);
                    }}
                  >
                    🔐 Change Password
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      alert('2FA setup started');
                      setShowProfileMenu(false);
                    }}
                  >
                    🔒 Enable 2FA
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;