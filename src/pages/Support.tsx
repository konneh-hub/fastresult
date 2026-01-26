import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Support() {
  const supportCategories = [
    {
      icon: "❓",
      title: "FAQ",
      description: "Find answers to frequently asked questions",
      link: "/faq"
    },
    {
      icon: "🆘",
      title: "Help Center",
      description: "Browse our comprehensive help documentation",
      link: "/help"
    },
    {
      icon: "📧",
      title: "Contact Us",
      description: "Get in touch with our support team",
      link: "/contact"
    },
    {
      icon: "🐛",
      title: "Report a Bug",
      description: "Let us know if you encounter any issues",
      link: "/contact"
    }
  ];

  const commonIssues = [
    {
      question: "I forgot my password",
      answer: "Click 'Forgot Password' on the login page and follow the email instructions to reset it."
    },
    {
      question: "How do I upload results in bulk?",
      answer: "Use the 'Upload Excel' feature in the Lecturer portal. Download the template first and fill in your data."
    },
    {
      question: "When can I edit submitted results?",
      answer: "Results can be edited within the correction window set by your institution. Check with your Exam Officer for dates."
    },
    {
      question: "Why can't I see other department results?",
      answer: "FastResult restricts access based on your role for data security. Contact your admin if you need additional access."
    },
    {
      question: "How do students view their results?",
      answer: "Students log in with their credentials and can view published results in their Student Dashboard."
    },
    {
      question: "How is my data backed up?",
      answer: "We maintain automated daily backups of all data to ensure no information is lost."
    }
  ];

  const supportChannels = [
    {
      channel: "Email",
      info: "support@fastresult.com",
      responseTime: "Within 24 hours"
    },
    {
      channel: "Phone",
      info: "+1 (555) 123-4567",
      responseTime: "Business hours (EST)"
    },
    {
      channel: "Live Chat",
      info: "Available in the platform",
      responseTime: "Typically within 5 minutes"
    },
    {
      channel: "Knowledge Base",
      info: "Self-service articles and guides",
      responseTime: "Instant access"
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
            Support & Resources
          </h1>
          <p style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)", marginBottom: "3rem", lineHeight: "1.6" }}>
            We're here to help. Find resources, ask questions, or contact our support team.
          </p>

          {/* Support Categories */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              How Can We Help?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
              {supportCategories.map((category, index) => (
                <Link
                  key={index}
                  to={category.link}
                  style={{
                    textDecoration: "none",
                    backgroundColor: "var(--color-bg-page)",
                    padding: "2rem",
                    borderRadius: "8px",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: "2.5rem" }}>
                    {category.icon}
                  </div>
                  <h3 style={{ fontSize: "var(--font-size-lg)", color: "var(--color-primary)" }}>
                    {category.title}
                  </h3>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              Common Issues & Solutions
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {commonIssues.map((issue, index) => (
                <details
                  key={index}
                  style={{
                    backgroundColor: "var(--color-bg-page)",
                    padding: "1.5rem",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer"
                  }}
                >
                  <summary style={{
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    fontSize: "1rem",
                    userSelect: "none"
                  }}>
                    {issue.question}
                  </summary>
                  <div style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                    lineHeight: "1.6"
                  }}>
                    {issue.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "2rem", color: "var(--color-text-primary)" }}>
              Support Channels
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
              {supportChannels.map((support, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "var(--color-bg-page)",
                    padding: "2rem",
                    borderRadius: "8px",
                    borderLeft: "4px solid var(--color-primary)"
                  }}
                >
                  <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "0.5rem", color: "var(--color-primary)" }}>
                    {support.channel}
                  </h3>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>
                    {support.info}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Response: {support.responseTime}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorials */}
          <div style={{
            backgroundColor: "#EFF6FF",
            padding: "2rem",
            borderRadius: "8px",
            borderLeft: "4px solid var(--color-primary)",
            marginBottom: "2rem"
          }}>
            <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              📹 Video Tutorials
            </h3>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
              Check out our video tutorials to learn how to use FastResult:
            </p>
            <ul style={{ color: "var(--color-text-secondary)", marginLeft: "2rem", lineHeight: "1.8" }}>
              <li>Getting Started with FastResult</li>
              <li>How to Submit Results</li>
              <li>Bulk Upload Guide</li>
              <li>Understanding the Approval Workflow</li>
              <li>Managing User Accounts</li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
              Didn't find what you're looking for?
            </p>
            <Link to="/contact" style={{
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
              Contact Support
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
