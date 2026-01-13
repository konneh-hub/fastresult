import React, { useMemo, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  // Self-registration is now restricted to lecturers only
  const [role] = useState("lecturer");
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

  // selections populated from backend
  const [faculties, setFaculties] = useState<Array<any>>([]);
  const [departments, setDepartments] = useState<Array<any>>([]);
  const [programs, setPrograms] = useState<Array<any>>([]);

  // IDs expected by backend (use numeric ids when available)
  const [facultyId, setFacultyId] = useState<number | "">("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [programId, setProgramId] = useState<number | "">("");

  // staff fields
  const [staffId, setStaffId] = useState("");
  const [faculty, setFaculty] = useState("");

  // admin/staff approval code (optional)
  const [accessCode, setAccessCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => { roleRef.current?.focus(); }, []);

  useEffect(() => {
    // load faculties for selects
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/faculties');
        const data = await res.json();
        setFaculties(data);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    // when faculty changes, load departments
    (async () => {
      if (!facultyId) {
        setDepartments([]);
        setPrograms([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:4000/api/departments?facultyId=${facultyId}`);
        const data = await res.json();
        setDepartments(data);
      } catch (e) {
        setDepartments([]);
      }
    })();
  }, [facultyId]);

  useEffect(() => {
    // when department changes, load programs
    (async () => {
      if (!departmentId) {
        setPrograms([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:4000/api/programs?departmentId=${departmentId}`);
        const data = await res.json();
        setPrograms(data);
      } catch (e) {
        setPrograms([]);
      }
    })();
  }, [departmentId]);
  const isStaff = useMemo(() => {
    return ["lecturer", "hod", "dean", "exam_officer", "admin"].includes(role);
  }, [role]);

  const validate = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";

    // This registration page is only for staff lecturers
    if (!staffId.trim()) return "Staff ID is required for staff registration.";
    if (!faculty.trim()) return "Faculty/School is required for staff registration.";

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

          // student (backend expects programId as number and matricNo)
        matricNo: role === "student" ? matricNo : undefined,
        programId: role === "student" && programId ? Number(programId) : undefined,
        level: role === "student" ? level : undefined,

        // staff/admin
        staffId: isStaff ? staffId : undefined,
        faculty: isStaff ? faculty : undefined,
        accessCode: role === "admin" ? accessCode : undefined,

        // selections
        facultyId: facultyId ? Number(facultyId) : undefined,
        departmentId: departmentId ? Number(departmentId) : undefined,
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
          <div className="reg-section-title">Lecturer registration</div>
          <div className="reg-hint">Only lecturers may self-register here. Students and other staff accounts must be created by an administrator (e.g., Dean).</div>

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
                <label htmlFor="facultyId">Faculty</label>
                <select id="facultyId" value={facultyId as any} onChange={(e) => setFacultyId(e.target.value ? Number(e.target.value) : "") }>
                  <option value="">-- Select faculty --</option>
                  {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div className="reg-group">
                <label htmlFor="departmentId">Department</label>
                <select id="departmentId" value={departmentId as any} onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : "") }>
                  <option value="">-- Select department --</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="reg-group">
                <label htmlFor="programId">Program</label>
                <select id="programId" value={programId as any} onChange={(e) => setProgramId(e.target.value ? Number(e.target.value) : "") } required>
                  <option value="">-- Select program --</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              </div>

              <div className="reg-hint">If your institution provides program/department lists, these inputs should be replaced with selects that map to IDs.</div>
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
                  <label htmlFor="departmentId">Department (enter ID)</label>
                  <input
                    id="departmentId"
                    type="number"
                    value={departmentId as any}
                    onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : "")}
                    placeholder="e.g. 2"
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

          {/* Admin */}
          {role === 'admin' && (
            <div className="reg-section-title">Administrator</div>
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
