import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './EnhancedLayout.css';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [viewAsUser, setViewAsUser] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
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

  // Track online users - update every time user interacts or mounts
  useEffect(() => {
    const updateOnlineUsers = () => {
      try {
        const currentTime = Date.now();
        const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers') || '{}');

        // Add/update current user with timestamp - DO NOT store PII (only role and lastActive)
        const userId = currentUser.id || currentUser.email || 'unknown';
        onlineUsers[userId] = {
          role: currentUser.role || 'unknown',
          lastActive: currentTime
        };

        // Remove users inactive for more than 30 minutes (1800000 ms)
        const activeUsers = Object.fromEntries(
          Object.entries(onlineUsers).filter(([_, user]: [string, any]) => {
            return currentTime - user.lastActive < 1800000;
          })
        );

        localStorage.setItem('onlineUsers', JSON.stringify(activeUsers));
        setOnlineUsersCount(Object.keys(activeUsers).length);
      } catch (err) {
        console.error("Error updating online users:", err);
      }
    };

    // Update on mount
    updateOnlineUsers();

    // Update every 30 seconds
    const interval = setInterval(updateOnlineUsers, 30000);

    // Update on user activity
    const handleActivity = () => updateOnlineUsers();
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [currentUser]);

  // Search functionality - filter menu items based on search query
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ label: string; path: string; icon: string; section: string }> = [];
    
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.label.toLowerCase().includes(query) || item.path.toLowerCase().includes(query)) {
          results.push({
            label: item.label,
            path: item.path,
            icon: item.icon,
            section: section.title
          });
        }
      });
    });
    
    return results;
  }, [searchQuery]);

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <div className="role-layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">⚙️</div>
          <h2 className="sidebar-title">Admin Panel</h2>
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
              <div className="search-box" style={{ position: 'relative' }}>
                <span style={{ fontSize: '14px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search pages, users, settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery.trim() && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginTop: '4px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {filteredSearchResults.length > 0 ? (
                      <>
                        {filteredSearchResults.map((result, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearchResultClick(result.path)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              width: '100%',
                              padding: '10px 12px',
                              border: 'none',
                              background: idx % 2 === 0 ? '#f9f9f9' : 'white',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '0.9em',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e8f4f8'}
                            onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#f9f9f9' : 'white'}
                          >
                            <span style={{ fontSize: '1.1em' }}>{result.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 500, color: '#333' }}>{result.label}</div>
                              <div style={{ fontSize: '0.8em', color: '#999' }}>{result.section}</div>
                            </div>
                            <span style={{ fontSize: '0.8em', color: '#bbb' }}>→</span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div style={{ padding: '12px', color: '#999', textAlign: 'center', fontSize: '0.9em' }}>
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="breadcrumb">
                Admin / <span style={{ fontWeight: 600, color: '#1e3c72' }}>Dashboard</span>
              </div>
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

            {/* Online Users Counter */}
            <button
              className="topbar-button"
              title={`${onlineUsersCount} users currently online`}
              style={{
                background: 'rgba(76,175,80,0.2)',
                color: '#28a745',
                fontWeight: 600,
                fontSize: '0.9em',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontSize: '1.1em' }}>🟢</span>
              <span>{onlineUsersCount} Online</span>
            </button>

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
                  <div className="profile-avatar">
                    {localStorage.getItem(`userProfileImage_${currentUser.id}`) ? (
                      <img 
                        src={localStorage.getItem(`userProfileImage_${currentUser.id}`) || ''} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      currentUser.name?.charAt(0) || 'A'
                    )}
                  </div>
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
                      navigate('/profile-settings');
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

export default AdminLayout;