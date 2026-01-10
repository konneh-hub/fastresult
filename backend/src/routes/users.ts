import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";
import { mockUsers } from "../mockData";

const router = Router();

router.get("/", authMiddleware, authorize(["admin"]), async (req, res) => {
  if (process.env.SKIP_DB === "true") {
    // return the mock users without passwords
    return res.json(mockUsers.map((u) => ({ id: u.id, email: u.email, role: u.role, firstName: u.firstName, lastName: u.lastName })));
  }
  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(User);
  const users = await repo.find({ select: ["id", "email", "role", "firstName", "lastName", "createdAt"] });
  res.json(users);
});

export default router;
