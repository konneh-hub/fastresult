import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Privacy() {
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
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "2rem", color: "var(--color-primary)" }}>
            Privacy Policy
          </h1>

          <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
            <p>Last updated: January 2024</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                1. Information We Collect
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                We collect information that you provide directly, such as when you create an account, update your profile, or contact us. This may include your name, email address, institutional affiliation, and academic information.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                2. How We Use Your Information
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                Your information is used to:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Provide and maintain our services</li>
                <li>Process your requests and transactions</li>
                <li>Send administrative communications</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                3. Data Security
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use encryption protocols and secure servers to safeguard your data.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                4. Data Retention
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                5. Your Rights
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Access to your personal data</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your data</li>
                <li>Opt-out of certain communications</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                6. Contact Us
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                If you have questions about this Privacy Policy or our privacy practices, please <Link to="/contact" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>contact us</Link>.
              </p>
            </section>
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
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/security">Security</Link></li>
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
