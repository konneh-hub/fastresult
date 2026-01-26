import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Terms() {
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
            Terms of Service
          </h1>

          <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
            <p>Last updated: January 2024</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                By accessing and using FastResult, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                2. Use License
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                Permission is granted to temporarily download one copy of the materials (information or software) on FastResult for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the site</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                3. Disclaimer
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                The materials on FastResult are provided on an 'as is' basis. FastResult makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                4. Limitations
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                In no event shall FastResult or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the FastResult site, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                5. User Accounts
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                You are responsible for maintaining the confidentiality of your account information and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                6. Prohibited Activities
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                You agree not to:
              </p>
              <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
                <li>Engage in any form of harassment or abuse</li>
                <li>Access or search the service by any means other than publicly supported interfaces</li>
                <li>Attempt to gain unauthorized access to any portions of the service</li>
                <li>Use the service for any illegal purpose or in violation of any laws</li>
                <li>Violate the intellectual property rights of any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                7. Governing Law
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the service is provided, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
                8. Contact
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                If you have any questions about these Terms of Service, please <Link to="/contact" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>contact us</Link>.
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
