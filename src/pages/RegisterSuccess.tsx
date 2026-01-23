import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AuthPages.css";

export default function RegisterSuccess() {
  const location = useLocation();
  const message = (location.state as any)?.message || "Registration successful!";

  return (
    <div className="register-page">
      <div className="register-container">
        <div style={{
          textAlign: "center",
          padding: "3rem 2rem",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1.5rem"
          }}>
            ✓
          </div>

          <h1 style={{ marginBottom: "1rem", color: "#15803D" }}>
            Account Created Successfully
          </h1>

          <p style={{
            fontSize: "1.125rem",
            color: "#64748B",
            marginBottom: "2rem",
            lineHeight: "1.6"
          }}>
            {message}
          </p>

          <div style={{
            background: "#F0FDF4",
            border: "1px solid #22C55E",
            borderRadius: "4px",
            padding: "1.5rem",
            marginBottom: "2rem",
            textAlign: "left"
          }}>
            <h3 style={{ color: "#15803D", marginBottom: "1rem" }}>What happens next?</h3>
            
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                background: "#22C55E",
                color: "white",
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: "bold"
              }}>
                1
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#15803D" }}>
                  Verification in Progress
                </p>
                <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.25rem" }}>
                  Your enrollment will be verified against institutional records.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                background: "#22C55E",
                color: "white",
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: "bold"
              }}>
                2
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#15803D" }}>
                  Email Notification
                </p>
                <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.25rem" }}>
                  Check your email for verification status updates.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{
                background: "#22C55E",
                color: "white",
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: "bold"
              }}>
                3
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#15803D" }}>
                  Account Activation
                </p>
                <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.25rem" }}>
                  Once verified, you can sign in and access your results.
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: "#FEF3C7",
            border: "1px solid #D97706",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "2rem",
            textAlign: "left"
          }}>
            <p style={{ color: "#92400E", fontSize: "0.875rem", margin: 0 }}>
              <strong>⚠ Important:</strong> Do not attempt to register again. Multiple registrations may delay verification.
            </p>
          </div>

          <Link
            to="/login"
            style={{
              display: "inline-block",
              background: "#1E40AF",
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 600,
              marginBottom: "1rem"
            }}
          >
            Go to Login
          </Link>

          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "1.5rem" }}>
            <Link to="/" style={{ color: "#1E40AF", fontWeight: 600, textDecoration: "none" }}>
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
