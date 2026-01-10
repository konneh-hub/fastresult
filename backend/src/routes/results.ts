import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";
import { AppDataSource } from "../data-source";
import { Result } from "../entities/Result";
import { mockResults, createMockResult } from "../mockData";

const router = Router();

// Upload results (lecturer only)
router.post("/upload", authMiddleware, authorize(["lecturer"]), async (req: any, res) => {
  // Expect payload: [{ studentId, courseId, ca_score, exam_score, term, year }, ...]
  const payload = req.body || [];

  if (process.env.SKIP_DB === "true") {
    const created = payload.map((r: any) => createMockResult({
      studentId: r.studentId,
      courseId: r.courseId,
      caScore: r.ca_score ?? r.caScore,
      examScore: r.exam_score ?? r.examScore,
      term: r.term,
      year: r.year,
      lecturerId: req.user.id,
      status: "draft",
    }));
    return res.status(201).json({ message: "Results uploaded (draft)", created });
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(Result);
  const created: Result[] = [];
  for (const r of payload) {
    const item = repo.create({
      studentId: r.studentId,
      courseId: r.courseId,
      caScore: r.ca_score ?? r.caScore,
      examScore: r.exam_score ?? r.examScore,
      term: r.term,
      year: r.year,
      lecturerId: req.user.id,
      status: "draft",
    });
    await repo.save(item);
    created.push(item);
  }
  res.status(201).json({ message: "Results uploaded (draft)", created });
});

// Lecturer: view own results
router.get("/mine", authMiddleware, authorize(["lecturer"]), async (req: any, res) => {
  if (process.env.SKIP_DB === "true") {
    const results = mockResults.filter((r) => r.lecturerId === req.user.id);
    return res.json(results);
  }
  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(Result);
  const results = await repo.find({ where: { lecturerId: req.user.id } });
  res.json(results);
});

// Submit results for department approval (lecturer)
router.put("/submit", authMiddleware, authorize(["lecturer"]), async (req: any, res) => {
  const { ids } = req.body; // array of result ids
  if (!Array.isArray(ids)) return res.status(400).json({ message: "ids required" });

  if (process.env.SKIP_DB === "true") {
    ids.forEach((id: number) => {
      const r = mockResults.find((m) => m.id === id && m.lecturerId === req.user.id);
      if (r) r.status = "submitted";
    });
    return res.json({ message: "Results submitted for dept validation" });
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(Result);
  await repo.update(ids, { status: "submitted" });
  res.json({ message: "Results submitted for dept validation" });
});

// Pending results for approvers (role-based)
router.get("/pending", authMiddleware, async (req: any, res) => {
  const role = req.user.role;

  if (process.env.SKIP_DB === "true") {
    if (role === "hod") return res.json(mockResults.filter((r) => r.status === "submitted"));
    if (role === "faculty_dean") return res.json(mockResults.filter((r) => r.status === "dept_approved"));
    if (role === "exam_officer") return res.json(mockResults.filter((r) => r.status === "faculty_approved"));
    return res.status(403).json({ message: "Access denied" });
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const roleLocal = req.user.role;
  const repo = AppDataSource.getRepository(Result);
  let results: Result[] = [];
  if (roleLocal === "hod") {
    results = await repo.find({ where: { status: "submitted" } });
  } else if (roleLocal === "faculty_dean") {
    results = await repo.find({ where: { status: "dept_approved" } });
  } else if (roleLocal === "exam_officer") {
    results = await repo.find({ where: { status: "faculty_approved" } });
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(results);
});

// Department approve
router.put("/department-approve", authMiddleware, authorize(["hod"]), async (req: any, res) => {
  const { ids } = req.body; // array of result ids
  if (!Array.isArray(ids)) return res.status(400).json({ message: "ids required" });

  if (process.env.SKIP_DB === "true") {
    ids.forEach((id: number) => {
      const r = mockResults.find((m) => m.id === id);
      if (r) r.status = "dept_approved";
    });
    return res.json({ message: "Department approved results" });
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const { ids: idsLocal } = req.body;
  const repo = AppDataSource.getRepository(Result);
  await repo.update(idsLocal, { status: "dept_approved" });
  res.json({ message: "Department approved results" });
});

// Faculty recommend/approve
router.put("/faculty-approve", authMiddleware, authorize(["faculty_dean"]), async (req: any, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ message: "ids required" });

  if (process.env.SKIP_DB === "true") {
    ids.forEach((id: number) => {
      const r = mockResults.find((m) => m.id === id);
      if (r) r.status = "faculty_approved";
    });
    return res.json({ message: "Faculty recommended results" });
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(Result);
  await repo.update(ids, { status: "faculty_approved" });
  res.json({ message: "Faculty recommended results" });
});

// Final approve & publish
router.put("/final-approve", authMiddleware, authorize(["exam_officer"]), async (req: any, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ message: "ids required" });

  if (process.env.SKIP_DB === "true") {
    ids.forEach((id: number) => {
      const r = mockResults.find((m) => m.id === id);
      if (r) r.status = "published";
    });
    return res.json({ message: "Results approved and published" });
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(Result);
  await repo.update(ids, { status: "published" });
  res.json({ message: "Results approved and published" });
});

// Student: view published results (student can view own)
router.get("/student/:studentId", authMiddleware, authorize(["student"]), async (req: any, res) => {
  const studentId = Number(req.params.studentId);
  if (req.user.role !== "student" || req.user.id !== studentId) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (process.env.SKIP_DB === "true") {
    const results = mockResults.filter((r) => r.studentId === studentId && r.status === "published");
    return res.json(results);
  }

  if (!AppDataSource.isInitialized) return res.status(503).json({ message: "Database not initialized" });
  const repo = AppDataSource.getRepository(Result);
  const results = await repo.find({ where: { studentId, status: "published" } });
  res.json(results);
});

export default router;
