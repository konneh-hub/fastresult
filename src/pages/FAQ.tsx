import React from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page. Follow the email instructions to set a new password."
    },
    {
      question: "Who can access student results?",
      answer: "Students can view their own results. Staff members (Lecturers, Exam Officers, HODs, Deans, Admins) can access results according to their role permissions."
    },
    {
      question: "How long are results kept in the system?",
      answer: "Results are maintained for the academic lifetime of the student in the system. Archived results can be accessed through the transcript feature."
    },
    {
      question: "Can results be modified after submission?",
      answer: "Results can only be modified by authorized personnel (Lecturers, Exam Officers) within the designated revision period. Once finalized, results are locked."
    },
    {
      question: "What file formats are supported for bulk uploads?",
      answer: "We support Excel (.xlsx, .xls) and CSV (.csv) formats for bulk result uploads. Templates are provided for each upload type."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through the Contact Us page or email support@fastresult.com for technical assistance."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all data is encrypted and protected. We comply with data protection regulations and maintain regular security audits."
    },
    {
      question: "What browsers are supported?",
      answer: "FastResult works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend updating to the latest version."
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

      <section style={{ flex: 1, padding: "3rem 2rem", backgroundColor: "var(--color-bg-white)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "0.5rem", color: "var(--color-primary)" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
            Find answers to common questions about FastResult
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                backgroundColor: "var(--color-bg-page)",
                padding: "1.5rem",
                borderRadius: "6px",
                borderLeft: "4px solid var(--color-primary)"
              }}>
                <h3 style={{ 
                  fontSize: "var(--font-size-base)", 
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  marginBottom: "0.75rem"
                }}>
                  {faq.question}
                </h3>
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: "2rem",
            backgroundColor: "var(--color-bg-page)", 
            padding: "1.5rem", 
            borderRadius: "6px", 
            borderLeft: "4px solid var(--color-primary)" 
          }}>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Didn't find your answer? <Link to="/contact" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>Contact our support team</Link>
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
