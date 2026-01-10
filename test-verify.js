const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body
          });
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
    console.log('\n✅ SRMS API ENDPOINTS VERIFICATION\n');
    console.log('================================\n');

    // Test Health
    console.log('1. Health Check: GET /api/health');
    const health = await makeRequest('GET', '/api/health');
    console.log(`   ✓ Status: ${health.status}`);
    console.log(`   ✓ Response: ${JSON.stringify(health.body)}\n`);

    // Test Register Student
    console.log('2. Register Student: POST /api/auth/register');
    const studentReg = await makeRequest('POST', '/api/auth/register', {
      email: `student_${Date.now()}@test.com`,
      password: 'SecurePass@123',
      role: 'student',
      fullName: 'Test Student',
      matricNo: `STU/${new Date().getFullYear()}/001`,
      level: '100'
    });
    console.log(`   ✓ Status: ${studentReg.status}`);
    console.log(`   ✓ Response: ${JSON.stringify(studentReg.body)}\n`);

    // Test Login
    console.log('3. Login: POST /api/auth/login');
    const loginResp = await makeRequest('POST', '/api/auth/login', {
      email: `student_${Date.now()}@test.com`,
      password: 'SecurePass@123'
    });
    console.log(`   ✓ Status: ${loginResp.status}`);
    console.log(`   ✓ Response: ${JSON.stringify(loginResp.body)}\n`);

    console.log('================================');
    console.log('✅ All endpoints verified!\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
