import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export type ResultStatus =
  | "draft"
  | "submitted"
  | "dept_approved"
  | "faculty_approved"
  | "approved"
  | "published";

@Entity({ name: "results" })
export class Result {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "student_id" })
  studentId!: number;

  @Column({ name: "course_id" })
  courseId!: number;

  @Column({ name: "lecturer_id", nullable: true })
  lecturerId?: number;

  @Column({ name: "ca_score", type: "decimal", precision: 5, scale: 2, nullable: true })
  caScore?: number;

  @Column({ name: "exam_score", type: "decimal", precision: 5, scale: 2, nullable: true })
  examScore?: number;

  @Column({ type: "enum", enum: ["draft","submitted","dept_approved","faculty_approved","approved","published"], default: "draft" })
  status!: ResultStatus;

  @Column({ nullable: true })
  term?: string;

  @Column({ nullable: true })
  year?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
