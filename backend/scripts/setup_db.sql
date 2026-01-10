CREATE DATABASE IF NOT EXISTS fastresultdb;

CREATE USER IF NOT EXISTS 'fastresultuser'@'localhost' IDENTIFIED BY 'FastResult@123';
GRANT ALL PRIVILEGES ON fastresultdb.* TO 'fastresultuser'@'localhost';
FLUSH PRIVILEGES;

USE fastresultdb;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
);

INSERT IGNORE INTO roles (name) VALUES
('admin'),('lecturer'),('hod'),('dean'),('exam_officer'),('student');

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  full_name VARCHAR(140) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(40),
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS students (
  user_id INT PRIMARY KEY,
  matric_no VARCHAR(60) NOT NULL UNIQUE,
  program_id INT NOT NULL,
  level INT NOT NULL,
  admission_year INT,
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS staff (
  user_id INT PRIMARY KEY,
  staff_id VARCHAR(60) NOT NULL UNIQUE,
  department_id INT NULL,
  faculty VARCHAR(120) NULL,
  CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
