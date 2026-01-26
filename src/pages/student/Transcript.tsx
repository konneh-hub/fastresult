import React from 'react';

export default function Transcript() {
  const student = {
    fullName: "John Doe",
    matricNo: "CSC/2021/001",
    programme: "Bachelor of Science in Computer Science",
    currentLevel: "300",
  };

  const transcriptData = [
    {
      level: "100",
      session: "2021/2022",
      gpa: 3.8,
      credits: 18,
      status: "Completed",
      courses: [
        { code: "CSC101", title: "Introduction to Programming", grade: "A", credits: 3 },
        { code: "MTH101", title: "Calculus I", grade: "A", credits: 4 },
      ],
    },
    {
      level: "200",
      session: "2022/2023",
      gpa: 3.65,
      credits: 18,
      status: "Completed",
      courses: [
        { code: "CSC201", title: "Data Structures", grade: "B+", credits: 3 },
        { code: "CSC202", title: "Database Systems", grade: "A", credits: 3 },
      ],
    },
  ];

  const handleDownloadTranscript = () => {
    alert("📄 Transcript downloaded successfully!");
  };

  const handleRequestTranscript = () => {
    alert("📧 Request submitted! Your official transcript will be sent to the registrar.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0 }}>📜 Academic Transcript</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>Official academic record and degree progress</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleDownloadTranscript}
            style={{
              padding: "10px 16px",
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
            📥 Download
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: "10px 16px",
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
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Student Info */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0, color: "#1e3c72" }}>Student Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Full Name</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1em", color: "#333" }}>{student.fullName}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Matric Number</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1em", color: "#333" }}>{student.matricNo}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Programme</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1em", color: "#333" }}>{student.programme}</p>
          </div>
          <div>
            <label style={{ fontSize: "0.85em", color: "#999", fontWeight: 600 }}>Current Level</label>
            <p style={{ margin: "5px 0 0 0", fontSize: "1.1em", color: "#333" }}>{student.currentLevel}</p>
          </div>
        </div>
      </div>

      {/* Transcript by Level */}
      {transcriptData.map((level, idx) => (
        <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0, color: "#1e3c72" }}>Level {level.level} - {level.session}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #2196f3" }}>
              <label style={{ fontSize: "0.85em", color: "#666" }}>GPA</label>
              <p style={{ margin: "8px 0 0 0", fontSize: "1.8em", fontWeight: 700, color: "#1565c0" }}>
                {level.gpa.toFixed(2)}
              </p>
            </div>
            <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #4caf50" }}>
              <label style={{ fontSize: "0.85em", color: "#666" }}>Credits Completed</label>
              <p style={{ margin: "8px 0 0 0", fontSize: "1.8em", fontWeight: 700, color: "#2e7d32" }}>
                {level.credits}
              </p>
            </div>
            <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #ff9800" }}>
              <label style={{ fontSize: "0.85em", color: "#666" }}>Status</label>
              <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 700, color: "#e65100" }}>
                {level.status}
              </p>
            </div>
          </div>

          {/* Courses Table */}
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9em",
          }}>
            <thead>
              <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#333" }}>Course Code</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#333" }}>Course Title</th>
                <th style={{ padding: "12px", textAlign: "center", fontWeight: 600, color: "#333" }}>Grade</th>
                <th style={{ padding: "12px", textAlign: "center", fontWeight: 600, color: "#333" }}>Credits</th>
              </tr>
            </thead>
            <tbody>
              {level.courses.map((course, cidx) => (
                <tr key={cidx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#2a5298" }}>{course.code}</td>
                  <td style={{ padding: "12px", color: "#555" }}>{course.title}</td>
                  <td style={{ padding: "12px", textAlign: "center", fontWeight: 600, color: "#2e7d32" }}>{course.grade}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#555" }}>{course.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Overall Summary */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginTop: 0, color: "#1e3c72" }}>Cumulative Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
          <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #2196f3" }}>
            <label style={{ fontSize: "0.85em", color: "#666" }}>Cumulative GPA</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.8em", fontWeight: 700, color: "#1565c0" }}>3.73</p>
          </div>
          <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #4caf50" }}>
            <label style={{ fontSize: "0.85em", color: "#666" }}>Total Credits Earned</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.8em", fontWeight: 700, color: "#2e7d32" }}>36</p>
          </div>
          <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #ff9800" }}>
            <label style={{ fontSize: "0.85em", color: "#666" }}>Standing</label>
            <p style={{ margin: "8px 0 0 0", fontSize: "1.1em", fontWeight: 700, color: "#e65100" }}>Good Academic Standing</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginTop: 0, color: "#1e3c72" }}>Actions</h3>
        <button
          onClick={handleRequestTranscript}
          style={{
            padding: "10px 16px",
            background: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f57c00")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ff9800")}
        >
          📧 Request Official Transcript
        </button>
      </div>

      <style>{`
        @media print {
          button, h1 { display: none !important; }
          table { width: 100%; margin-top: 20px; }
        }
      `}</style>
    </div>
  );
}
