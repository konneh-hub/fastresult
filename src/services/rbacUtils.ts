/**
 * Role-Based Access Control Utilities
 * Frontend utilities for checking permissions and filtering data based on user role
 */

export type UserRole = 'admin' | 'dean' | 'hod' | 'lecturer' | 'student' | 'exam_officer';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  roleId: number;
  facultyId?: number;
  departmentId?: number;
  programId?: number;
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error('Error parsing user from localStorage:', err);
    return null;
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: UserRole | UserRole[], user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  
  if (Array.isArray(role)) {
    return role.includes(currentUser.role);
  }
  return currentUser.role === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user?: User): boolean => hasRole('admin', user);

/**
 * Check if user is dean
 */
export const isDean = (user?: User): boolean => hasRole('dean', user);

/**
 * Check if user is HOD
 */
export const isHOD = (user?: User): boolean => hasRole('hod', user);

/**
 * Check if user is lecturer
 */
export const isLecturer = (user?: User): boolean => hasRole('lecturer', user);

/**
 * Check if user is student
 */
export const isStudent = (user?: User): boolean => hasRole('student', user);

/**
 * Check if user is staff (not student)
 */
export const isStaff = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return !['student'].includes(currentUser.role);
};

/**
 * Check if user has faculty-level access
 */
export const hasFacultyScope = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return !!currentUser.facultyId;
};

/**
 * Check if user has department-level access
 */
export const hasDepartmentScope = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return !!currentUser.departmentId;
};

/**
 * Get user's access scope
 * Returns the most restrictive scope the user has
 */
export const getUserScope = (user?: User): 'admin' | 'faculty' | 'department' | 'course' | 'personal' => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return 'personal';
  
  switch (currentUser.role) {
    case 'admin':
      return 'admin';
    case 'dean':
      return 'faculty';
    case 'hod':
    case 'exam_officer':
      return 'department';
    case 'lecturer':
      return 'course';
    case 'student':
    default:
      return 'personal';
  }
};

/**
 * Check if user can access another user's data
 */
export const canAccessUser = (targetUserId: number, user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  
  // Admins can access anyone
  if (currentUser.role === 'admin') return true;
  
  // Students can only access themselves
  if (currentUser.role === 'student') return currentUser.id === targetUserId;
  
  // Staff can access their scope
  // This is a simplified check - backend should validate full hierarchy
  return true;
};

/**
 * Check if user can perform admin actions
 */
export const canPerformAdminAction = (user?: User): boolean => {
  return isAdmin(user);
};

/**
 * Check if user can create users
 */
export const canCreateUser = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return ['admin', 'dean', 'hod'].includes(currentUser.role);
};

/**
 * Check if user can create departments
 */
export const canCreateDepartment = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return ['admin', 'dean'].includes(currentUser.role);
};

/**
 * Check if user can create programs
 */
export const canCreateProgram = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return ['admin', 'dean', 'hod'].includes(currentUser.role);
};

/**
 * Check if user can view reports
 */
export const canViewReports = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return ['admin', 'dean', 'hod', 'exam_officer'].includes(currentUser.role);
};

/**
 * Check if user can manage results
 */
export const canManageResults = (user?: User): boolean => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  return ['admin', 'lecturer', 'exam_officer'].includes(currentUser.role);
};

/**
 * Get API query parameters for current user's scope
 */
export const getScopeQueryParams = (user?: User): Record<string, any> => {
  const currentUser = user || getCurrentUser();
  if (!currentUser || currentUser.role === 'admin') return {};
  
  const params: Record<string, any> = {};
  
  if (currentUser.role === 'dean' && currentUser.facultyId) {
    params.facultyId = currentUser.facultyId;
  } else if ((currentUser.role === 'hod' || currentUser.role === 'lecturer') && currentUser.departmentId) {
    params.departmentId = currentUser.departmentId;
  }
  
  return params;
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    dean: 'Dean',
    hod: 'Head of Department',
    lecturer: 'Lecturer',
    student: 'Student',
    exam_officer: 'Exam Officer'
  };
  return roleNames[role] || role;
};

/**
 * Get role color for UI display
 */
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    admin: '#ef4444',      // Red
    dean: '#3b82f6',       // Blue
    hod: '#8b5cf6',        // Purple
    lecturer: '#10b981',   // Green
    student: '#f59e0b',    // Amber
    exam_officer: '#06b6d4' // Cyan
  };
  return roleColors[role] || '#6b7280'; // Gray
};

/**
 * Permission checks for common operations
 */
export const permissions = {
  canViewAllUsers: (user?: User) => hasRole(['admin', 'dean', 'hod'], user),
  canViewFaculty: (user?: User) => hasRole(['admin', 'dean'], user),
  canViewDepartment: (user?: User) => hasRole(['admin', 'dean', 'hod'], user),
  canViewProgram: (user?: User) => hasRole(['admin', 'dean', 'hod'], user),
  canEditSettings: (user?: User) => isAdmin(user),
  canViewAcademicSessions: (user?: User) => hasRole(['admin', 'dean', 'hod', 'exam_officer'], user),
  canLockResults: (user?: User) => hasRole(['admin', 'exam_officer'], user),
  canApproveResults: (user?: User) => hasRole(['admin', 'dean'], user),
  canViewTranscripts: (user?: User) => hasRole(['admin', 'student', 'exam_officer'], user),
  canGenerateTranscripts: (user?: User) => hasRole(['admin', 'exam_officer'], user)
};

/**
 * Build headers with authorization for API calls
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
