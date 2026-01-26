/**
 * Role-Based Access Control Utility
 * Defines which roles can access which pages and features
 */

export type UserRole = 'admin' | 'dean' | 'hod' | 'examofficer' | 'lecturer' | 'student';

export interface RolePermissions {
  [key: string]: UserRole[];
}

// Define which roles can access which routes
export const rolePermissions: RolePermissions = {
  // Admin routes
  '/admin': ['admin'],
  '/admin/account-management': ['admin'],
  '/admin/student-verification': ['admin'],
  '/admin/university-setup': ['admin'],
  '/admin/academic-sessions': ['admin'],
  '/admin/semesters': ['admin'],
  '/admin/grading-templates': ['admin'],
  '/admin/result-rules': ['admin'],
  '/admin/faculties-structure': ['admin'],
  '/admin/departments': ['admin'],
  '/admin/programs': ['admin'],
  '/admin/courses': ['admin'],
  '/admin/users-roles': ['admin'],
  '/admin/user-accounts': ['admin'],
  '/admin/role-assignment': ['admin'],
  '/admin/permissions': ['admin'],
  '/admin/role-permission-matrix': ['admin'],
  '/admin/audit-logs': ['admin'],
  '/admin/backups': ['admin'],
  '/admin/backup-schedule': ['admin'],
  '/admin/restore': ['admin'],
  '/admin/integrations': ['admin'],
  '/admin/email-integration': ['admin'],
  '/admin/sms-integration': ['admin'],
  '/admin/lms-integration': ['admin'],
  '/admin/payments': ['admin'],
  '/admin/tickets': ['admin'],
  '/admin/escalations': ['admin'],
  '/admin/support': ['admin'],

  // Dean routes
  '/dean': ['dean'],
  '/dean/dashboard': ['dean'],
  '/dean/programs': ['dean'],
  '/dean/reports': ['dean'],
  '/dean/approvals': ['dean'],
  '/dean/updates': ['dean'],

  // HOD routes
  '/hod': ['hod'],
  '/hod/dashboard': ['hod'],
  '/hod/lecturers': ['hod'],
  '/hod/results-review': ['hod'],
  '/hod/reports': ['hod'],
  '/hod/students': ['hod'],
  '/hod/course-assignment': ['hod'],
  '/hod/approvals-returns': ['hod'],

  // Exam Officer routes
  '/examofficer': ['examofficer'],
  '/examofficer/dashboard': ['examofficer'],
  '/examofficer/results-compilation': ['examofficer'],
  '/examofficer/publish-results': ['examofficer'],
  '/examofficer/transcript-center': ['examofficer'],
  '/examofficer/senate-reports': ['examofficer'],
  '/examofficer/result-progress': ['examofficer'],
  '/examofficer/exceptions': ['examofficer'],

  // Lecturer routes
  '/lecturer': ['lecturer'],
  '/lecturer/dashboard': ['lecturer'],
  '/lecturer/enter-results': ['lecturer'],
  '/lecturer/drafts': ['lecturer'],
  '/lecturer/submitted-returned': ['lecturer'],
  '/lecturer/analytics': ['lecturer'],
  '/lecturer/upload-excel': ['lecturer'],
  '/lecturer/my-courses': ['lecturer'],

  // Student routes
  '/student': ['student'],
  '/student/dashboard': ['student'],
  '/student/results': ['student'],
  '/student/transcript': ['student'],
  '/student/notifications': ['student'],

  // Public routes (accessible to all)
  '/': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/profile-settings': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/how-it-works': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/roles': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/support': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/help': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/faq': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/contact': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/privacy': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/terms': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
  '/security': ['admin', 'dean', 'hod', 'examofficer', 'lecturer', 'student'],
};

/**
 * Check if a user role has access to a specific route
 */
export function hasAccessToRoute(route: string, userRole: UserRole): boolean {
  const allowedRoles = rolePermissions[route];
  if (!allowedRoles) {
    return true; // Public route
  }
  return allowedRoles.includes(userRole);
}

/**
 * Get user's role from localStorage
 */
export function getUserRole(): UserRole | null {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let role = user.role as string || null;
    
    if (!role) return null;
    
    // Normalize role to match our UserRole type
    role = role.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    
    // Map variations to standard role names
    const roleMap: { [key: string]: UserRole } = {
      'admin': 'admin',
      'super_admin': 'admin',
      'super-admin': 'admin',
      'dean': 'dean',
      'faculty_dean': 'dean',
      'faculty-dean': 'dean',
      'hod': 'hod',
      'head_of_department': 'hod',
      'head-of-department': 'hod',
      'exam_officer': 'examofficer',
      'exam-officer': 'examofficer',
      'examofficer': 'examofficer',
      'lecturer': 'lecturer',
      'student': 'student'
    };
    
    return roleMap[role] || null;
  } catch {
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(role: UserRole | UserRole[]): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  return userRole === role;
}

/**
 * Get role label for display
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: 'Administrator',
    dean: 'Dean',
    hod: 'Head of Department',
    examofficer: 'Exam Officer',
    lecturer: 'Lecturer',
    student: 'Student',
  };
  return labels[role] || role;
}

/**
 * Get dashboard route for user's role
 */
export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    admin: '/admin',
    dean: '/dean',
    hod: '/hod',
    examofficer: '/exam-officer',
    lecturer: '/lecturer',
    student: '/student',
  };
  return routes[role] || '/';
}
