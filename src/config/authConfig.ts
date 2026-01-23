/**
 * Authentication and Routing Configuration
 * Ensures proper login flow and dashboard routing for all user roles
 * Including OTP verification for new users
 */

// Role-based dashboard routing configuration
export const ROLE_ROUTES = {
  admin: '/admin',
  super_admin: '/admin',
  dean: '/dean',
  hod: '/hod',
  exam_officer: '/exam-officer',
  lecturer: '/lecturer',
  student: '/student'
};

// Default route for unrecognized roles
export const DEFAULT_DASHBOARD = '/dashboard';

/**
 * Get dashboard route for a user role
 * @param {string} role - User role
 * @returns {string} Dashboard path
 */
export function getDashboardRoute(role: string): string {
  return ROLE_ROUTES[role as keyof typeof ROLE_ROUTES] || DEFAULT_DASHBOARD;
}

/**
 * Check if user is admin
 * @param {string} role - User role
 * @returns {boolean}
 */
export function isAdmin(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

/**
 * Check if user requires OTP verification
 * User requires OTP if:
 * 1. Recently registered (isNewRegistration = true)
 * 2. Not verified yet (verified !== true)
 * @param {object} user - User object
 * @param {object} state - Navigation state
 * @returns {boolean}
 */
export function requiresOTPVerification(user: any, state: any): boolean {
  return state?.isNewRegistration === true || user?.verified !== true;
}

/**
 * OTP Configuration
 */
export const OTP_CONFIG = {
  // OTP code length (digits)
  length: 6,
  
  // Expiration time in milliseconds (10 minutes)
  expiryTime: 10 * 60 * 1000,
  
  // Maximum verification attempts
  maxAttempts: 5,
  
  // Re-send OTP cool-down in milliseconds (1 minute)
  resendCooldown: 60 * 1000
};

/**
 * Authentication states
 */
export const AUTH_STATES = {
  UNAUTHENTICATED: 'unauthenticated',
  AUTHENTICATING: 'authenticating',
  AUTHENTICATED: 'authenticated',
  OTP_REQUIRED: 'otp_required',
  OTP_VERIFYING: 'otp_verifying',
  SESSION_EXPIRED: 'session_expired'
};

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/otp-verification',
  '/register-success',
  '/'
];

/**
 * Protected routes (require authentication)
 */
export const PROTECTED_ROUTES = {
  admin: ['/admin', '/admin/*'],
  dean: ['/dean', '/dean/*'],
  hod: ['/hod', '/hod/*'],
  exam_officer: ['/exam-officer', '/exam-officer/*'],
  lecturer: ['/lecturer', '/lecturer/*'],
  student: ['/student', '/student/*']
};

/**
 * Check if route is public
 * @param {string} path - Current path
 * @returns {boolean}
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route.endsWith('/*')) {
      return path.startsWith(route.slice(0, -2));
    }
    return path === route || path.startsWith(route + '/');
  });
}

/**
 * Check if user can access route
 * @param {string} role - User role
 * @param {string} path - Route path
 * @returns {boolean}
 */
export function canAccessRoute(role: string, path: string): boolean {
  if (isPublicRoute(path)) return true;

  const protectedPaths = PROTECTED_ROUTES[role as keyof typeof PROTECTED_ROUTES] || [];
  return protectedPaths.some((route: string) => {
    if (route.endsWith('/*')) {
      return path.startsWith(route.slice(0, -2));
    }
    return path === route || path.startsWith(route + '/');
  });
}

/**
 * Get user profile data from localStorage
 * @returns {object|null}
 */
export function getUserProfile() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error parsing user profile:', e);
    return null;
  }
}

/**
 * Get authentication token from localStorage
 * @returns {string|null}
 */
export function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getAuthToken() && !!getUserProfile();
}

/**
 * Save authentication data
 * @param {string} token - JWT token
 * @param {object} user - User data
 */
export function saveAuthData(token: string, user: any): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('role', user.role);
}

/**
 * Clear authentication data (logout)
 */
export function clearAuthData(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('rememberEmail');
}

/**
 * Mark user as OTP verified
 * @param {object} user - User object
 */
export function markUserOTPVerified(user: any): any {
  const updatedUser = {
    ...user,
    verified: true,
    otp_verified_at: new Date().toISOString()
  };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
}

/**
 * Export all configurations as default
 */
export default {
  ROLE_ROUTES,
  DEFAULT_DASHBOARD,
  getDashboardRoute,
  isAdmin,
  requiresOTPVerification,
  OTP_CONFIG,
  AUTH_STATES,
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  isPublicRoute,
  canAccessRoute,
  getUserProfile,
  getAuthToken,
  isAuthenticated,
  saveAuthData,
  clearAuthData,
  markUserOTPVerified
};
