import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/VerifyEmail.css';

interface VerificationStatus {
  success: boolean;
  message: string;
  userData?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    verified: boolean;
  };
}

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [userData, setUserData] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL
        const token = searchParams.get('token');
        const otp = searchParams.get('otp');
        const email = searchParams.get('email');

        if (!token && !otp && !email) {
          setStatus('error');
          setMessage('❌ Invalid verification link. Please check your email again.');
          return;
        }

        // Call backend to verify
        const response = await fetch('http://localhost:5000/api/auth/verify-email-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token || null,
            otp: otp || null,
            email: email || null
          })
        });

        const data: VerificationStatus = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('✅ Email verified successfully!');
          setUserData(data.userData);

          // Store verification in localStorage
          if (data.userData) {
            localStorage.setItem('user', JSON.stringify({
              ...data.userData,
              verified: true,
              verified_at: new Date().toISOString()
            }));
          }
        } else {
          setStatus('error');
          setMessage(data.message || '❌ Email verification failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('❌ An error occurred during verification. Please try again later.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Auto-redirect after countdown
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (status === 'success' && countdown === 0) {
      // Redirect to password setup page
      navigate('/set-password', {
        state: { userData, email: userData?.email }
      });
    }
  }, [status, countdown, navigate, userData]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {/* Header */}
        <div className="verify-header">
          <h1>FastResult</h1>
          <p>Email Verification</p>
        </div>

        {/* Content */}
        <div className="verify-content">
          {status === 'loading' && (
            <div className="verify-loading">
              <div className="spinner"></div>
              <p>{message}</p>
              <p className="verify-subtext">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verify-success">
              <div className="success-icon">✅</div>
              <h2>Email Verified Successfully!</h2>
              <p className="success-message">{message}</p>

              {userData && (
                <div className="user-info">
                  <p><strong>Name:</strong> {userData.fullName}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Role:</strong> {userData.role}</p>
                </div>
              )}

              <div className="redirect-notice">
                <p>
                  🔄 Redirecting to password setup in <strong>{countdown}</strong> seconds...
                </p>
                <p className="subtext">
                  You'll be able to set your secure password next.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => navigate('/set-password', {
                  state: { userData, email: userData?.email }
                })}
              >
                Continue to Password Setup
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="verify-error">
              <div className="error-icon">❌</div>
              <h2>Verification Failed</h2>
              <p className="error-message">{message}</p>

              <div className="error-help">
                <h3>What you can do:</h3>
                <ul>
                  <li>Check that you clicked the complete link from your email</li>
                  <li>Make sure the verification code hasn't expired</li>
                  <li>Try requesting a new verification email</li>
                </ul>
              </div>

              <div className="error-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/register')}
                >
                  Register Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="verify-footer">
          <p>© 2024 FastResult. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
