import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SetPassword.css';

interface SetPasswordProps {
  state?: {
    userData: any;
    email: string;
  };
}

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as any) || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const userData = state.userData || JSON.parse(localStorage.getItem('user') || '{}');

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('❌ Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('❌ Passwords do not match');
      return;
    }

    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('⚠️ Password should contain uppercase, lowercase, number, and special character');
      // Allow to continue anyway
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          password_set: true,
          password_set_at: new Date().toISOString()
        }));

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || '❌ Failed to set password');
      }
    } catch (err: any) {
      setError('❌ ' + (err.message || 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (!userData.email) {
    return (
      <div className="set-password-container">
        <div className="set-password-card">
          <h2>❌ Invalid Access</h2>
          <p>Please verify your email first.</p>
          <button onClick={() => navigate('/register')} className="btn btn-primary">
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="set-password-container">
        <div className="set-password-card success-card">
          <div className="success-icon">✅</div>
          <h2>Password Set Successfully!</h2>
          <p>Your account is now fully activated.</p>
          <div className="success-details">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Name:</strong> {userData.fullName}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>
          <p className="redirect-text">
            🔄 Redirecting to login in 3 seconds...
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="set-password-container">
      <div className="set-password-card">
        <div className="set-password-header">
          <h1>FastResult</h1>
          <h2>Set Your Secure Password</h2>
        </div>

        <div className="user-info-box">
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Name:</strong> {userData.fullName}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>

        <form onSubmit={handleSetPassword} className="set-password-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              disabled={loading}
            />
            <small>Minimum 6 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <div className="password-requirements">
            <p><strong>Password Tips:</strong></p>
            <ul>
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains numbers and special characters (@$!%*?&)</li>
              <li>Don't use dictionary words</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? '⏳ Setting Password...' : '✅ Set Password & Activate Account'}
          </button>
        </form>

        <div className="set-password-footer">
          <p>After setting your password, you can log in with your email and password.</p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
