import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './EnhancedLayout.css';

const ExamOfficerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState('1');

  const menuSections = [
    {
      title: 'Main',
      items: [
        { label: 'Exam Cycle Dashboard', path: '/exam-officer', icon: '📊' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Results Compilation', path: '/exam-officer/results-compilation', icon: '📋' },
        { label: 'Publish Results', path: '/exam-officer/publish-results', icon: '🚀' },
        { label: 'Transcript Center', path: '/exam-officer/transcript-center', icon: '📜' },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        { label: 'Result Progress Tracker', path: '/exam-officer/result-progress-tracker', icon: '📈' },
        { label: 'Exceptions', path: '/exam-officer/exceptions', icon: '⚠️' },
        { label: 'Senate Reports', path: '/exam-officer/senate-reports', icon: '📑' },
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
          <div className="sidebar-logo">📝</div>
          <h2 className="sidebar-title">Exam Officer</h2>
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
              Exam Officer / <span style={{ fontWeight: 600, color: '#1e3c72' }}>Dashboard</span>
            </div>
          </div>

          {/* CENTER: SEARCH */}
          <div className="topbar-center">
            <div className="search-box">
              <span style={{ fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search results, transcripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT: ACTIONS & PROFILE */}
          <div className="topbar-right">
            {/* Session/Semester Selector */}
            <div className="topbar-selector">
              <span style={{ fontSize: '12px', color: '#999' }}>Session:</span>
              <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
                <option value="2024">2024/2025</option>
                <option value="2023">2023/2024</option>
              </select>
            </div>

            <div className="topbar-selector">
              <span style={{ fontSize: '12px', color: '#999' }}>Semester:</span>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            {/* Publishing Schedule */}
            <button className="topbar-button" title="Publishing Schedule">
              📅
            </button>

            {/* Result Readiness Alerts */}
            <button className="topbar-button" title="Result Readiness">
              ✅
              <span className="notification-badge">7</span>
            </button>

            {/* Quick Transcript */}
            <button className="topbar-button" title="Quick Transcript">
              📜
            </button>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="topbar-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-menu">
                  <div className="profile-avatar">{currentUser.name?.charAt(0) || 'E'}</div>
                  <div className="profile-info">
                    <div className="profile-name">{currentUser.name || 'Officer'}</div>
                    <div className="profile-role">Exam Officer</div>
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

export default ExamOfficerLayout;