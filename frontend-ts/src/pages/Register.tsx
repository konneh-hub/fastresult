import React, { useMemo, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "lecturer", label: "Lecturer" },
  { value: "hod", label: "HOD" },
  { value: "dean", label: "Dean" },
  { value: "exam_officer", label: "Exam Officer" },
  { value: "admin", label: "Administrator" },
];

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // common optional fields
  const [phone, setPhone] = useState("");

  // student fields
  const [matricNo, setMatricNo] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel] = useState("");

  // staff fields
  const [staffId, setStaffId] = useState("");
  const [faculty, setFaculty] = useState("");

  // admin/staff approval code (optional)
  const [accessCode, setAccessCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => { roleRef.current?.focus(); }, []);

  const isStaff = useMemo(() => {
    return ["lecturer", "hod", "dean", "exam_officer", "admin"].includes(role);
  }, [role]);

  const validate = () => {
    if (!role) return "Please select how you want to register (role).";
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";

    if (role === "student") {
      if (!matricNo.trim()) return "Matric/Student ID is required for students.";
      if (!department.trim()) return "Department is required for students.";
      if (!program.trim()) return "Program is required for students.";
      if (!level.trim()) return "Level is required for students.";
    }

    if (isStaff) {
      if (!staffId.trim()) return "Staff ID is required for staff registration.";
      if (!faculty.trim()) return "Faculty/School is required for staff registration.";
    }

    // Admins require an access code (institution can choose to enforce this)
    if (role === "admin") {
      if (!accessCode.trim()) return "Access code is required for administrator registration.";
    }

    return "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        role,
        fullName,
        email,
        password,
        phone: phone || undefined,

        // student
        matricNo: role === "student" ? matricNo : undefined,
        department: role === "student" ? department : undefined,
        program: role === "student" ? program : undefined,
        level: role === "student" ? level : undefined,

        // staff/admin
        staffId: isStaff ? staffId : undefined,
        faculty: isStaff ? faculty : undefined,
        accessCode: isStaff ? accessCode : undefined,
      };

      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // If backend returns token/user immediately, store it:
      if (res.data?.token) localStorage.setItem("token", res.data.token);
      if (res.data?.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      // Choose where you want to go after register
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-card">
        <div className="reg-header">
          <h1>ResultApp</h1>
          <p>Create your account to access the SRMS</p>
        </div>

        <form className="reg-form" onSubmit={submit}>
          {/* Step 1: role selection */}
          <div className="reg-section-title">How do you want to register?</div>

          <div className="reg-group">
            <label htmlFor="roleSelect">Register as</label>
            <select id="roleSelect" ref={roleRef} aria-describedby="role-hint" autoFocus value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">-- Select role --</option>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div id="role-hint" className="reg-hint">Select the role; the form will update with role-specific fields below.</div>
          </div>

          {error && <div className="reg-error" role="alert">{error}</div>}

          {/* Step 2: common fields */}
          <div className="reg-section-title">Account details</div>

          <div className="reg-grid">
            <div className="reg-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="reg-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                autoComplete="username"
              />
            </div>

            <div className="reg-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 ..."
              />
            </div>
          </div>

          <div className="reg-grid">
            <div className="reg-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="reg-group">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Student fields */}
          {role === "student" && (
            <>
              <div className="reg-section-title">Student information</div>

              <div className="reg-grid">
                <div className="reg-group">
                  <label htmlFor="matricNo">Matric/Student ID</label>
                  <input
                    id="matricNo"
                    value={matricNo}
                    onChange={(e) => setMatricNo(e.target.value)}
                    placeholder="e.g. SRMS/2026/001"
                    required
                  />
                </div>

                <div className="reg-group">
                  <label htmlFor="level">Level</label>
                  <input
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g. 100 / 200 / 300 / 400"
                    required
                  />
                </div>
              </div>

              <div className="reg-grid">
                <div className="reg-group">
                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    required
                  />
                </div>

                <div className="reg-group">
                  <label htmlFor="program">Program</label>
                  <input
                    id="program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="e.g. BSc Computer Science"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Staff/Admin fields */}
          {isStaff && (
            <>
              <div className="reg-section-title">Staff information</div>

              <div className="reg-grid">
                <div className="reg-group">
                  <label htmlFor="staffId">Staff ID</label>
                  <input
                    id="staffId"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="e.g. STAFF-1029"
                    required
                  />
                </div>

                <div className="reg-group">
                  <label htmlFor="faculty">Faculty/School</label>
                  <input
                    id="faculty"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="e.g. Faculty of Science"
                    required
                  />
                </div>
              </div>

              <div className="reg-group">
                <label htmlFor="accessCode">
                  Access Code (optional)
                </label>
                <input
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Provided by admin (if required)"
                />
                <div className="reg-hint">
                  If your institution wants to restrict staff registration, require an access code on the backend.
                </div>
              </div>
            </>
          )}

          <button className="reg-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="reg-links">
            <span>
              Already have an account? <Link to="/login">Login</Link>
            </span>
            <Link to="/" className="reg-back">
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
