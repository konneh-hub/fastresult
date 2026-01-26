import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the email or contact data to your backend
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

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
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "1rem", color: "var(--color-primary)" }}>
            Contact Us
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
            Have questions or need assistance? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>

          {submitted ? (
            <div style={{
              backgroundColor: "#DCFCE7",
              border: "1px solid #86EFAC",
              borderRadius: "6px",
              padding: "1.5rem",
              textAlign: "center",
              color: "#166534"
            }}>
              <p style={{ fontSize: "var(--font-size-base)", fontWeight: 600, marginBottom: "0.5rem" }}>
                ✓ Message Sent Successfully
              </p>
              <p style={{ fontSize: "var(--font-size-sm)" }}>
                Thank you for contacting us. We'll respond to your message shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-primary)"
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "var(--font-size-base)",
                    fontFamily: "var(--font-family)"
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-primary)"
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "var(--font-size-base)",
                    fontFamily: "var(--font-family)"
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-primary)"
                }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "var(--font-size-base)",
                    fontFamily: "var(--font-family)"
                  }}
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 500,
                  color: "var(--color-text-primary)"
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "var(--font-size-base)",
                    fontFamily: "var(--font-family)",
                    resize: "vertical"
                  }}
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-bg-white)",
                  border: "none",
                  padding: "0.875rem 2rem",
                  borderRadius: "6px",
                  fontSize: "var(--font-size-base)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                Send Message
              </button>
            </form>
          )}

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)" }}>
            <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "1rem", color: "var(--color-text-primary)" }}>
              Other Ways to Reach Us
            </h3>
            <ul style={{ color: "var(--color-text-secondary)", lineHeight: "1.8", marginLeft: "1.5rem" }}>
              <li><strong>Email:</strong> support@fastresult.com</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
              <li><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (EST)</li>
            </ul>
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
