import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 980) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home">
      {/* ===== TOP NAV ===== */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">ResultApp</div>

          <div id="nav-links" className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#roles" onClick={() => setMenuOpen(false)}>Roles</a>
          </div>

          <div className="nav-controls">
            <Link to="/register" className="nav-cta">Register</Link>
            <button
              className={`nav-toggle ${menuOpen ? "open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-controls="nav-links"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <p className="badge">Student Result Management System</p>
            <h1>Manage results securely. Publish faster. Reduce errors.</h1>
            <p className="sub">
              A centralized platform for universities and colleges to upload,
              review, approve, and publish results with role-based access.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Get Started
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Go to Dashboard
              </Link>
            </div>

            <div className="hero-points">
              <div className="point">
                <span className="dot" />
                Role-based access control
              </div>
              <div className="point">
                <span className="dot" />
                Approval workflow (HOD → Dean → Exam Officer)
              </div>
              <div className="point">
                <span className="dot" />
                Student portal for result viewing
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-top">
              <div className="card-title">Quick Overview</div>
              <div className="card-sub">What you can do inside ResultApp</div>
            </div>

            <div className="mini-list">
              <div className="mini-item">
                <span className="mini-icon">✓</span>
                Upload scores per course
              </div>
              <div className="mini-item">
                <span className="mini-icon">✓</span>
                Validate & reduce grading errors
              </div>
              <div className="mini-item">
                <span className="mini-icon">✓</span>
                Generate transcripts / slips (optional)
              </div>
              <div className="mini-item">
                <span className="mini-icon">✓</span>
                Publish to student portal after approval
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* ===== TRUST / STATS ===== */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat">
            <div className="stat-number">Secure</div>
            <div className="stat-label">Authentication & permissions</div>
          </div>
          <div className="stat">
            <div className="stat-number">Fast</div>
            <div className="stat-label">Upload → approval → publish</div>
          </div>
          <div className="stat">
            <div className="stat-number">Accurate</div>
            <div className="stat-label">Validation to reduce mistakes</div>
          </div>
          <div className="stat">
            <div className="stat-number">Clear</div>
            <div className="stat-label">Audit trail & accountability</div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-head">
            <h2>Features built for academic workflows</h2>
            <p>
              Everything you need to manage results from entry to final
              publication, without confusion.
            </p>
          </div>

          <div className="grid">
            <div className="card">
              <h3>Role-Based Access</h3>
              <p>
                Each user only sees the tools they need: Admin, Lecturer, HOD,
                Dean, Exam Officer, and Student.
              </p>
            </div>

            <div className="card">
              <h3>Approval Workflow</h3>
              <p>
                Results move through review and approval stages before
                publication to students.
              </p>
            </div>

            <div className="card">
              <h3>Result Validation</h3>
              <p>
                Detect missing grades, invalid score ranges, duplicates, or
                mismatched course entries.
              </p>
            </div>

            <div className="card">
              <h3>Audit Log</h3>
              <p>
                Track who uploaded, edited, approved, or published results — for
                accountability.
              </p>
            </div>

            <div className="card">
              <h3>Student Portal</h3>
              <p>
                Students view their results safely, with clear semester and
                course breakdown.
              </p>
            </div>

            <div className="card">
              <h3>Reports & Exports</h3>
              <p>
                Generate department summaries, class sheets, and exports for
                printing or archiving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section alt" id="how">
        <div className="section-inner">
          <div className="section-head">
            <h2>How it works</h2>
            <p>A simple flow that mirrors real university procedures.</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-no">1</div>
              <div>
                <h3>Lecturer uploads scores</h3>
                <p>Enter or import results by course and class list.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-no">2</div>
              <div>
                <h3>Department review (HOD)</h3>
                <p>Verify correctness, completeness, and course alignment.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-no">3</div>
              <div>
                <h3>Faculty approval (Dean)</h3>
                <p>Confirm readiness before publishing results.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-no">4</div>
              <div>
                <h3>Publish (Exam Officer)</h3>
                <p>Release results to the student portal with an audit trail.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROLES ===== */}
      <section className="section" id="roles">
        <div className="section-inner">
          <div className="section-head">
            <h2>Designed for every role</h2>
            <p>Clear responsibilities for smooth operations.</p>
          </div>

          <div className="roles">
            <div className="role">
              <h3>Admin</h3>
              <p>Manage users, departments, programs, courses, and settings.</p>
            </div>
            <div className="role">
              <h3>Lecturer</h3>
              <p>Upload and manage scores for assigned courses.</p>
            </div>
            <div className="role">
              <h3>HOD</h3>
              <p>Review departmental results and request corrections.</p>
            </div>
            <div className="role">
              <h3>Dean</h3>
              <p>Approve faculty results for publication.</p>
            </div>
            <div className="role">
              <h3>Exam Officer</h3>
              <p>Final publishing, reports, and administrative checks.</p>
            </div>
            <div className="role">
              <h3>Student</h3>
              <p>View personal results securely after publication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="cta">
        <div className="cta-inner">
          <h2>Ready to manage results properly?</h2>
          <p>Login to start uploading, reviewing, or viewing results.</p>
          <div className="cta-actions">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-brand">ResultApp</div>
            <p>Secure academic result management for institutions.</p>
          </div>

          <div className="footer-right">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#roles">Roles</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms &amp; Conditions</a>
          </div>

          <div className="footer-contact">
            <strong>Support & Contact Info</strong>
            <div>📧 Email: <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></div>
            <div>📞 Phone: +232 xxx xxx xxx</div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} ResultApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
