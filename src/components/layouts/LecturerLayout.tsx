import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './EnhancedLayout.css';

const LecturerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('CS101');

  const menuSections = [
    {
      title: 'Main',
      items: [
        { label: 'My Courses', path: '/lecturer', icon: '📚' },
      ],
    },
    {
      title: 'Grading',
      items: [
        { label: 'Enter Results', path: '/lecturer/enter-results', icon: '✏️' },
        { label: 'Upload Excel', path: '/lecturer/upload-excel', icon: '📤' },
        { label: 'Drafts', path: '/lecturer/drafts', icon: '📋' },
        { label: 'Submitted/Returned', path: '/lecturer/submitted-returned', icon: '✅' },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { label: 'Course Analytics', path: '/lecturer/analytics', icon: '📊' },
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
          <div className="sidebar-logo">👨‍🏫</div>
          <h2 className="sidebar-title">Lecturer Portal</h2>
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
              Lecturer / <span style={{ fontWeight: 600, color: '#1e3c72' }}>Dashboard</span>
            </div>
          </div>

          {/* CENTER: SEARCH */}
          <div className="topbar-center">
            <div className="search-box">
              <span style={{ fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search courses, students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT: ACTIONS & PROFILE */}
          <div className="topbar-right">
            {/* Course Selector */}
            <div className="topbar-selector">
              <span style={{ fontSize: '12px', color: '#999' }}>Course:</span>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="CS101">CS101 - Intro to CS</option>
                <option value="CS201">CS201 - Data Structures</option>
                <option value="CS301">CS301 - Algorithms</option>
              </select>
            </div>

            {/* Submission Deadline */}
            <button className="topbar-button" title="Submission Deadline">
              ⏰
            </button>

            {/* Returned Notifications */}
            <button className="topbar-button" title="Returned Results">
              ↩️
              <span className="notification-badge">2</span>
            </button>

            {/* Autosave Status */}
            <button className="topbar-button" title="Autosave Status">
              💾
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-menu">
                  <div className="profile-avatar">{currentUser.name?.charAt(0) || 'L'}</div>
                  <div className="profile-info">
                    <div className="profile-name">{currentUser.name || 'Lecturer'}</div>
                    <div className="profile-role">Lecturer</div>
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu" style={{ right: 0, width: '180px' }}>
                  <button className="dropdown-item">Profile Settings</button>
                  <button className="dropdown-item">Change Password</button>
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

export default LecturerLayout;