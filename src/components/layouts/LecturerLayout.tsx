import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './EnhancedLayout.css';

const LecturerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('CS101');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    {
      title: 'Settings',
      items: [
        { label: 'My Role & Responsibilities', path: '/my-role', icon: '👥' },
        { label: 'Profile Settings', path: '/profile-settings', icon: '⚙️' },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminTheme');
    navigate('/login');
  };

  const confirmLogout = () => {
    handleLogout();
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Update topbar background based on user theme (scoped per user)
  React.useEffect(() => {
    const updateTopbarBackground = () => {
      const themeColor = localStorage.getItem(`userTheme_${currentUser.id}`) || '#ffffff';
      document.documentElement.style.setProperty('--topbar-bg', themeColor);
    };

    updateTopbarBackground();
    window.addEventListener('storage', updateTopbarBackground);
    return () => window.removeEventListener('storage', updateTopbarBackground);
  }, [currentUser.id]);

  return (
    <div className="role-layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">👨‍🏫</div>
          <h2 className="sidebar-title">Lecturer Portal</h2>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
              marginLeft: 'auto',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          >
            {sidebarCollapsed ? '✕' : '☰'}
          </button>
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
                      <span className="sidebar-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => setShowLogoutConfirm(true)}
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
          {/* LEFT: SEARCH & BREADCRUMB */}
          <div className="topbar-left">
            <div className="topbar-left-content">
              <div className="search-box">
                <span style={{ fontSize: '14px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search courses, students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="breadcrumb">
                Lecturer / <span style={{ fontWeight: 600, color: '#1e3c72' }}>Dashboard</span>
              </div>
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
                  <div className="profile-avatar">
                    {localStorage.getItem(`userProfileImage_${currentUser.id}`) ? (
                      <img 
                        src={localStorage.getItem(`userProfileImage_${currentUser.id}`) || ''} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      currentUser.name?.charAt(0) || 'L'
                    )}
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">{currentUser.name || 'Lecturer'}</div>
                    <div className="profile-role">Lecturer</div>
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu" style={{ right: 0, width: '180px' }}>
                  <button className="dropdown-item" onClick={() => navigate('/profile-settings')}>Profile Settings</button>
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

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#EF4444' }}>⚠️ Confirm Logout</h2>
            <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#E5E7EB',
                  color: '#1F2937',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  flex: 1
                }}
              >
                ❌ No, Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  flex: 1
                }}
              >
                ✅ Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerLayout;