import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiClock } from "react-icons/fi";
import { otpService } from "../services/otpService";
import api from "../api";
import "./AuthPages.css";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(600); // 10 minutes
  const [email, setEmail] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

  // Get email from location state
  useEffect(() => {
    const state = location.state as any;
    if (state?.email) {
      setEmail(state.email);
      // Show demo OTP for testing
      const details = otpService.getOTPDetails(state.email);
      if (details) {
        setDemoOtp(details.code);
      }
    } else {
      // Redirect back to login if no email provided
      navigate("/login");
    }
  }, [location.state]);

  // Timer for OTP expiry
  useEffect(() => {
    const timer = setInterval(() => {
      if (email) {
        const remaining = otpService.getRemainingTime(email);
        setRemainingTime(remaining);
        if (remaining <= 0) {
          setError("OTP has expired. Please request a new one.");
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        setLoading(false);
        return;
      }

      if (remainingTime <= 0) {
        setError("OTP has expired. Please request a new one.");
        setLoading(false);
        return;
      }

      // Call backend API to verify OTP
      const response = await api.post("/auth/verify-email", {
        email,
        otp
      });

      if (response.status === 200 && response.data.verified) {
        console.log("✅ Email verified successfully!");
        
        // Clear registration data
        localStorage.removeItem("registrationEmail");
        localStorage.removeItem("registrationData");

        // Get state info
        const state = location.state as any;

        // If new registration, go to success page
        if (state?.isNewRegistration) {
          setTimeout(() => {
            navigate("/register-success", { 
              state: { 
                message: "🎉 Registration successful! Your account has been verified. You can now log in." 
              } 
            });
          }, 500);
        } else {
          // For existing users, redirect to login
          setTimeout(() => {
            navigate("/login", {
              state: {
                message: "Email verified! Please log in."
              }
            });
          }, 500);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Verification failed. Please try again.";
      setError(errorMessage);
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (email) {
      setLoading(true);
      try {
        const response = await api.post("/auth/resend-otp", { email });
        
        if (response.status === 200) {
          console.log("✅ OTP resent successfully");
          setOtp("");
          setError("");
          setRemainingTime(600); // Reset to 10 minutes
          setShowDemo(false);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to resend OTP. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">✉️</div>
            <h1>Verify Your Account</h1>
            <p>Enter the OTP sent to your email</p>
          </div>

          <form onSubmit={handleVerify} className="login-form">
            {/* Email Display */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  background: "#F0F9FF",
                  borderRadius: "4px",
                  border: "1px solid #BFE7FF"
                }}
              >
                <FiMail color="#0369A1" size={20} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#0369A1", fontWeight: 600 }}>
                    Verification code sent to:
                  </p>
                  <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500, color: "#000" }}>
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Input */}
            <div className="form-group">
              <label htmlFor="otp">
                Enter OTP <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                style={{
                  fontSize: "1.5rem",
                  letterSpacing: "0.5rem",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontFamily: "monospace"
                }}
                disabled={loading || remainingTime <= 0}
              />
              <small style={{ color: "#64748B" }}>Enter the 6-digit code</small>
            </div>

            {/* Timer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem",
                background: remainingTime <= 120 ? "#FEF2F2" : "#F0FDF4",
                borderLeft: `3px solid ${remainingTime <= 120 ? "#EF4444" : "#22C55E"}`,
                borderRadius: "4px",
                marginBottom: "1.5rem"
              }}
            >
              <FiClock size={18} color={remainingTime <= 120 ? "#EF4444" : "#22C55E"} />
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748B" }}>
                  OTP expires in:
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: remainingTime <= 120 ? "#EF4444" : "#22C55E",
                    fontFamily: "monospace"
                  }}
                >
                  {formatTime(remainingTime)}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#FEE2E2",
                  border: "1px solid #FECACA",
                  color: "#991B1B",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  fontSize: "0.9rem"
                }}
              >
                {error}
              </div>
            )}

            {/* Demo OTP Alert */}
            {showDemo && demoOtp && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#FEF3C7",
                  border: "1px solid #FCD34D",
                  color: "#92400E",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  fontSize: "0.9rem"
                }}
              >
                <strong>Demo OTP:</strong> {demoOtp} (for testing only)
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || remainingTime <= 0}
              className="login-button"
              style={{ opacity: loading || remainingTime <= 0 ? 0.6 : 1 }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Resend OTP */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ margin: "0 0 1rem 0", color: "#64748B", fontSize: "0.9rem" }}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={loading}
              style={{
                background: "transparent",
                color: "#1E40AF",
                border: "none",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "underline"
              }}
            >
              Resend OTP
            </button>
          </div>

          {/* Demo Help */}
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#F9F5FF", borderRadius: "4px" }}>
            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: 600, color: "#6D28D9" }}>
              🔍 Demo Mode
            </p>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#7C3AED" }}>
              Click "Resend OTP" to see the demo OTP code (for testing only). In production, OTP will be sent
              via email/SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
