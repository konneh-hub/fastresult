import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './admin/AdminPages.css';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  avatar: string;
  profileImage: string | null;
  theme: 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange';
}

const themeColors = {
  light: {
    name: 'Light',
    backgroundColor: '#ffffff',
    sidebarBg: '#f5f7fa',
    textColor: '#333333',
  },
  dark: {
    name: 'Dark',
    backgroundColor: '#1a1a1a',
    sidebarBg: '#0d0d0d',
    textColor: '#ffffff',
  },
  blue: {
    name: 'Ocean Blue',
    backgroundColor: '#e3f2fd',
    sidebarBg: '#1e3c72',
    textColor: '#0d47a1',
  },
  green: {
    name: 'Forest Green',
    backgroundColor: '#e8f5e9',
    sidebarBg: '#1b5e20',
    textColor: '#1b5e20',
  },
  purple: {
    name: 'Deep Purple',
    backgroundColor: '#f3e5f5',
    sidebarBg: '#4a148c',
    textColor: '#6a1b9a',
  },
  orange: {
    name: 'Sunset Orange',
    backgroundColor: '#fff3e0',
    sidebarBg: '#e65100',
    textColor: '#e65100',
  },
};

export default function ProfileSettings() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Get role-specific label
  const getRoleLabel = (role: string) => {
    switch(role?.toLowerCase()) {
      case 'admin':
      case 'super_admin':
        return 'Administrator';
      case 'dean':
        return 'Dean';
      case 'hod':
        return 'Head of Department';
      case 'exam_officer':
        return 'Exam Officer';
      case 'lecturer':
        return 'Lecturer';
      case 'student':
        return 'Student';
      default:
        return 'User';
    }
  };

  const [profile, setProfile] = useState<AdminProfile>({
    id: currentUser.id || '',
    name: currentUser.name || '',
    email: currentUser.email || '',
    department: currentUser.department || currentUser.faculty || '',
    phone: currentUser.phone || '',
    avatar: currentUser.name?.charAt(0).toUpperCase() || 'U',
    profileImage: localStorage.getItem(`userProfileImage_${currentUser.id}`) || null,
    theme: (localStorage.getItem(`userThemeKey_${currentUser.id}`) as any) || 'light',
  });

  const [tempProfile, setTempProfile] = useState<AdminProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show2FA, setShow2FA] = useState(false);

  const handleProfileSave = () => {
    setProfile(tempProfile);
    localStorage.setItem('user', JSON.stringify({ ...currentUser, name: tempProfile.name, email: tempProfile.email }));
    setIsEditing(false);
    alert('Profile updated successfully!');
    applyTheme(tempProfile.theme);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    const selectedTheme = themeColors[theme as keyof typeof themeColors];
    
    if (selectedTheme) {
      root.style.setProperty('--bg-color', selectedTheme.backgroundColor);
      root.style.setProperty('--sidebar-bg', selectedTheme.sidebarBg);
      root.style.setProperty('--text-color', selectedTheme.textColor);
      root.style.setProperty('--theme', theme);
      document.body.style.backgroundColor = selectedTheme.backgroundColor;
      // store both the theme key and background color scoped to this user
      localStorage.setItem(`userThemeKey_${currentUser.id}`, theme);
      localStorage.setItem(`userTheme_${currentUser.id}`, selectedTheme.backgroundColor);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(`userThemeKey_${currentUser.id}`) || 'light';
    applyTheme(savedTheme);
  }, []);

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await api.post('/auth/change-password', {
        email: currentUser.email,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.status === 200) {
        alert('✅ Password changed successfully! You can now login with your new password.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      alert('❌ ' + errorMessage);
    }
  };

  const handleEnable2FA = () => {
    alert('2FA enabled successfully! Scan the QR code with your authenticator app.');
    setShow2FA(false);
  };

  const handleBackToDashboard = () => {
    const userRole = currentUser.role || 'admin';
    const dashboardPath = userRole === 'admin' || userRole === 'super_admin' ? '/admin' :
                          userRole === 'dean' ? '/dean' :
                          userRole === 'hod' ? '/hod' :
                          userRole === 'exam_officer' ? '/exam-officer' :
                          userRole === 'lecturer' ? '/lecturer' :
                          userRole === 'student' ? '/student' : '/';
    navigate(dashboardPath);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setProfile({ ...profile, profileImage: imageData });
        setTempProfile({ ...tempProfile, profileImage: imageData });
        localStorage.setItem(`userProfileImage_${currentUser.id}`, imageData);
        alert('✅ Profile picture updated successfully!');
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👤 Profile Settings</h1>
          <p>Manage your profile, preferences, and security settings.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleBackToDashboard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            <FiArrowLeft /> Back to Dashboard
          </button>
          {!isEditing && <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>}
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: profile.profileImage ? 'transparent' : '#2a5298',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                profile.avatar
              )}
            </div>
            <button
              onClick={() => setShowImageUpload(true)}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
              title="Change profile picture"
            >
              <FiCamera />
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 5px 0' }}>{profile.name}</h2>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>{profile.email}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.9em' }}>
              <div>
                <span style={{ color: '#999' }}>Role:</span>
                <div style={{ fontWeight: 'bold' }}>{getRoleLabel(currentUser.role)}</div>
              </div>
              <div>
                <span style={{ color: '#999' }}>Department:</span>
                <div style={{ fontWeight: 'bold' }}>{profile.department}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="form-card">
          <h3>Edit Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={tempProfile.department}
                onChange={(e) => setTempProfile({ ...tempProfile, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleProfileSave}><FiSave /> Save Changes</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {/* Theme Settings */}
      <div className="form-card">
        <h3>🎨 Theme & Appearance</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>Choose your preferred color theme.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {Object.entries(themeColors).map(([themeKey, theme]) => (
            <div
              key={themeKey}
              onClick={() => {
                setTempProfile({ ...tempProfile, theme: themeKey as any });
                applyTheme(themeKey);
                localStorage.setItem(`userThemeKey_${currentUser.id}`, themeKey);
              }}
              style={{
                border: profile.theme === themeKey ? '3px solid #2a5298' : '2px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '40px',
                    background: theme.sidebarBg,
                  }}></div>
                  <div style={{
                    height: '40px',
                    background: theme.backgroundColor,
                    border: '1px solid #ddd',
                  }}></div>
                </div>
              </div>
              <div style={{
                fontSize: '0.9em',
                fontWeight: 'bold',
                color: profile.theme === themeKey ? '#2a5298' : '#333',
              }}>
                {theme.name}
              </div>
            </div>
          ))}
        </div>

        {/* Theme Preview */}
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
          <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>Current Theme:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <span style={{ fontSize: '0.8em', color: '#999' }}>Sidebar</span>
              <div style={{
                height: '30px',
                background: themeColors[tempProfile.theme].sidebarBg,
                borderRadius: '4px',
                marginTop: '5px',
              }}></div>
            </div>
            <div>
              <span style={{ fontSize: '0.8em', color: '#999' }}>Background</span>
              <div style={{
                height: '30px',
                background: themeColors[tempProfile.theme].backgroundColor,
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '5px',
              }}></div>
            </div>
            <div>
              <span style={{ fontSize: '0.8em', color: '#999' }}>Text</span>
              <div style={{
                height: '30px',
                background: '#f0f0f0',
                color: themeColors[tempProfile.theme].textColor,
                borderRadius: '4px',
                marginTop: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
                Abc
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="form-card">
        <h3>🔒 Security Settings</h3>

        {/* Change Password */}
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Change Password</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter your current password"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <button className="btn-primary" onClick={handleChangePassword}>Change Password</button>
        </div>

        {/* Two-Factor Authentication */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Two-Factor Authentication (2FA)</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>Add an extra layer of security to your account</p>
            </div>
            <button className="btn-primary" onClick={() => setShow2FA(!show2FA)}>
              {show2FA ? 'Cancel' : 'Enable 2FA'}
            </button>
          </div>

          {show2FA && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Scan this QR code with your authenticator app:</label>
                <div style={{
                  width: '150px',
                  height: '150px',
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#999',
                }}>
                  📱 QR Code Here
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Or enter this code manually:</label>
                <div style={{
                  fontFamily: 'monospace',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  letterSpacing: '2px',
                }}>
                  2A4B 6C8D 9E0F 1G2H
                </div>
              </div>
              <button className="btn-primary" onClick={handleEnable2FA}>Confirm & Enable 2FA</button>
            </div>
          )}
        </div>
      </div>

      {/* Account Activity */}
      <div className="form-card">
        <h3>📋 Account Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Account Created</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>2023-06-15</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Last Login</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Today, 10:30 AM</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Failed Logins (24h)</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>0</div>
          </div>
          <div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Active Sessions</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>2</div>
          </div>
        </div>
      </div>

      {/* API & Tokens */}
      <div className="form-card">
        <h3>🔑 API Keys & Tokens</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Manage your API keys for system integrations.</p>
        <div style={{
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '4px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.9em', color: '#999', marginBottom: '5px' }}>API Key</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>sk_admin_1234567890abcdef...</div>
          </div>
          <button className="btn-sm">Regenerate</button>
        </div>
        <button className="btn-secondary">Create New API Key</button>
      </div>

      {/* Profile Picture Upload Modal */}
      {showImageUpload && (
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
            <h2 style={{ margin: '0 0 1rem 0' }}>📷 Change Profile Picture</h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#666' }}>
              Select an image file (JPG, PNG) to upload as your profile picture
            </p>
            <div style={{
              border: '2px dashed #3B82F6',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '1.5rem',
              background: '#F0F9FF'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiCamera style={{ fontSize: '2.5rem', color: '#3B82F6' }} />
                <span style={{ color: '#3B82F6', fontWeight: 600 }}>Click to select image</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowImageUpload(false)}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
