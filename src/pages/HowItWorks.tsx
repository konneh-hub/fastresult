import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "User Registration & Authentication",
      description: "Users create accounts based on their role (Student, Lecturer, Admin, etc.) and authenticate securely. Email verification ensures account validity."
    },
    {
      number: "2",
      title: "Role-Based Access",
      description: "Each user is assigned specific permissions based on their role. The system ensures data security by restricting access to only relevant information."
    },
    {
      number: "3",
      title: "Result Submission",
      description: "Lecturers submit grades through the intuitive interface. They can enter grades manually or upload bulk results via Excel/CSV files."
    },
    {
      number: "4",
      title: "Multi-Level Approval",
      description: "Results flow through approval workflows - from Lecturers to Exam Officers, HODs, Deans, and finally Admin for final publication."
    },
    {
      number: "5",
      title: "Verification & Auditing",
      description: "The system performs automated verification checks and maintains comprehensive audit trails of all changes and approvals."
    },
    {
      number: "6",
      title: "Result Publication",
      description: "Once all approvals are complete, results are published and students can access their grades and transcripts securely."
    }
  ];

  const features = [
    {
      icon: "🔐",
      title: "Security First",
      description: "End-to-end encryption, secure authentication, and comprehensive access controls protect sensitive academic data."
    },
    {
      icon: "⚡",
      title: "Fast & Efficient",
      description: "Streamlined workflows reduce processing time from weeks to days, enabling quick result publication."
    },
    {
      icon: "📊",
      title: "Analytics & Reporting",
      description: "Generate detailed reports and analytics on result trends, submission rates, and system performance."
    },
    {
      icon: "🔄",
      title: "Workflow Automation",
      description: "Automated notifications, reminders, and status updates keep all stakeholders informed throughout the process."
    },
    {
      icon: "📱",
      title: "User-Friendly Interface",
      description: "Intuitive design makes it easy for all users, regardless of technical expertise, to navigate and use the platform."
    },
    {
      icon: "🛡️",
      title: "Data Integrity",
      description: "Audit trails, version control, and verification systems ensure accuracy and prevent unauthorized modifications."
    }
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
            How It Works
          </h1>
          <p style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)", marginBottom: "3rem", lineHeight: "1.6" }}>
            FastResult streamlines academic result management through a secure, multi-level approval process. Here's how our platform works:
          </p>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              The Process
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {steps.map((step, index) => (
                <div key={index} style={{
                  backgroundColor: "var(--color-bg-page)",
                  padding: "2rem",
                  borderRadius: "8px",
                  borderLeft: "4px solid var(--color-primary)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "1rem"
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "0.75rem", color: "var(--color-text-primary)" }}>
                    {step.title}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              Key Features
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {features.map((feature, index) => (
                <div key={index} style={{
                  padding: "2rem",
                  backgroundColor: "var(--color-bg-page)",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: "var(--font-size-base)", marginBottom: "0.75rem", color: "var(--color-text-primary)" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", fontSize: "0.9rem" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: "var(--color-bg-page)",
            padding: "2rem",
            borderRadius: "8px",
            borderLeft: "4px solid var(--color-primary)",
            marginBottom: "2rem"
          }}>
            <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              Getting Started
            </h3>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              Ready to streamline your institution's result management? Here's how to get started:
            </p>
            <ol style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
              <li><strong>Create an Account</strong> - Register as an administrator or user with your role</li>
              <li><strong>Configure Your Institution</strong> - Set up departments, programs, and academic calendars</li>
              <li><strong>Invite Users</strong> - Add staff and students to the system</li>
              <li><strong>Start Processing Results</strong> - Begin submitting and approving results</li>
            </ol>
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
              Get Started Today
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
