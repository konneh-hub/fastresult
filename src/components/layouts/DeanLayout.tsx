import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './EnhancedLayout.css';

const DeanLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedSession, setSelectedSession] = useState('2024');

  const menuSections = [
    {
      title: 'Main',
      items: [
        { label: 'Faculty Dashboard', path: '/dean', icon: '📊' },
      ],
    },
    {
      title: 'Management',
      items: [
        { label: 'Departments', path: '/dean/departments', icon: '🏘️' },
        { label: 'Programs', path: '/dean/programs', icon: '📚' },
        { label: 'Courses/Modules', path: '/dean/courses-modules', icon: '📖' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'Faculty GPA Rules', path: '/dean/gpa-rules', icon: '📊' },
        { label: 'Approvals', path: '/dean/approvals', icon: '✅' },
        { label: 'Reports', path: '/dean/reports', icon: '📋' },
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
          <div className="sidebar-logo">👔</div>
          <h2 className="sidebar-title">Dean Portal</h2>
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
              Dean / <span style={{ fontWeight: 600, color: '#1e3c72' }}>Dashboard</span>
            </div>
          </div>

          {/* CENTER: SEARCH */}
          <div className="topbar-center">
            <div className="search-box">
              <span style={{ fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search departments, programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT: ACTIONS & PROFILE */}
          <div className="topbar-right">
            {/* Faculty Selector */}
            <div className="topbar-selector">
              <span style={{ fontSize: '12px', color: '#999' }}>Faculty:</span>
              <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
                <option value="all">All Faculties</option>
                <option value="engineering">Engineering</option>
                <option value="science">Science</option>
                <option value="arts">Arts</option>
              </select>
            </div>

            {/* Session Selector */}
            <div className="topbar-selector">
              <span style={{ fontSize: '12px', color: '#999' }}>Session:</span>
              <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
                <option value="2024">2024/2025</option>
                <option value="2023">2023/2024</option>
                <option value="2022">2022/2023</option>
              </select>
            </div>

            {/* Approval Notifications */}
            <button className="topbar-button" title="Pending Approvals">
              ✅
              <span className="notification-badge">5</span>
            </button>

            {/* Anomalies Alert */}
            <button className="topbar-button" title="Anomalies Alert">
              ⚠️
              <span className="notification-badge">2</span>
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-menu">
                  <div className="profile-avatar">{currentUser.name?.charAt(0) || 'D'}</div>
                  <div className="profile-info">
                    <div className="profile-name">{currentUser.name || 'Dean'}</div>
                    <div className="profile-role">Faculty Dean</div>
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu" style={{ right: 0, width: '180px' }}>
                  <button className="dropdown-item">Signature Setup</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
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

export default DeanLayout;