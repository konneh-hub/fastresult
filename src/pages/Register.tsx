import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { otpService } from "../services/otpService";
import "./AuthPages.css";

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel] = useState("");

  // Sample data for dropdowns
  const faculties = [
    "Faculty of Science",
    "Faculty of Engineering",
    "Faculty of Arts",
    "Faculty of Law",
    "Faculty of Medicine",
    "Faculty of Business"
  ];

  const departments = {
    "Faculty of Science": ["Computer Science", "Mathematics", "Physics", "Chemistry"],
    "Faculty of Engineering": ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering"],
    "Faculty of Arts": ["History", "English", "Philosophy", "Sociology"],
    "Faculty of Law": ["Public Law", "Private Law"],
    "Faculty of Medicine": ["Medicine", "Nursing", "Pharmacy"],
    "Faculty of Business": ["Accounting", "Management", "Economics"]
  };

  const programs = ["Degree", "Diploma", "Ordinary Diploma", "Certificate"];
  const levels = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

  const handleNextStep = () => {
    setError("");
    if (currentStep === 1) {
      if (!email || role !== "student") {
        setError("Only students can self-register. Staff accounts are created by administration.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!fullName || !password || password !== confirmPassword) {
        setError("Please fill all fields and passwords must match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Academic fields are optional - can be filled in later
      setCurrentStep(4);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password || !fullName) {
        setError("Please complete all required fields");
        setLoading(false);
        return;
      }

      // Build registration payload for student
      const payload: any = {
        role: "student",
        fullName,
        email,
        password,
        phone: phone || undefined,
        matricNo: matricNo || undefined,
        faculty: faculty || undefined,
        department: department || undefined,
        program: program || undefined,
        level: level || undefined
      };

      // Call backend registration endpoint
      const response = await api.post("/auth/register", payload);

      if (response.status === 201 || response.status === 200) {
        console.log("✅ Registration successful:", response.data);
        
        // Store email for OTP verification
        localStorage.setItem("registrationEmail", email);
        localStorage.setItem("registrationData", JSON.stringify({
          fullName,
          email,
          role: "student"
        }));

        // Redirect to OTP verification page
        setTimeout(() => {
          navigate("/otp-verification", { 
            state: { 
              email, 
              isNewRegistration: true,
              requiresOTP: response.data.requiresVerification || true
            } 
          });
        }, 500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
      <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
            <div className="progress-circle">{currentStep > 1 ? "✓" : "1"}</div>
            <span className="progress-label">Account</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
            <div className="progress-circle">{currentStep > 2 ? "✓" : "2"}</div>
            <span className="progress-label">Personal</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
            <div className="progress-circle">{currentStep > 3 ? "✓" : "3"}</div>
            <span className="progress-label">Academic</span>
          </div>
          <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
            <div className="progress-circle">4</div>
            <span className="progress-label">Review</span>
          </div>
        </div>

        <div className="register-form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: "#FEE2E2",
                color: "#991B1B",
                padding: "0.75rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                fontSize: "0.875rem"
              }}>
                {error}
              </div>
            )}

            {currentStep === 1 && (
              <>
                <h2>Student Registration</h2>
                <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
                  Create your student account
                </p>

                <div className="info-box" style={{ background: "#DBEAFE", borderLeft: "4px solid #0284C7" }}>
                  <strong style={{ color: "#075985" }}>ℹ Student accounts require verification before activation.</strong>
                  <p style={{ marginTop: "0.5rem", color: "#075985", fontSize: "0.875rem" }}>
                    Staff accounts are created by the university administration.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2>Personal Information</h2>
                <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
                  Please provide your details
                </p>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+232 xxx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2>Academic Information</h2>
                <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
                  Provide your academic details
                </p>

                <div className="form-group">
                  <label htmlFor="matricNo">Matriculation Number *</label>
                  <input
                    id="matricNo"
                    type="text"
                    placeholder="e.g., CSC/2021/001"
                    value={matricNo}
                    onChange={(e) => setMatricNo(e.target.value)}
                    required
                  />
                  <small style={{ color: "#64748B" }}>This will be verified against institutional records</small>
                </div>

                <div className="form-group">
                  <label htmlFor="faculty">Faculty *</label>
                  <select
                    id="faculty"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    required
                  >
                    <option value="">Select your faculty</option>
                    {faculties.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department *</label>
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    disabled={!faculty}
                  >
                    <option value="">Select your department</option>
                    {faculty && (departments as any)[faculty]?.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="program">Program *</label>
                  <select
                    id="program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    required
                  >
                    <option value="">Select your program</option>
                    {programs.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="level">Academic Level *</label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    required
                  >
                    <option value="">Select your level</option>
                    {levels.map(l => (
                      <option key={l} value={l}>{l} Level</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2>Review Your Information</h2>
                <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
                  Please verify your details before submission
                </p>

                <div className="info-box" style={{ background: "#F0FDF4", borderLeft: "4px solid #22C55E" }}>
                  <strong style={{ color: "#15803D" }}>✓ Review Complete</strong>
                  <p style={{ marginTop: "0.5rem", color: "#15803D", fontSize: "0.875rem" }}>
                    Check your information and click "Create Account" to proceed
                  </p>
                </div>

                <div style={{ background: "#F8FAFC", padding: "1rem", borderRadius: "4px", marginBottom: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem" }}>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Full Name</p>
                      <p style={{ fontWeight: 600 }}>{fullName}</p>
                    </div>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Email</p>
                      <p style={{ fontWeight: 600 }}>{email}</p>
                    </div>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Matric Number</p>
                      <p style={{ fontWeight: 600 }}>{matricNo}</p>
                    </div>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Faculty</p>
                      <p style={{ fontWeight: 600 }}>{faculty}</p>
                    </div>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Department</p>
                      <p style={{ fontWeight: 600 }}>{department}</p>
                    </div>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Program</p>
                      <p style={{ fontWeight: 600 }}>{program}</p>
                    </div>
                    <div>
                      <p style={{ color: "#64748B", marginBottom: "0.25rem" }}>Level</p>
                      <p style={{ fontWeight: 600 }}>{level} Level</p>
                    </div>
                  </div>
                </div>

                <div className="info-box" style={{ background: "#FEF3C7", borderLeft: "4px solid #D97706" }}>
                  <strong style={{ color: "#92400E" }}>⚠ Verification Required</strong>
                  <p style={{ marginTop: "0.5rem", color: "#92400E", fontSize: "0.875rem" }}>
                    Your enrollment will be verified against institutional records. You will receive an email notification once your account is activated.
                  </p>
                </div>
              </>
            )}

            <div className="form-actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePreviousStep}
                  disabled={loading}
                >
                  Previous
                </button>
              )}
              {currentStep < 4 && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  Next
                </button>
              )}
              {currentStep === 4 && (
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1E40AF", fontWeight: 600, textDecoration: "none" }}>
                  Sign In
                </Link>
              </p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                <Link to="/" style={{ color: "#1E40AF", fontWeight: 600, textDecoration: "none" }}>
                  ← Back to Home
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
