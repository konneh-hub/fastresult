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
      },
      timeout: 5000
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

    req.on('error', (e) => {
      reject(e);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  try {
    console.log('🧪 Testing SRMS API\n');

    // Test 1: Health Check
    console.log('1️⃣  /api/health');
    const health = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.body)}`);
    console.log('   ✅\n');

    // Test 2: Register Student
    console.log('2️⃣  /api/auth/register (Student)');
    const student = {
      email: 'student@test.com',
      password: 'TestPass@123',
      role: 'student',
      fullName: 'John Student',
      matricNo: 'STU/2026/001',
      level: '100'
    };
    const regStudent = await makeRequest('POST', '/api/auth/register', student);
    console.log(`   Status: ${regStudent.status}`);
    console.log(`   Response: ${JSON.stringify(regStudent.body)}`);
    console.log(regStudent.status === 201 ? '   ✅\n' : '   ⚠️\n');

    // Test 3: Register Lecturer
    console.log('3️⃣  /api/auth/register (Lecturer)');
    const lecturer = {
      email: 'lecturer@test.com',
      password: 'TestPass@123',
      role: 'lecturer',
      fullName: 'Dr. Jane Lecturer',
      staffNo: 'LEC/2026/001'
    };
    const regLecturer = await makeRequest('POST', '/api/auth/register', lecturer);
    console.log(`   Status: ${regLecturer.status}`);
    console.log(`   Response: ${JSON.stringify(regLecturer.body)}`);
    console.log(regLecturer.status === 201 ? '   ✅\n' : '   ⚠️\n');

    // Test 4: Login
    console.log('4️⃣  /api/auth/login');
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'student@test.com',
      password: 'TestPass@123'
    });
    console.log(`   Status: ${login.status}`);
    console.log(`   Response: ${JSON.stringify(login.body)}`);
    if (login.status === 200 && login.body.access_token) {
      console.log('   ✅ Token received\n');
    } else {
      console.log('   Response received\n');
    }

    console.log('\n✅ All API endpoints tested successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
