import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Roles() {
  const roles = [
    {
      icon: "👨‍💼",
      name: "Administrator",
      shortName: "Admin",
      color: "#1E40AF",
      description: "System-wide management and oversight",
      responsibilities: [
        "User account creation and management",
        "System configuration and settings",
        "Approve final result publications",
        "Generate system reports and analytics",
        "Manage backup and security",
        "View online users and system activity"
      ]
    },
    {
      icon: "🎓",
      name: "Dean",
      shortName: "Dean",
      color: "#7C3AED",
      description: "Faculty-level result approval",
      responsibilities: [
        "Review and approve results at faculty level",
        "Monitor department performance",
        "Provide oversight of result submissions",
        "Generate faculty reports",
        "Resolve result discrepancies",
        "Access faculty-wide analytics"
      ]
    },
    {
      icon: "📋",
      name: "Head of Department",
      shortName: "HOD",
      color: "#059669",
      description: "Department management and coordination",
      responsibilities: [
        "Supervise result submission process",
        "Review departmental results",
        "Approve results before forwarding to Dean",
        "Manage departmental staff",
        "Generate department reports",
        "Monitor submission deadlines"
      ]
    },
    {
      icon: "📝",
      name: "Exam Officer",
      shortName: "Exam Officer",
      color: "#D97706",
      description: "Result compilation and administration",
      responsibilities: [
        "Compile results from lecturers",
        "Validate result data",
        "Handle bulk uploads and imports",
        "Manage result verification",
        "Prepare results for approval chain",
        "Generate compliance reports"
      ]
    },
    {
      icon: "👨‍🏫",
      name: "Lecturer",
      shortName: "Lecturer",
      color: "#DC2626",
      description: "Submit and manage course grades",
      responsibilities: [
        "Submit student grades",
        "Enter or upload results in bulk",
        "View drafted and submitted results",
        "Make corrections within allowed period",
        "Generate course analytics",
        "Communicate with exam officers"
      ]
    },
    {
      icon: "👨‍🎓",
      name: "Student",
      shortName: "Student",
      color: "#0891B2",
      description: "View personal results and transcripts",
      responsibilities: [
        "View personal grades and results",
        "Access complete transcript",
        "Download result documents",
        "View course performance metrics",
        "Access historical results",
        "Update profile information"
      ]
    }
  ];

  const approvalFlow = [
    { role: "Lecturer", action: "Submit Grades", icon: "📤" },
    { role: "Exam Officer", action: "Validate & Compile", icon: "✓" },
    { role: "HOD", action: "Department Approval", icon: "👍" },
    { role: "Dean", action: "Faculty Approval", icon: "✔️" },
    { role: "Admin", action: "Final Publication", icon: "🎉" }
  ];

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">📚</div>
            <span className="brand-text">FastResult</span>
          </Link>
          <div className="navbar-links">
            <Link to="/" className="nav-login-btn">Back to Home</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: "3rem 2rem", backgroundColor: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "1rem", color: "var(--color-primary)" }}>
            User Roles & Responsibilities
          </h1>
          <p style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)", marginBottom: "3rem", lineHeight: "1.6" }}>
            FastResult supports multiple roles, each with specific permissions and responsibilities designed for the academic ecosystem.
          </p>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              Role Overview
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              {roles.map((role, index) => (
                <div key={index} style={{
                  backgroundColor: "var(--color-bg-page)",
                  padding: "2rem",
                  borderRadius: "8px",
                  borderTop: `4px solid ${role.color}`,
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                    {role.icon}
                  </div>
                  <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "0.5rem", color: role.color }}>
                    {role.name}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                    {role.description}
                  </p>
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: role.color, marginBottom: "0.75rem" }}>
                      Key Responsibilities:
                    </p>
                    <ul style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginLeft: "1.5rem", lineHeight: "1.6" }}>
                      {role.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              Result Approval Workflow
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              overflow: "auto",
              padding: "2rem",
              backgroundColor: "var(--color-bg-page)",
              borderRadius: "8px"
            }}>
              {approvalFlow.map((step, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: "120px"
                  }}>
                    <div style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem"
                    }}>
                      {step.icon}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text-primary)", textAlign: "center" }}>
                      {step.role}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                      {step.action}
                    </div>
                  </div>
                  {index < approvalFlow.length - 1 && (
                    <div style={{
                      fontSize: "1.5rem",
                      color: "var(--color-primary)",
                      marginBottom: "2rem"
                    }}>
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: "#EFF6FF",
            padding: "2rem",
            borderRadius: "8px",
            borderLeft: "4px solid var(--color-primary)",
            marginBottom: "2rem"
          }}>
            <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              Access & Permissions
            </h3>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              FastResult uses role-based access control to ensure:
            </p>
            <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
              <li><strong>Security:</strong> Users can only access data relevant to their role</li>
              <li><strong>Accountability:</strong> All actions are logged and traceable</li>
              <li><strong>Efficiency:</strong> Workflows are optimized for each role's needs</li>
              <li><strong>Compliance:</strong> Data protection regulations are enforced</li>
            </ul>
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link to="/register" style={{
              display: "inline-block",
              backgroundColor: "var(--color-primary)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-primary)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            >
              Join FastResult
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>FastResult</h4>
            <p>Academic Results Management</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#roles">Roles</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FastResult. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
