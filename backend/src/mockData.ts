export type MockUser = { id: number; email: string; password: string; role: string; firstName?: string; lastName?: string };
export type MockResult = { id: number; studentId: number; courseId: number; caScore: number; examScore: number; term: string; year: number; lecturerId: number; status: string };

export const mockUsers: MockUser[] = [
  { id: 1, email: "admin@example.com", password: "adminpass", role: "admin" },
  { id: 2, email: "exam@example.com", password: "examofficer", role: "exam_officer" },
  { id: 3, email: "dean@example.com", password: "deanpass", role: "faculty_dean" },
  { id: 4, email: "hod@example.com", password: "hodpass", role: "hod" },
  { id: 5, email: "lecturer@example.com", password: "lectpass", role: "lecturer" },
  { id: 6, email: "student@example.com", password: "studentpass", role: "student" },
];

let nextResultId = 100;
export const mockResults: MockResult[] = [
  { id: nextResultId++, studentId: 6, courseId: 1, caScore: 25, examScore: 60, term: "Fall", year: 2025, lecturerId: 5, status: "draft" },
  { id: nextResultId++, studentId: 6, courseId: 2, caScore: 20, examScore: 55, term: "Fall", year: 2025, lecturerId: 5, status: "submitted" },
  { id: nextResultId++, studentId: 6, courseId: 3, caScore: 22, examScore: 58, term: "Fall", year: 2025, lecturerId: 5, status: "dept_approved" },
  { id: nextResultId++, studentId: 6, courseId: 4, caScore: 28, examScore: 62, term: "Fall", year: 2025, lecturerId: 5, status: "faculty_approved" },
  { id: nextResultId++, studentId: 6, courseId: 5, caScore: 30, examScore: 65, term: "Fall", year: 2025, lecturerId: 5, status: "published" },
];

export function createMockResult(r: Partial<MockResult>): MockResult {
  const item: MockResult = {
    id: nextResultId++,
    studentId: r.studentId ?? 1,
    courseId: r.courseId ?? 1,
    caScore: (r.caScore as number) ?? 0,
    examScore: (r.examScore as number) ?? 0,
    term: r.term ?? "Fall",
    year: r.year ?? 2025,
    lecturerId: r.lecturerId ?? 5,
    status: r.status ?? "draft",
  };
  mockResults.push(item);
  return item;
}
