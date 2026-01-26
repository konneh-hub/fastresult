import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Help() {
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

      <section style={{ flex: 1, padding: "3rem 2rem", backgroundColor: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "2rem", color: "var(--color-primary)" }}>
            Help Center
          </h1>
          
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              Getting Started
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem", lineHeight: "1.6" }}>
              FastResult is a comprehensive academic results management platform. To get started:
            </p>
            <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
              <li>Create an account or sign in if you already have one</li>
              <li>Select your role and institution</li>
              <li>Complete your profile information</li>
              <li>Start using the platform according to your role</li>
            </ul>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              User Roles
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem", lineHeight: "1.6" }}>
              FastResult supports different roles with specific permissions:
            </p>
            <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
              <li><strong>Admin:</strong> System management and user administration</li>
              <li><strong>Dean:</strong> Faculty-level result approval</li>
              <li><strong>HOD:</strong> Department coordination and oversight</li>
              <li><strong>Exam Officer:</strong> Result compilation and administration</li>
              <li><strong>Lecturer:</strong> Grade submission and management</li>
              <li><strong>Student:</strong> Result viewing and transcript access</li>
            </ul>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              For more help, please visit our <Link to="/faq" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>FAQ page</Link>.
            </p>
          </div>

          <div style={{ 
            backgroundColor: "var(--color-bg-page)", 
            padding: "1.5rem", 
            borderRadius: "6px", 
            borderLeft: "4px solid var(--color-primary)" 
          }}>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Need more help? <Link to="/contact" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>Contact our support team</Link>
            </p>
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
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
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
