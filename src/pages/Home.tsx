import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-icon">📚</div>
            <span className="brand-text">FastResult</span>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#roles" onClick={() => setMenuOpen(false)}>Institutions</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <Link to="/login" className="nav-login-btn">Login</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Academic Results Management</h1>
            <p className="hero-subtitle">
              Secure, efficient, and transparent result processing for educational institutions
            </p>
            <button className="cta-button" onClick={() => navigate("/login")}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Key Features</h2>
          <p>Everything needed for secure result management</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Access</h3>
            <p>Role-based permissions ensure only authorized users access sensitive data</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Multi-Level Approval</h3>
            <p>Streamlined approval workflows from creation to publication</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📥</div>
            <h3>Easy Upload</h3>
            <p>Intuitive interface for managing academic results</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Analytics</h3>
            <p>Track and monitor result processing metrics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Admin Controls</h3>
            <p>Comprehensive administrative tools for system management</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Data Integrity</h3>
            <p>Audit trails and verification systems ensure accuracy</p>
          </div>
        </div>
      </section>

      <section className="roles-section" id="roles">
        <div className="section-header">
          <h2>Built for Educational Institutions</h2>
          <p>Designed for every stakeholder in the academic ecosystem</p>
        </div>
        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon">👨‍💼</div>
            <h3>Admin</h3>
            <p>System oversight and user management</p>
          </div>
          <div className="role-card">
            <div className="role-icon">🎓</div>
            <h3>Dean</h3>
            <p>Faculty-level approval of results</p>
          </div>
          <div className="role-card">
            <div className="role-icon">📋</div>
            <h3>HOD</h3>
            <p>Department management and coordination</p>
          </div>
          <div className="role-card">
            <div className="role-icon">📝</div>
            <h3>Exam Officer</h3>
            <p>Result compilation and administration</p>
          </div>
          <div className="role-card">
            <div className="role-icon">👨‍🏫</div>
            <h3>Lecturer</h3>
            <p>Submit grades securely</p>
          </div>
          <div className="role-card">
            <div className="role-icon">👨‍🎓</div>
            <h3>Student</h3>
            <p>View results and transcripts</p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2>About FastResult</h2>
            <p>
              FastResult is a modern academic results management platform designed to streamline 
              how educational institutions handle, approve, and publish student results.
            </p>
            <p>
              From lecturers submitting grades to students accessing results, our system 
              ensures every step is secure, efficient, and audit-compliant.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to streamline results management?</h2>
          <p>Join institutions worldwide that trust FastResult</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/register")}>
              Create Account
            </button>
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
              <li><a href="#features">Features</a></li>
              <li><a href="#roles">Institutions</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Contact</a></li>
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
