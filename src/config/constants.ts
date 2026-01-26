/**
 * System-wide constants for academic and program configuration
 * Update these to modify levels, program types, and departments across the system
 */

// Academic Levels/Years
export const ACADEMIC_LEVELS = ['Year 1', 'Year 2'];

// Program Types
export const PROGRAM_TYPES = ['Degree', 'Diploma', 'Masters', 'Ordinary Diploma', 'Certificate'];

// Departments (can be extended)
export const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

// User Roles
export const USER_ROLES = ['admin', 'super_admin', 'faculty_dean', 'dean', 'hod', 'exam_officer', 'lecturer', 'student'];

// API Configuration
export const API_BASE_URL = 'http://localhost:5000';

// Auth Token Storage Key
export const AUTH_TOKEN_KEY = 'authToken';

// User Data Storage Key
export const USER_DATA_KEY = 'user';

// GPA Color Coding
export const GPA_COLORS = {
  excellent: '#4CAF50', // >= 3.5
  good: '#FF9800',      // >= 2.5
  poor: '#F44336',      // < 2.5
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  TIMEOUT: 30000,
  TOAST_DURATION: 3000,
};
