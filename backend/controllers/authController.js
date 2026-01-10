const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { db } = require("../db");

function isValidEmail(email) {
  return typeof email === "string" && /^\S+@\S+\.\S+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    const {
      role, fullName, email, phone, password,
      // student fields
      matricNo, programId, level,
      // staff fields
      staffId, departmentId, faculty
    } = req.body;

    if (!role || !fullName || !email || !password) {
      return res.status(400).json({ message: "role, fullName, email, password are required" });
    }
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    // role exists?
    const [[roleRow]] = await db.query("SELECT id FROM roles WHERE name=? LIMIT 1", [role]);
    if (!roleRow) return res.status(400).json({ message: "Invalid role" });

    // email unique?
    const [[exists]] = await db.query("SELECT id FROM users WHERE email=? LIMIT 1", [email]);
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const [u] = await db.query(
      "INSERT INTO users (role_id, full_name, email, phone, password_hash) VALUES (?,?,?,?,?)",
      [roleRow.id, fullName, email, phone || null, passwordHash]
    );
    const userId = u.insertId;

    // create profile
    if (role === "student") {
      if (!matricNo || !programId || !level) {
        return res.status(400).json({ message: "Student needs matricNo, programId, level" });
      }
      await db.query(
        "INSERT INTO students (user_id, matric_no, program_id, level, admission_year) VALUES (?,?,?,?,YEAR(CURDATE()))",
        [userId, matricNo, programId, level]
      );
    } else {
      if (!staffId) return res.status(400).json({ message: "Staff roles need staffId" });
      await db.query(
        "INSERT INTO staff (user_id, staff_id, department_id, faculty) VALUES (?,?,?,?)",
        [userId, staffId, departmentId || null, faculty || null]
      );
    }

    return res.status(201).json({ message: "Registered successfully ✅", userId });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const [[user]] = await db.query(
      `SELECT u.id, u.full_name, u.email, u.password_hash, u.is_active, u.is_deleted, r.name AS role
       FROM users u JOIN roles r ON r.id=u.role_id
       WHERE u.email=? LIMIT 1`,
      [email]
    );

    if (!user || user.is_deleted) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.is_active) return res.status(403).json({ message: "Account disabled" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};
