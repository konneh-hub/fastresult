import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const users = [
    { email: "admin@example.com", password: "adminpass", role: "admin" },
    { email: "exam@example.com", password: "examofficer", role: "exam_officer" },
    { email: "dean@example.com", password: "deanpass", role: "faculty_dean" },
    { email: "hod@example.com", password: "hodpass", role: "hod" },
    { email: "lecturer@example.com", password: "lectpass", role: "lecturer" },
    { email: "student@example.com", password: "studentpass", role: "student" },
  ];

  for (const u of users) {
    const existing = await repo.findOneBy({ email: u.email });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = repo.create({ email: u.email, password: hashed, role: u.role as any });
      await repo.save(user);
      console.log(`Created ${u.email}`);
    }
  }
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});