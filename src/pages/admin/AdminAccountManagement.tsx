import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import "../admin/AdminPages.css";

interface AccountRequest {
  id: string;
  name: string;
  role: "dean" | "hod" | "exam_officer" | "lecturer";
  email: string;
  staffId: string;
  faculty?: string;
  department?: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  reason?: string;
}

export default function AdminAccountManagement() {
  const [accounts, setAccounts] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch accounts from backend on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("authToken");
        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        
        // Only add auth header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers
        });

        if (!response.ok) {
          console.warn("Could not fetch accounts from backend:", response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        // Transform backend data to AccountRequest format
        const transformedAccounts: AccountRequest[] = (data || []).map((user: any) => ({
          id: user.id?.toString() || user.user_id?.toString(),
          name: user.full_name || user.fullName || "Unknown",
          role: (user.role || "lecturer").toLowerCase() as any,
          email: user.email,
          staffId: user.staff_id || user.staffId || "",
          faculty: user.faculty,
          department: user.department,
          status: "approved",
          requestDate: new Date(user.created_at || user.createdAt || Date.now()).toISOString().split("T")[0]
        }));

        setAccounts(transformedAccounts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        // Don't show error alert - just load with empty state
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<AccountRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "dean" as const,
    email: "",
    staffId: "",
    faculty: "",
    department: ""
  });

  const roles = [
    { value: "dean", label: "Dean" },
    { value: "hod", label: "Head of Department" },
    { value: "exam_officer", label: "Exam Officer" },
    { value: "lecturer", label: "Lecturer" }
  ];

  const faculties = [
    "Faculty of Science",
    "Faculty of Engineering",
    "Faculty of Arts",
    "Faculty of Law"
  ];

  const departments = {
    "Faculty of Science": ["Computer Science", "Mathematics", "Physics"],
    "Faculty of Engineering": ["Civil Engineering", "Mechanical Engineering"],
    "Faculty of Arts": ["History", "English", "Philosophy"],
    "Faculty of Law": ["Public Law", "Private Law"]
  };

  // Function to refresh accounts from backend
  const refreshAccounts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      // Only add auth header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers
      });

      if (!response.ok) {
        console.warn("Could not refresh accounts");
        return;
      }

      const data = await response.json();
      
      // Transform backend data to AccountRequest format
      const transformedAccounts: AccountRequest[] = (data || []).map((user: any) => ({
        id: user.id?.toString() || user.user_id?.toString(),
        name: user.full_name || user.fullName || "Unknown",
        role: (user.role || "lecturer").toLowerCase() as any,
        email: user.email,
        staffId: user.staff_id || user.staffId || "",
        faculty: user.faculty,
        department: user.department,
        status: "approved",
        requestDate: new Date(user.created_at || user.createdAt || Date.now()).toISOString().split("T")[0]
      }));

      setAccounts(transformedAccounts);
    } catch (err) {
      console.error("Error refreshing accounts:", err);
    }
  };

  const handleAddAccount = async () => {
    if (!formData.name || !formData.email || !formData.staffId) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      setAccounts(accounts.map(a => a.id === editingId ? { ...a, ...formData, status: "pending" } : a));
      alert("Account updated successfully");
      setFormData({ name: "", role: "dean", email: "", staffId: "", faculty: "", department: "" });
      setShowForm(false);
      setEditingId(null);
      return;
    }

    try {
      // Prepare data for backend - map role names and add faculty/department
      const payload = {
        role: formData.role,
        fullName: formData.name,
        email: formData.email,
        staffId: formData.staffId,
        faculty: formData.faculty || null,
        departmentId: formData.department || null
      };

      // Call backend endpoint to create user
      const response = await fetch("http://localhost:5000/api/auth/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`❌ Error creating account: ${error.message || "Unknown error"}`);
        return;
      }

      const result = await response.json();

      // Refresh accounts from backend to get the latest list
      await refreshAccounts();
      
      // Show success message with default password and backend response
      alert(
        `✅ Account Created Successfully in Database!\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Role: ${getRoleLabel(formData.role)}\n` +
        `Staff ID: ${formData.staffId}\n\n` +
        `📧 Default Login Credentials:\n` +
        `Email: ${formData.email}\n` +
        `Password: User123@Pass\n\n` +
        `✅ Account is ACTIVE and ready to use immediately\n` +
        `⚠️ User should change password after first login\n` +
        `Share these credentials with the user.`
      );

      // Reset form
      setFormData({ name: "", role: "dean", email: "", staffId: "", faculty: "", department: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error creating account:", err);
      alert(`❌ Failed to create account: ${err instanceof Error ? err.message : "Network error"}`);
    }
  };

  const handleApprove = (id: string) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, status: "approved" } : a));
    setShowApprovalModal(false);
  };

  const handleReject = (id: string) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, status: "rejected" } : a));
    setShowApprovalModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this account request?")) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const pendingCount = accounts.filter(a => a.status === "pending").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#F97316";
      case "approved": return "#22C55E";
      case "rejected": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <FiClock size={18} />;
      case "approved": return <FiCheckCircle size={18} />;
      case "rejected": return <FiXCircle size={18} />;
      default: return null;
    }
  };

  const getRoleLabel = (role: string) => {
    return roles.find(r => r.value === role)?.label || role;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ margin: 0 }}>Account & Staff Management</h1>
            {loading && <p style={{ margin: "0.5rem 0 0 0", color: "#64748B", fontSize: "0.875rem" }}>Loading accounts from database...</p>}
            {error && <p style={{ margin: "0.5rem 0 0 0", color: "#EF4444", fontSize: "0.875rem" }}>{error}</p>}
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: "", role: "dean", email: "", staffId: "", faculty: "", department: "" });
            }}
            style={{
              background: "#1E40AF",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <FiPlus /> Create Account
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="metric-card" style={{ borderLeftColor: "#F97316" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748B" }}>Pending Verification</h3>
            <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{pendingCount}</p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>Awaiting approval</p>
          </div>
          <div className="metric-card" style={{ borderLeftColor: "#22C55E" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748B" }}>Approved</h3>
            <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{accounts.filter(a => a.status === "approved").length}</p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>Active accounts</p>
          </div>
          <div className="metric-card" style={{ borderLeftColor: "#EF4444" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748B" }}>Rejected</h3>
            <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{accounts.filter(a => a.status === "rejected").length}</p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748B" }}>Not approved</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" style={{
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
            <h2 style={{ marginTop: 0 }}>{editingId ? "Edit Account" : "Create New Staff Account"}</h2>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@institution.edu"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Staff ID *</label>
              <input
                type="text"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                placeholder="STAFF/2024/001"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#F0F9FF", border: "1px solid #0EA5E9", borderRadius: "4px" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#0369A1" }}>🔐 Default Password</label>
              <div style={{ padding: "0.75rem", backgroundColor: "#FFF", borderRadius: "4px", fontFamily: "monospace", fontSize: "1rem", border: "1px solid #0EA5E9", color: "#0369A1" }}>
                User123@Pass
              </div>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem", color: "#0369A1" }}>
                ✓ User will receive this password and can change it after first login
              </p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {(formData.role === "dean") && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Faculty</label>
                <select
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #E2E8F0",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="">Select Faculty</option>
                  {faculties.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}

            {(formData.role === "hod" || formData.role === "lecturer") && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #E2E8F0",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="">Select Department</option>
                  {Object.entries(departments).flatMap(([_, depts]) =>
                    (depts as string[]).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))
                  )}
                </select>
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
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
                onClick={handleAddAccount}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#1E40AF",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                {editingId ? "Update Account" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="metric-card" style={{ padding: "1.5rem", borderLeft: "none" }}>
        <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Pending Verification</h2>
        
        {accounts.filter(a => a.status === "pending").length === 0 ? (
          <p style={{ color: "#64748B", textAlign: "center", padding: "2rem" }}>No pending accounts</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
                <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Name</th>
                <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Role</th>
                <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Email</th>
                <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Date</th>
                <th style={{ textAlign: "center", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.filter(a => a.status === "pending").map(account => (
                <tr key={account.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                  <td style={{ padding: "1rem" }}>{account.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      background: "#F3F4F6",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      fontWeight: 500
                    }}>
                      {getRoleLabel(account.role)}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{account.email}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748B" }}>{account.requestDate}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowApprovalModal(true);
                        }}
                        style={{
                          background: "#22C55E",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: 600
                        }}
                      >
                        Review
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(account.id);
                          setFormData({
                            name: account.name,
                            role: account.role,
                            email: account.email,
                            staffId: account.staffId,
                            faculty: account.faculty || "",
                            department: account.department || ""
                          });
                          setShowForm(true);
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
                          gap: "0.25rem"
                        }}
                      >
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        style={{
                          background: "#EF4444",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="metric-card" style={{ padding: "1.5rem", borderLeft: "none", marginTop: "2rem" }}>
        <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>All Accounts</h2>
        
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
              <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Name</th>
              <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Role</th>
              <th style={{ textAlign: "left", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Email</th>
              <th style={{ textAlign: "center", padding: "1rem", fontWeight: 600, color: "#64748B" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                <td style={{ padding: "1rem" }}>{account.name}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{
                    background: "#F3F4F6",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}>
                    {getRoleLabel(account.role)}
                  </span>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{account.email}</td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    justifyContent: "center",
                    color: getStatusColor(account.status),
                    fontWeight: 600,
                    fontSize: "0.875rem"
                  }}>
                    {getStatusIcon(account.status)}
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showApprovalModal && selectedAccount && (
        <div className="modal-overlay" style={{
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
            maxWidth: "500px",
            width: "90%"
          }}>
            <h2 style={{ marginTop: 0 }}>Account Verification</h2>

            <div style={{ background: "#F8FAFC", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem" }}>
              <p><strong>Name:</strong> {selectedAccount.name}</p>
              <p><strong>Role:</strong> {getRoleLabel(selectedAccount.role)}</p>
              <p><strong>Email:</strong> {selectedAccount.email}</p>
              <p><strong>Staff ID:</strong> {selectedAccount.staffId}</p>
              {selectedAccount.faculty && <p><strong>Faculty:</strong> {selectedAccount.faculty}</p>}
              {selectedAccount.department && <p><strong>Department:</strong> {selectedAccount.department}</p>}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowApprovalModal(false)}
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
                onClick={() => handleReject(selectedAccount.id)}
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
                onClick={() => handleApprove(selectedAccount.id)}
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
          </div>
        </div>
      )}
    </div>
  );
}
