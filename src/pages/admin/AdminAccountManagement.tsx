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
        
        // Log the data to see what's being returned
        console.log("Backend users data:", data);
        
        // Transform backend data to AccountRequest format
        const transformedAccounts: AccountRequest[] = (data || []).map((user: any) => {
          const userRole = (user.role || user.user_role || "").toLowerCase().trim();
          console.log("User:", user.name || user.full_name, "Role from backend:", userRole);
          return {
            id: user.id?.toString() || user.user_id?.toString(),
            name: user.full_name || user.fullName || "Unknown",
            role: userRole as any,
            email: user.email,
            staffId: user.staff_id || user.staffId || "",
            faculty: user.faculty,
            department: user.department,
            status: "approved",
            requestDate: new Date(user.created_at || user.createdAt || Date.now()).toISOString().split("T")[0]
          };
        });

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

  const [formData, setFormData] = useState<{
    name: string;
    role: "dean" | "hod" | "exam_officer" | "lecturer";
    email: string;
    staffId: string;
    faculty: string;
    department: string;
    gender: string;
  }>({
    name: "",
    role: "dean",
    email: "",
    staffId: "",
    faculty: "",
    department: "",
    gender: ""
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
      const transformedAccounts: AccountRequest[] = (data || []).map((user: any) => {
        const userRole = (user.role || user.user_role || "").toLowerCase().trim();
        return {
          id: user.id?.toString() || user.user_id?.toString(),
          name: user.full_name || user.fullName || "Unknown",
          role: userRole as any,
          email: user.email,
          staffId: user.staff_id || user.staffId || "",
          faculty: user.faculty,
          department: user.department,
          status: "approved",
          requestDate: new Date(user.created_at || user.createdAt || Date.now()).toISOString().split("T")[0]
        };
      });

      setAccounts(transformedAccounts);
    } catch (err) {
      console.error("Error refreshing accounts:", err);
    }
  };

  // Function to verify email doesn't exist in database
  const verifyEmailNotExists = async (email: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/users?email=${encodeURIComponent(email.toLowerCase())}`, {
        method: "GET",
        headers
      });

      if (!response.ok) {
        return true; // If we can't verify, allow creation (backend will catch it)
      }

      const data = await response.json();
      // If data array has items, email already exists
      return Array.isArray(data) && data.length === 0;
    } catch (err) {
      console.error("Error verifying email:", err);
      return true; // Allow if verification fails
    }
  };

  const verifyStaffIdNotExists = async (staffId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/users?staffId=${encodeURIComponent(staffId.toLowerCase())}`, {
        method: "GET",
        headers
      });

      if (!response.ok) {
        return true; // If we can't verify, allow creation (backend will catch it)
      }

      const data = await response.json();
      // If data array has items, staffId already exists
      return Array.isArray(data) && data.length === 0;
    } catch (err) {
      console.error("Error verifying staffId:", err);
      return true; // Allow if verification fails
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
      setFormData({ name: "", role: "dean", email: "", staffId: "", gender: "", faculty: "", department: "" });
      setShowForm(false);
      setEditingId(null);
      return;
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("❌ Please enter a valid email address.");
        return;
      }

      // Refresh accounts list before checking to ensure we have latest data
      await refreshAccounts();

      // Check for duplicate email (frontend check against all accounts)
      const emailExists = accounts.some(a => a.email.toLowerCase() === formData.email.toLowerCase());
      if (emailExists) {
        alert("❌ Email already exists in the system. Please use a different email.");
        return;
      }

      // Double-check with backend to ensure email doesn't exist
      const emailNotDuplicate = await verifyEmailNotExists(formData.email);
      if (!emailNotDuplicate) {
        alert("❌ This email is already registered in the database. Please use a different email.");
        return;
      }

      // Check for duplicate Staff ID
      const staffIdExists = accounts.some(a => a.staffId.toLowerCase() === formData.staffId.toLowerCase());
      if (staffIdExists) {
        alert("❌ Staff ID already exists. Please use a different Staff ID.");
        return;
      }

      // Double-check with backend to ensure Staff ID doesn't exist
      const staffIdNotDuplicate = await verifyStaffIdNotExists(formData.staffId);
      if (!staffIdNotDuplicate) {
        alert("❌ This Staff ID is already registered in the database. Please use a different Staff ID.");
        return;
      }

      // Validate gender is selected
      if (!formData.gender) {
        alert("❌ Please select a gender.");
        return;
      }

      // Validate that faculty and department are linked correctly
      if ((formData.role === "dean" && !formData.faculty) || 
          ((formData.role === "hod" || formData.role === "lecturer") && (!formData.department || !formData.faculty))) {
        alert("❌ Please ensure faculty and department are properly selected for this role.");
        return;
      }

      // Prepare data for backend - map role names and add faculty/department
      const payload = {
        role: formData.role,
        fullName: formData.name,
        email: formData.email.toLowerCase().trim(),
        staffId: formData.staffId.trim(),
        gender: formData.gender,
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
        const errorMsg = error.message || error.error || "Unknown error";
        
        // Handle specific backend errors
        if (errorMsg.toLowerCase().includes("email")) {
          alert(`❌ This email is already registered. Please use a different email address.`);
          return;
        }
        if (errorMsg.toLowerCase().includes("staff")) {
          alert(`❌ This Staff ID is already in use. Please use a different Staff ID.`);
          return;
        }
        
        alert(`❌ Error creating account: ${errorMsg}`);
        return;
      }

      const result = await response.json();

      // Create new account object from form data
      const newAccount: AccountRequest = {
        id: result.id || result.userId || String(Date.now()),
        name: formData.name,
        role: formData.role,
        email: formData.email.toLowerCase().trim(),
        staffId: formData.staffId.trim(),
        faculty: formData.faculty,
        department: formData.department,
        status: "approved",
        requestDate: new Date().toISOString().split("T")[0]
      };

      // Immediately add to local state for instant UI update
      setAccounts([...accounts, newAccount]);

      // Also save to appUsers localStorage for UserAccounts page
      try {
        const appUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const userAccountEntry = {
          id: newAccount.id,
          email: newAccount.email,
          name: newAccount.name,
          role: getRoleLabel(formData.role),
          status: 'active',
          createdDate: newAccount.requestDate
        };
        appUsers.push(userAccountEntry);
        localStorage.setItem('appUsers', JSON.stringify(appUsers));
      } catch (err) {
        console.error("Error saving to appUsers:", err);
      }

      // Also refresh from backend to ensure consistency
      await refreshAccounts();
      
      // Show success message with default password and backend response
      alert(
        `✅ Account Created Successfully!\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Role: ${getRoleLabel(formData.role)}\n` +
        `Staff ID: ${formData.staffId}\n` +
        `${formData.faculty ? `Faculty: ${formData.faculty}\n` : ""}` +
        `${formData.department ? `Department: ${formData.department}\n` : ""}\n` +
        `🔑 LOGIN CREDENTIALS:\n` +
        `Email: ${formData.email}\n` +
        `Password: User123@Pass\n\n` +
        `✅ STATUS: ACTIVE AND READY TO LOGIN\n` +
        `• Email verification is complete\n` +
        `• User can login immediately\n` +
        `• Password can be changed after login\n\n` +
        `📧 Share these credentials with the user.`
      );

      // Reset form
      setFormData({ name: "", role: "dean", email: "", staffId: "", gender: "", faculty: "", department: "" });
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
    if (!role) return "No Role";
    return roles.find(r => r.value === role)?.label || role.charAt(0).toUpperCase() + role.slice(1);
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

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#DCFCE7", border: "2px solid #22C55E", borderRadius: "4px" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#16A34A" }}>🔐 Account Login Password (Active)</label>
              <div style={{ padding: "0.75rem", backgroundColor: "#FFF", borderRadius: "4px", fontFamily: "monospace", fontSize: "1rem", border: "1px solid #22C55E", color: "#16A34A", fontWeight: 600 }}>
                User123@Pass
              </div>
              <div style={{ margin: "0.75rem 0 0 0", padding: "0.75rem", backgroundColor: "#F0FDF4", borderRadius: "4px", border: "1px solid #22C55E" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#16A34A", fontWeight: 600 }}>
                  ✅ Account is ACTIVE and ready for login immediately
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.75rem", color: "#16A34A" }}>
                  • User can login with email and this password right away
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.75rem", color: "#16A34A" }}>
                  • Email verification is automatically completed
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.75rem", color: "#16A34A" }}>
                  • User can change password after login in dashboard settings
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "dean" | "hod" | "exam_officer" | "lecturer" })}
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
              <>
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
              </>
            )}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setFormData({ name: "", role: "dean", email: "", staffId: "", gender: "", faculty: "", department: "" });
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
