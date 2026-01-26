import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Security() {
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
            Security & Compliance
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Data Encryption
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3 encryption. At-rest data is encrypted using AES-256 encryption to protect sensitive information.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Authentication & Access Control
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                We implement multiple layers of authentication and access control:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Secure password requirements and storage</li>
                <li>Role-based access control (RBAC)</li>
                <li>Multi-factor authentication support</li>
                <li>Session management and timeout policies</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Audit Logging
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                All user activities are logged and monitored. Audit trails are maintained to track who accessed what data and when, ensuring accountability and enabling investigation of any security incidents.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Infrastructure Security
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                Our infrastructure includes:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Firewalls and intrusion detection systems</li>
                <li>Regular security patches and updates</li>
                <li>DDoS protection</li>
                <li>Redundant systems and backup procedures</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Compliance
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                FastResult complies with:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Data Protection Regulations (GDPR, CCPA)</li>
                <li>FERPA (Family Educational Rights and Privacy Act)</li>
                <li>ISO 27001 Information Security Management</li>
                <li>SOC 2 Type II compliance</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Vulnerability Management
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                We conduct regular security assessments, penetration testing, and code reviews. We maintain a responsible disclosure program and encourage security researchers to report vulnerabilities responsibly.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Incident Response
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                In the event of a security incident, we have established procedures to investigate, contain, and remediate the issue. We will notify affected parties as required by law and maintain detailed incident records.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                Report Security Issues
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                If you discover a security vulnerability, please email security@fastresult.com with details. Do not disclose the vulnerability publicly until we have had an opportunity to address it.
              </p>
            </section>

            <div style={{
              backgroundColor: "var(--color-bg-page)",
              padding: "1.5rem",
              borderRadius: "6px",
              borderLeft: "4px solid var(--color-primary)",
              marginTop: "2rem"
            }}>
              <p style={{ color: "var(--color-text-secondary)" }}>
                For security questions or concerns, please <Link to="/contact" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>contact us</Link>.
              </p>
            </div>
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
