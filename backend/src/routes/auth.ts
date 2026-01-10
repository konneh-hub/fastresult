import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mockUsers } from "../mockData";
import { dbCheck } from "../middleware/dbCheck";

const router = Router();

router.post("/register", dbCheck, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    // Mock-mode: add to in-memory users
    if (process.env.SKIP_DB === "true") {
      const exists = mockUsers.find((u) => u.email === email);
      if (exists) return res.status(409).json({ message: "User already exists" });
      const id = Math.max(...mockUsers.map((u) => u.id), 0) + 1;
      mockUsers.push({ id, email, password, role });
      return res.status(201).json({ id, email, role });
    }

    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: "Database not initialized" });
    }

    const repo = AppDataSource.getRepository(User);
    const exists = await repo.findOneBy({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = repo.create({ email, password: hashed, role });
    await repo.save(user);
    
    res.status(201).json({ 
      id: user.id, 
      email: user.email, 
      role: user.role
    });
  } catch (error: any) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", dbCheck, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    // Mock-mode: check in-memory users
    if (process.env.SKIP_DB === "true") {
      const user = mockUsers.find((u) => u.email === email);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      if (user.password !== password) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || "change_me", { expiresIn: "8h" });
      return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }

    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: "Database not initialized" });
    }

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || "change_me", { expiresIn: "8h" });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;
