const http = require('http');

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', err => {
      console.error('HTTP Request Error:', err.message);
      reject(err);
    });
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('SRMS: REGISTRATION & LOGIN FULL TEST');
    console.log('='.repeat(60) + '\n');
    
    const email = `student${Date.now()}@test.com`;
    const password = 'TestPass@123456';
    
    // 1. STUDENT REGISTRATION
    console.log('1️⃣  STUDENT REGISTRATION');
    console.log('-'.repeat(60));
    const studentReg = await request('POST', '/api/auth/register', {
      email,
      password,
      role: 'student',
      fullName: 'Ahmed Hassan',
      matricNo: 'CSC/2026/001',
      department: 'Computer Science',
      program: 'BSc Computer Science',
      level: '100'
    });
    
    console.log('Request: POST /api/auth/register');
    console.log('Status:', studentReg.status);
    console.log('Response:', JSON.stringify(studentReg.data, null, 2));
    
    if (studentReg.status !== 201) {
      console.log('\n❌ STUDENT REGISTRATION FAILED\n');
      process.exit(1);
    }
    console.log('✅ STUDENT REGISTRATION SUCCESSFUL\n');
    
    // 2. STUDENT LOGIN
    console.log('2️⃣  STUDENT LOGIN');
    console.log('-'.repeat(60));
    const studentLogin = await request('POST', '/api/auth/login', {
      email,
      password
    });
    
    console.log('Request: POST /api/auth/login');
    console.log('Status:', studentLogin.status);
    console.log('Response:', JSON.stringify(studentLogin.data, null, 2));
    
    if (studentLogin.status !== 200 || !studentLogin.data.token) {
      console.log('\n❌ STUDENT LOGIN FAILED\n');
      process.exit(1);
    }
    console.log('✅ STUDENT LOGIN SUCCESSFUL\n');
    
    // 3. LECTURER REGISTRATION
    console.log('3️⃣  LECTURER REGISTRATION');
    console.log('-'.repeat(60));
    const lecturerEmail = `lecturer${Date.now()}@test.com`;
    const lecturerReg = await request('POST', '/api/auth/register', {
      email: lecturerEmail,
      password,
      role: 'lecturer',
      fullName: 'Dr. Jane Smith',
      staffId: 'LEC/2026/001',
      faculty: 'Faculty of Science'
    });
    
    console.log('Request: POST /api/auth/register');
    console.log('Status:', lecturerReg.status);
    console.log('Response:', JSON.stringify(lecturerReg.data, null, 2));
    
    if (lecturerReg.status !== 201) {
      console.log('\n❌ LECTURER REGISTRATION FAILED\n');
      process.exit(1);
    }
    console.log('✅ LECTURER REGISTRATION SUCCESSFUL\n');
    
    // 4. LECTURER LOGIN
    console.log('4️⃣  LECTURER LOGIN');
    console.log('-'.repeat(60));
    const lecturerLogin = await request('POST', '/api/auth/login', {
      email: lecturerEmail,
      password
    });
    
    console.log('Request: POST /api/auth/login');
    console.log('Status:', lecturerLogin.status);
    console.log('Response:', JSON.stringify(lecturerLogin.data, null, 2));
    
    if (lecturerLogin.status !== 200 || !lecturerLogin.data.token) {
      console.log('\n❌ LECTURER LOGIN FAILED\n');
      process.exit(1);
    }
    console.log('✅ LECTURER LOGIN SUCCESSFUL\n');
    
    // Summary
    console.log('='.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n📋 SUMMARY:');
    console.log('  ✓ Student registration successful');
    console.log('  ✓ Student login successful (token obtained)');
    console.log('  ✓ Lecturer registration successful');
    console.log('  ✓ Lecturer login successful (token obtained)');
    console.log('\n🎉 Users can now access their dashboards!\n');
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message, '\n');
    process.exit(1);
  }
})();
