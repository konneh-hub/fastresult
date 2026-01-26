import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { otpService } from "../services/otpService";
import "./AuthPages.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  // Load saved email on mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberEmail");
    if (remembered) {
      setEmail(remembered);
      setSavedEmail(remembered);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter email and password");
        setLoading(false);
        return;
      }

      // Login without role selection
      const response = await api.post("/auth/login", {
        email,
        password
      });

      if (response.data && response.data.token) {
        const { token, user } = response.data;

        console.log("Login Response - User:", user);
        console.log("Login Response - User Role:", user.role);

        // Store auth data
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        // Redirect to appropriate dashboard based on role
        const roleRoutes: { [key: string]: string } = {
          'admin': '/admin',
          'super_admin': '/admin',
          'super-admin': '/admin',
          'dean': '/dean',
          'faculty_dean': '/dean',
          'faculty-dean': '/dean',
          'hod': '/hod',
          'head_of_department': '/hod',
          'head-of-department': '/hod',
          'exam_officer': '/exam-officer',
          'exam-officer': '/exam-officer',
          'examofficer': '/exam-officer',
          'lecturer': '/lecturer',
          'student': '/student'
        };

        const userRole = user.role?.toLowerCase() || 'student';
        const normalizedRole = userRole.replace(/\s+/g, '_').replace(/-/g, '_');
        const dashboardPath = roleRoutes[normalizedRole] || roleRoutes[userRole] || '/student';

        console.log("User Role:", user.role);
        console.log("Normalized Role:", normalizedRole);
        console.log("Dashboard Path:", dashboardPath);

        navigate(dashboardPath);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>Sign In</h1>
            <p>Access your account and dashboard</p>
          </div>

          <div style={{
            background: "#DBEAFE",
            border: "1px solid #0284C7",
            color: "#075985",
            padding: "0.75rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            fontSize: "0.875rem"
          }}>
            <strong>ℹ️ Your account type determines your dashboard</strong> - Just sign in with your email and password!
          </div>

          {error && (
            <div style={{
              background: "#FEE2E2",
              color: "#991B1B",
              padding: "0.75rem",
              borderRadius: "4px",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-checkbox">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              <Link to="/forgot-password">Forgot password?</Link>
            </p>
            <p>
              {" "}
              <Link to="/register">Create a student account</Link>
            </p>
            <p style={{ fontSize: "0.75rem", color: "#64748B" }}>
              © {new Date().getFullYear()} FastResult. All rights reserved.
            </p>
            <p>
              <Link to="/">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
