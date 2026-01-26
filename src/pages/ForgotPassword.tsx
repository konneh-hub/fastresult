import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./AuthPages.css";

type PasswordResetStep = "email" | "option" | "reset" | "support";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<PasswordResetStep>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Reset Fields
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Support Message Fields
  const [supportMessage, setSupportMessage] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Check if email exists
      const response = await api.post("/auth/check-email", { email });
      
      if (response.data && response.data.exists) {
        // Email exists, show password reset or support options
        setSuccess("Email verified! Choose how you'd like to proceed.");
        setStep("option");
      } else {
        setError("Email not found in our system. Please check and try again.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to verify email";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Request Password Reset
  const handleRequestReset = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/request-password-reset", { email });

      if (response.data) {
        setSuccess("Password reset code has been sent to your email. Check your inbox!");
        setStep("reset");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send reset code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password with Code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!resetCode) {
        setError("Please enter the reset code from your email");
        setLoading(false);
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const response = await api.post("/auth/reset-password", {
        email,
        resetCode,
        newPassword
      });

      if (response.data) {
        setSuccess("✓ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to reset password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Send Support Message
  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!supportMessage || supportMessage.trim().length < 10) {
        setError("Please write a message (at least 10 characters)");
        setLoading(false);
        return;
      }

      const response = await api.post("/auth/send-support-message", {
        email,
        message: supportMessage,
        phone: supportPhone || undefined
      });

      if (response.data) {
        setSuccess("✓ Your message has been sent to our support team. We'll respond within 24 hours!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send message";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Back
  const handleBack = () => {
    if (step === "option") {
      setStep("email");
      setSuccess("");
    } else if (step === "reset" || step === "support") {
      setStep("option");
      setError("");
      setSuccess("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">🔑</div>
            <h1>Recover Your Account</h1>
            <p>
              {step === "email" && "Enter your email to get started"}
              {step === "option" && "How would you like to proceed?"}
              {step === "reset" && "Enter the reset code and new password"}
              {step === "support" && "Tell us how we can help"}
            </p>
          </div>

          {/* Info Banner */}
          {step !== "email" && (
            <div
              style={{
                background: "#DBEAFE",
                border: "1px solid #0284C7",
                color: "#075985",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "1.5rem",
                fontSize: "0.875rem"
              }}
            >
              <strong>📧 {email}</strong>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                fontSize: "0.875rem"
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              style={{
                background: "#DCFCE7",
                color: "#15803D",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                fontSize: "0.875rem"
              }}
            >
              ✓ {success}
            </div>
          )}

          {/* STEP 1: Verify Email */}
          {step === "email" && (
            <form onSubmit={handleVerifyEmail}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )}

          {/* STEP 2: Choose Option */}
          {step === "option" && (
            <div>
              <div className="form-group">
                <button
                  onClick={handleRequestReset}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    marginBottom: "0.75rem",
                    background: "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}
                >
                  🔐 Reset Password Myself
                </button>

                <button
                  onClick={() => setStep("support")}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}
                >
                  💬 Contact Support
                </button>
              </div>

              <button
                onClick={handleBack}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  background: "#E5E7EB",
                  color: "#374151",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}
              >
                ← Back
              </button>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="resetCode">Reset Code</label>
                <input
                  id="resetCode"
                  type="text"
                  placeholder="Enter code from email (e.g., ABC123)"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: "100%" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.2rem"
                    }}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  background: "#E5E7EB",
                  color: "#374151",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}
              >
                ← Back
              </button>
            </form>
          )}

          {/* STEP 4: Support Message */}
          {step === "support" && (
            <form onSubmit={handleSendSupport}>
              <div className="form-group">
                <label htmlFor="supportPhone">Phone Number (Optional)</label>
                <input
                  id="supportPhone"
                  type="tel"
                  placeholder="+233501234567"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="supportMessage">Message</label>
                <textarea
                  id="supportMessage"
                  placeholder="Describe your issue or what help you need..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "0.75rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    resize: "vertical"
                  }}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message to Admin"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  background: "#E5E7EB",
                  color: "#374151",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}
              >
                ← Back
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="login-footer" style={{ marginTop: "1.5rem" }}>
            <p>
              <Link to="/login">← Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
