import React, { useState } from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiEye } from "react-icons/fi";
import "../admin/AdminPages.css";

interface StudentRegistration {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  matricNo: string;
  faculty: string;
  department: string;
  program: string;
  level: string;
  status: "pending_verification" | "active" | "rejected";
  registrationDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export default function AdminVerificationPage() {
  const [studentRegistrations, setStudentRegistrations] = useState<StudentRegistration[]>([
    {
      id: "1",
      fullName: "John Doe",
      email: "john.doe@student.edu",
      phone: "+234 801 234 5678",
      matricNo: "MAT/2024/001",
      faculty: "Faculty of Science",
      department: "Computer Science",
      program: "Degree",
      level: "Year 1",
      status: "pending_verification",
      registrationDate: "2024-01-22"
    },
    {
      id: "2",
      fullName: "Jane Smith",
      email: "jane.smith@student.edu",
      phone: "+234 802 345 6789",
      matricNo: "MAT/2024/002",
      faculty: "Faculty of Engineering",
      department: "Civil Engineering",
      program: "Diploma",
      level: "Year 2",
      status: "pending_verification",
      registrationDate: "2024-01-21"
    },
    {
      id: "3",
      fullName: "Michael Johnson",
      email: "michael.johnson@student.edu",
      phone: "+234 803 456 7890",
      matricNo: "MAT/2024/003",
      faculty: "Faculty of Arts",
      department: "English",
      program: "Degree",
      level: "Year 3",
      status: "pending_verification",
      registrationDate: "2024-01-20"
    },
    {
      id: "4",
      fullName: "Sarah Williams",
      email: "sarah.williams@student.edu",
      phone: "+234 804 567 8901",
      matricNo: "MAT/2023/045",
      faculty: "Faculty of Business",
      department: "Accounting",
      program: "Certificate",
      level: "Year 1",
      status: "active",
      registrationDate: "2023-12-15",
      verifiedDate: "2024-01-19",
      verifiedBy: "admin"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending_verification" | "active" | "rejected">("all");

  const handleApproveStudent = (id: string) => {
    setStudentRegistrations(studentRegistrations.map(s =>
      s.id === id ? {
        ...s,
        status: "active",
        verifiedDate: new Date().toISOString().split("T")[0],
        verifiedBy: "admin"
      } : s
    ));
    setShowDetailsModal(false);
    setSelectedStudent(null);
  };

  const handleRejectStudent = (id: string, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setStudentRegistrations(studentRegistrations.map(s =>
      s.id === id ? {
        ...s,
        status: "rejected",
        rejectionReason: reason
      } : s
    ));
    setShowDetailsModal(false);
    setSelectedStudent(null);
    setRejectionReason("");
    setShowRejectionForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_verification": return "#F97316";
      case "active": return "#22C55E";
      case "rejected": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_verification": return <FiClock size={18} />;
      case "active": return <FiCheckCircle size={18} />;
      case "rejected": return <FiXCircle size={18} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_verification": return "Pending Verification";
      case "active": return "Active";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const filteredStudents = studentRegistrations.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = studentRegistrations.filter(s => s.status === "pending_verification").length;
  const activeCount = studentRegistrations.filter(s => s.status === "active").length;
  const rejectedCount = studentRegistrations.filter(s => s.status === "rejected").length;

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, marginBottom: "1rem" }}>Student Registration Verification</h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: "0.95rem" }}>
          Verify and approve student registrations. Each student must be verified before they can access the system.
        </p>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="metric-card" style={{ borderLeftColor: "#F97316" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748B" }}>Pending Verification</h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{pendingCount}</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>Awaiting approval</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: "#22C55E" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748B" }}>Verified Students</h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{activeCount}</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>Active accounts</p>
        </div>
        <div className="metric-card" style={{ borderLeftColor: "#EF4444" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748B" }}>Rejected</h3>
          <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{rejectedCount}</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>Not approved</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="metric-card" style={{ padding: "1.5rem", borderLeft: "none", marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>
              Search Students
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or matric number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                fontSize: "0.95rem",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                fontSize: "0.95rem",
                boxSizing: "border-box"
              }}
            >
              <option value="all">All Students</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="active">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="metric-card" style={{ padding: "1.5rem", borderLeft: "none" }}>
        <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          Student Registrations ({filteredStudents.length})
        </h2>

        {filteredStudents.length === 0 ? (
          <p style={{ color: "#64748B", textAlign: "center", padding: "2rem" }}>
            No students found matching your criteria
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
                  <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Full Name</th>
                  <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Matric No.</th>
                  <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Faculty</th>
                  <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Department</th>
                  <th style={{ textAlign: "center", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Status</th>
                  <th style={{ textAlign: "center", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "1rem" }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{student.fullName}</div>
                        <div style={{ fontSize: "0.875rem", color: "#64748B" }}>{student.registrationDate}</div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 500 }}>{student.matricNo}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{student.email}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                      <span style={{
                        background: "#F3F4F6",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem"
                      }}>
                        {student.faculty.replace("Faculty of ", "")}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{student.department}</td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        justifyContent: "center",
                        color: getStatusColor(student.status),
                        fontWeight: 600,
                        fontSize: "0.875rem"
                      }}>
                        {getStatusIcon(student.status)}
                        {getStatusLabel(student.status)}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {student.status === "pending_verification" ? (
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailsModal(true);
                          }}
                          style={{
                            background: "#3B82F6",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            margin: "0 auto"
                          }}
                        >
                          <FiEye size={14} /> Review
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.875rem", color: "#64748B" }}>
                          {student.status === "active" ? "✓ Verified" : "✗ Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Student Registration Details</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              background: "#F8FAFC",
              padding: "1.5rem",
              borderRadius: "4px",
              marginBottom: "1.5rem"
            }}>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Full Name</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.fullName}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Matric Number</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.matricNo}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Email Address</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.email}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Phone Number</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.phone || "N/A"}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Faculty</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.faculty}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Department</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.department}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Program</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.program}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Academic Level</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.level}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Registration Date</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{selectedStudent.registrationDate}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#64748B" }}>Status</p>
                <p style={{
                  margin: 0,
                  fontWeight: 600,
                  color: getStatusColor(selectedStudent.status)
                }}>
                  {getStatusLabel(selectedStudent.status)}
                </p>
              </div>
            </div>

            {selectedStudent.status === "rejected" && selectedStudent.rejectionReason && (
              <div style={{
                background: "#FEE2E2",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #EF4444"
              }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#7F1D1D" }}>Rejection Reason</p>
                <p style={{ margin: 0, color: "#991B1B" }}>{selectedStudent.rejectionReason}</p>
              </div>
            )}

            {selectedStudent.status === "active" && selectedStudent.verifiedDate && (
              <div style={{
                background: "#DCFCE7",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #22C55E"
              }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#15803D" }}>Verification Details</p>
                <p style={{ margin: 0, color: "#166534" }}>
                  Verified on {selectedStudent.verifiedDate} by {selectedStudent.verifiedBy}
                </p>
              </div>
            )}

            {selectedStudent.status === "pending_verification" && !showRejectionForm && (
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #E2E8F0",
                    background: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRejectionForm(true)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#EF4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveStudent(selectedStudent.id)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#22C55E",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Approve
                </button>
              </div>
            )}

            {showRejectionForm && (
              <div style={{
                background: "#FEF2F2",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1.5rem"
              }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this registration..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #FED7D7",
                    borderRadius: "4px",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                    minHeight: "100px",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />
                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                  <button
                    onClick={() => setShowRejectionForm(false)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      border: "1px solid #FED7D7",
                      background: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#7F1D1D"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectStudent(selectedStudent.id, rejectionReason)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Reject Registration
                  </button>
                </div>
              </div>
            )}

            {selectedStudent.status !== "pending_verification" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #E2E8F0",
                    background: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
