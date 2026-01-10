const http = require('http');

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
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
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  try {
    console.log('\nREGISTRATION & LOGIN TEST\n');
    
    const email = `user${Date.now()}@test.com`;
    
    // Register
    console.log('1. REGISTER STUDENT');
    const reg = await request('POST', '/api/auth/register', {
      email,
      password: 'Pass123!@#',
      role: 'student',
      fullName: 'John Doe',
      matricNo: 'STU/2026/001',
      department: 'Computer Science',
      program: 'BSc',
      level: '100'
    });
    console.log('Status:', reg.status);
    console.log('Response:', JSON.stringify(reg.data, null, 2));
    
    if (reg.status !== 201) {
      console.log('\nREGISTRATION FAILED - Stopping test\n');
      process.exit(1);
    }
    
    // Login
    console.log('\n2. LOGIN WITH REGISTERED CREDENTIALS');
    const login = await request('POST', '/api/auth/login', {
      email,
      password: 'Pass123!@#'
    });
    console.log('Status:', login.status);
    console.log('Response:', JSON.stringify(login.data, null, 2));
    
    if (login.status === 200 && login.data.access_token) {
      console.log('\n✅ SUCCESS: Registration and Login working!\n');
    } else {
      console.log('\n❌ LOGIN FAILED\n');
    }
    
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
})();
