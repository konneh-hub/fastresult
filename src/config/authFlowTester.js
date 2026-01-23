/**
 * Interactive Authentication Flow Tester
 * Run this in browser console to test login/registration flows
 * 
 * Usage:
 * 1. Paste this into browser console (F12)
 * 2. Run: window.AuthFlowTester.testAllLogins()
 * 3. Check console for results
 */

window.AuthFlowTester = {
  apiUrl: 'http://localhost:5000/api',
  
  // Test users
  testUsers: {
    admin: { email: 'admin@test.com', password: 'password123', role: 'admin' },
    dean: { email: 'dean@test.com', password: 'password123', role: 'dean' },
    hod: { email: 'hod@test.com', password: 'password123', role: 'hod' },
    lecturer: { email: 'lecturer@test.com', password: 'password123', role: 'lecturer' },
    student: { email: 'student@test.com', password: 'password123', role: 'student' },
    examofficer: { email: 'examofficer@test.com', password: 'password123', role: 'exam_officer' }
  },

  // Role to dashboard mapping
  dashboardRoutes: {
    admin: '/admin',
    dean: '/dean',
    hod: '/hod',
    lecturer: '/lecturer',
    student: '/student',
    exam_officer: '/exam-officer'
  },

  // Colors for console
  colors: {
    reset: '%c',
    green: '%ccolor: #28a745; font-weight: bold;',
    red: '%ccolor: #dc3545; font-weight: bold;',
    blue: '%ccolor: #007bff; font-weight: bold;',
    yellow: '%ccolor: #ffc107; font-weight: bold;'
  },

  log: function(message, style = 'reset') {
    console.log(this.colors[style], message);
  },

  // Test single login
  async testLogin(userKey) {
    const user = this.testUsers[userKey];
    if (!user) {
      this.log(`❌ Unknown user: ${userKey}`, 'red');
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const dashboardPath = this.dashboardRoutes[user.role] || '/dashboard';
        this.log(`✅ ${user.role.toUpperCase()} LOGIN SUCCESS`, 'green');
        this.log(`   Email: ${user.email}`, 'green');
        this.log(`   Dashboard: ${dashboardPath}`, 'green');
        this.log(`   Token: ${data.token.substring(0, 20)}...`, 'green');
        return { success: true, user: data.user, token: data.token, dashboardPath };
      } else {
        this.log(`❌ ${user.role.toUpperCase()} LOGIN FAILED: ${data.message}`, 'red');
        return { success: false };
      }
    } catch (error) {
      this.log(`❌ ${user.role.toUpperCase()} ERROR: ${error.message}`, 'red');
      return { success: false };
    }
  },

  // Test all logins
  async testAllLogins() {
    this.log('═══════════════════════════════════════', 'blue');
    this.log('INTERACTIVE AUTH FLOW TEST', 'blue');
    this.log('═══════════════════════════════════════', 'blue');
    this.log('Testing login for all user roles...', 'blue');
    this.log('═══════════════════════════════════════\n', 'blue');

    const results = {};
    let successCount = 0;

    for (const [key, user] of Object.entries(this.testUsers)) {
      const result = await this.testLogin(key);
      results[key] = result;
      if (result.success) successCount++;
    }

    // Summary
    this.log('\n═══════════════════════════════════════', 'blue');
    this.log('TEST SUMMARY', 'blue');
    this.log('═══════════════════════════════════════', 'blue');
    this.log(`Total: ${Object.keys(this.testUsers).length}`, 'blue');
    this.log(`Successful: ${successCount}`, 'green');
    this.log(`Failed: ${Object.keys(this.testUsers).length - successCount}`, successCount === Object.keys(this.testUsers).length ? 'green' : 'red');

    return results;
  },

  // Test registration
  async testRegistration() {
    this.log('\n═══════════════════════════════════════', 'blue');
    this.log('TESTING REGISTRATION WITH OTP', 'blue');
    this.log('═══════════════════════════════════════\n', 'blue');

    const newUser = {
      role: 'student',
      fullName: 'Test New Student',
      email: 'newstudent@test.com',
      password: 'password123',
      matricNo: 'MAT-TEST-001',
      phone: '1234567890'
    };

    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (response.ok) {
        this.log('✅ REGISTRATION SUCCESSFUL', 'green');
        this.log(`   Email: ${newUser.email}`, 'green');
        this.log(`   Name: ${newUser.fullName}`, 'green');
        this.log(`   Role: ${newUser.role}`, 'green');
        this.log(`   User ID: ${data.userId || 'N/A'}`, 'green');
        this.log(`   OTP Status: Ready for verification`, 'green');
        this.log('   Next: Navigate to /otp-verification to complete', 'yellow');
        return { success: true, userId: data.userId, email: newUser.email };
      } else {
        // Check if user already exists
        if (response.status === 409) {
          this.log('⚠️  User already exists', 'yellow');
          this.log(`   Email: ${newUser.email}`, 'yellow');
          return { success: false, reason: 'duplicate' };
        } else {
          this.log(`❌ REGISTRATION FAILED: ${data.message}`, 'red');
          return { success: false };
        }
      }
    } catch (error) {
      this.log(`❌ REGISTRATION ERROR: ${error.message}`, 'red');
      return { success: false };
    }
  },

  // Store auth data locally
  storeAuth: function(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
    this.log('✅ Auth data stored in localStorage', 'green');
    return true;
  },

  // Simulate admin login and store
  async loginAsAdmin() {
    this.log('\n═══════════════════════════════════════', 'blue');
    this.log('LOGGING IN AS ADMIN', 'blue');
    this.log('═══════════════════════════════════════\n', 'blue');

    const result = await this.testLogin('admin');
    
    if (result.success) {
      this.storeAuth(result.token, result.user);
      this.log(`Navigate to: ${result.dashboardPath}`, 'blue');
      this.log('Ready to test admin dashboard', 'green');
    }

    return result;
  },

  // Get user info from localStorage
  getUserInfo: function() {
    this.log('═══════════════════════════════════════', 'blue');
    this.log('CURRENT USER INFO', 'blue');
    this.log('═══════════════════════════════════════\n', 'blue');

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (token && user) {
      const userData = JSON.parse(user);
      this.log(`✅ User authenticated`, 'green');
      this.log(`   Email: ${userData.email}`, 'blue');
      this.log(`   Role: ${userData.role}`, 'blue');
      this.log(`   ID: ${userData.id}`, 'blue');
      this.log(`   Name: ${userData.fullName}`, 'blue');
      this.log(`   Dashboard: ${this.dashboardRoutes[userData.role]}`, 'blue');
    } else {
      this.log('❌ No user authenticated', 'red');
    }
  },

  // Test admin dashboard access
  async testAdminDashboard() {
    this.log('\n═══════════════════════════════════════', 'blue');
    this.log('TESTING ADMIN DASHBOARD ACCESS', 'blue');
    this.log('═══════════════════════════════════════\n', 'blue');

    const token = localStorage.getItem('token');
    if (!token) {
      this.log('❌ No token found. Run loginAsAdmin() first', 'red');
      return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        this.log('✅ ADMIN DASHBOARD ACCESS GRANTED', 'green');
        this.log('Admin can access all dashboard features', 'green');
        return true;
      } else if (response.status === 403) {
        this.log('❌ ACCESS DENIED - User is not admin', 'red');
        return false;
      } else {
        this.log(`⚠️  Dashboard endpoint status: ${response.status}`, 'yellow');
        this.log('Endpoint may not exist yet (API development)', 'yellow');
        return false;
      }
    } catch (error) {
      this.log(`⚠️  Could not test dashboard: ${error.message}`, 'yellow');
      return false;
    }
  },

  // Clear auth (logout)
  clearAuth: function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.log('✅ Auth data cleared (logged out)', 'green');
  },

  // Show help
  showHelp: function() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║       INTERACTIVE AUTH FLOW TESTER - COMMAND GUIDE         ║
╚════════════════════════════════════════════════════════════╝

MAIN TESTS:
  • window.AuthFlowTester.testAllLogins()
    → Test login for all 6 user roles

  • window.AuthFlowTester.testRegistration()
    → Test new user registration

  • window.AuthFlowTester.loginAsAdmin()
    → Login as admin and store auth data

HELPERS:
  • window.AuthFlowTester.getUserInfo()
    → Show current logged in user

  • window.AuthFlowTester.testAdminDashboard()
    → Test admin dashboard access

  • window.AuthFlowTester.clearAuth()
    → Clear stored auth data (logout)

QUICK START:
  1. Run: window.AuthFlowTester.testAllLogins()
  2. Run: window.AuthFlowTester.loginAsAdmin()
  3. Run: window.AuthFlowTester.testAdminDashboard()
  4. Navigate to: http://localhost:3000/admin

EXPECTED RESULTS:
  ✅ All 6 user logins should succeed
  ✅ Admin should redirect to /admin
  ✅ Student should redirect to /student
  ✅ New registration needs OTP verification
    `);
  }
};

// Show help on load
console.log('%cAuthFlowTester loaded! Type: window.AuthFlowTester.showHelp()', 'color: #007bff; font-weight: bold;');
