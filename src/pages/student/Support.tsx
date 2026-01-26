import React, { useState } from 'react';

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [submitted, setSubmitted] = useState(false);

  const faqItems = [
    {
      category: 'general',
      question: 'How do I access my results?',
      answer: 'You can view your results by clicking on "My Results" in the sidebar under the Academics section. Results are typically published within 2-3 weeks after the examination period.',
    },
    {
      category: 'general',
      question: 'How do I download my transcript?',
      answer: 'Go to the "Transcript" section to view and download your official academic transcript. You can also request certified copies through the same section.',
    },
    {
      category: 'academic',
      question: 'What is the grading scale used?',
      answer: 'Our institution uses a 5.0 GPA scale. Grades A-F correspond to specific point values. The pass mark is typically 40/100 or above.',
    },
    {
      category: 'academic',
      question: 'Can I request a grade review?',
      answer: 'Yes. If you believe your grade is incorrect, you can request a grade review from your course instructor. Contact the exam office for formal appeal procedures.',
    },
    {
      category: 'technical',
      question: 'I cannot access the portal. What should I do?',
      answer: 'Ensure you are using the correct login credentials. Clear your browser cache and cookies. If the problem persists, contact IT support at support@university.edu.',
    },
    {
      category: 'technical',
      question: 'The portal is very slow. How can I improve the experience?',
      answer: 'Try using a different browser or device. Ensure your internet connection is stable. Avoid accessing during peak hours (8 AM - 5 PM) if possible.',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Support ticket submitted!\n\nSubject: ${formData.subject}\n\nWe'll respond to your inquiry within 24 hours.`);
    setFormData({ subject: '', message: '', category: 'general' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const filteredFAQ = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div>
        <h1 style={{ margin: 0 }}>❓ Support Center</h1>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>Get help and answers to your questions</p>
      </div>

      {/* Contact Support Section */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", marginTop: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, color: "#1e3c72" }}>📧 Contact Support</h2>
        {submitted && (
          <div style={{
            padding: "12px 16px",
            background: "#e8f5e9",
            color: "#2e7d32",
            borderLeft: "4px solid #4caf50",
            marginBottom: "20px",
            borderRadius: "4px",
          }}>
            ✅ Your support ticket has been submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                cursor: "pointer",
              }}
            >
              <option value="general">General Inquiry</option>
              <option value="academic">Academic Issue</option>
              <option value="technical">Technical Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Brief subject of your inquiry"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Describe your issue or question in detail"
              required
              rows={6}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                fontFamily: "inherit",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#2a5298",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3c72")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2a5298")}
          >
            📤 Submit Ticket
          </button>
        </form>
      </div>

      {/* Contact Information */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginBottom: "20px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e3c72" }}>📧 Email Support</h3>
          <p style={{ margin: 0, color: "#666" }}>support@university.edu</p>
          <p style={{ margin: "5px 0 0 0", fontSize: "0.85em", color: "#999" }}>Response time: Within 24 hours</p>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e3c72" }}>📞 Phone Support</h3>
          <p style={{ margin: 0, color: "#666" }}>+234 (0) 800 123 4567</p>
          <p style={{ margin: "5px 0 0 0", fontSize: "0.85em", color: "#999" }}>Mon - Fri: 8 AM - 5 PM</p>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e3c72" }}>🏢 Visit Us</h3>
          <p style={{ margin: 0, color: "#666" }}>Student Support Office</p>
          <p style={{ margin: "5px 0 0 0", fontSize: "0.85em", color: "#999" }}>Building A, Room 101</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, color: "#1e3c72" }}>❓ Frequently Asked Questions</h2>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {['all', 'general', 'academic', 'technical'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "8px 16px",
                background: selectedCategory === category ? "#2a5298" : "#f0f0f0",
                color: selectedCategory === category ? "white" : "#333",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9em",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = "#e0e0e0";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = "#f0f0f0";
                }
              }}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredFAQ.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#f9f9f9",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <details style={{ cursor: "pointer" }}>
                <summary style={{
                  padding: "15px",
                  fontWeight: 600,
                  color: "#333",
                  backgroundColor: "#f5f5f5",
                  userSelect: "none",
                }}>
                  {item.question}
                </summary>
                <div style={{
                  padding: "15px",
                  color: "#666",
                  borderTop: "1px solid #e0e0e0",
                  lineHeight: "1.6",
                }}>
                  {item.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
