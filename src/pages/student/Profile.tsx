import React, { useState } from 'react';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@university.edu",
    phone: "+234 801 234 5678",
    address: "123 Main Street, Lagos",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    matricNo: "CSC/2021/001",
    programme: "Bachelor of Science in Computer Science",
    department: "Department of Computer Science",
    faculty: "Faculty of Science",
    admissionYear: "2021",
    currentLevel: "300",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("✅ Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0 }}>👤 My Profile</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>View and manage your student profile information</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          style={{
            padding: "10px 16px",
            background: editing ? "#dc3545" : "#2a5298",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {editing ? "❌ Cancel" : "✏️ Edit Profile"}
        </button>
      </div>

      {/* Academic Info */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, color: "#1e3c72" }}>📚 Academic Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Matric Number</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 600, color: "#333" }}>{formData.matricNo}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Programme</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 600, color: "#333" }}>{formData.programme}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Department</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 600, color: "#333" }}>{formData.department}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Faculty</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 600, color: "#333" }}>{formData.faculty}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Admission Year</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 600, color: "#333" }}>{formData.admissionYear}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Current Level</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 600, color: "#333" }}>{formData.currentLevel}</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, color: "#1e3c72" }}>👤 Personal Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.95em", color: "#333" }}>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95em",
                backgroundColor: editing ? "white" : "#f9f9f9",
                cursor: editing ? "text" : "default",
              }}
            />
          </div>
        </div>

        {editing && (
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #ddd", display: "flex", gap: "12px" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#45a049")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4caf50")}
            >
              ✅ Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "10px 20px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c82333")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#dc3545")}
            >
              ❌ Discard Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
