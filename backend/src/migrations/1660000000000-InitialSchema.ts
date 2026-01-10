import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1660000000000 implements MigrationInterface {
  name = "InitialSchema1660000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','exam_officer','faculty_dean','hod','lecturer','student') DEFAULT 'student',
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE \
      \
      faculties (\
        id INT AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(255) NOT NULL,\
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\
      );
    `);

    await queryRunner.query(`
      CREATE TABLE departments (\
        id INT AUTO_INCREMENT PRIMARY KEY,\
        name VARCHAR(255) NOT NULL,\
        faculty_id INT NOT NULL,\
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE\
      );
    `);

    await queryRunner.query(`
      CREATE TABLE courses (\
        id INT AUTO_INCREMENT PRIMARY KEY,\
        code VARCHAR(50) NOT NULL,\
        title VARCHAR(255) NOT NULL,\
        department_id INT NOT NULL,\
        credits INT NOT NULL DEFAULT 3,\
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE\
      );
    `);

    await queryRunner.query(`
      CREATE TABLE students (\
        id INT AUTO_INCREMENT PRIMARY KEY,\
        student_number VARCHAR(50) NOT NULL UNIQUE,\
        first_name VARCHAR(255),\
        last_name VARCHAR(255),\
        department_id INT,\
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL\
      );
    `);

    await queryRunner.query(`
      CREATE TABLE results (\
        id INT AUTO_INCREMENT PRIMARY KEY,\
        student_id INT NOT NULL,\
        course_id INT NOT NULL,\
        lecturer_id INT NOT NULL,\
        ca_score DECIMAL(5,2),\
        exam_score DECIMAL(5,2),\
        status ENUM('draft','submitted','dept_approved','faculty_approved','approved','published') DEFAULT 'draft',\
        term VARCHAR(50),\
        year INT,\
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,\
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,\
        FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE SET NULL\
      );
    `);

    await queryRunner.query(`
      CREATE TABLE audit_logs (\
        id INT AUTO_INCREMENT PRIMARY KEY,\
        user_id INT,\
        action VARCHAR(255),\
        entity VARCHAR(255),\
        entity_id INT,\
        details TEXT,\
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\
      );
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS results`);
    await queryRunner.query(`DROP TABLE IF EXISTS students`);
    await queryRunner.query(`DROP TABLE IF EXISTS courses`);
    await queryRunner.query(`DROP TABLE IF EXISTS departments`);
    await queryRunner.query(`DROP TABLE IF EXISTS faculties`);
  }
}
