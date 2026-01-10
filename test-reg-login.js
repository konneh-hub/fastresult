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
            body: body ? JSON.parse(body) : null
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
    console.log('\n========================================');
    console.log('TESTING REGISTRATION & LOGIN FLOW');
    console.log('========================================\n');

    // Test 1: Registration
    console.log('📝 TEST 1: Registering new student...');
    const email = `student${Date.now()}@test.com`;
    const regData = {
      email: email,
      password: 'TestPassword@123',
      role: 'student',
      fullName: 'Test Student',
      matricNo: 'STU/2026/001',
      level: '100'
    };
    
    console.log('Request data:', JSON.stringify(regData, null, 2));
    
    const registration = await makeRequest('POST', '/api/auth/register', regData);
    console.log('\nResponse Status:', registration.status);
    console.log('Response Body:', JSON.stringify(registration.body, null, 2));
    
    if (registration.status === 201 || registration.status === 200) {
      console.log('✅ Registration successful!\n');
      
      // Test 2: Login
      console.log('🔐 TEST 2: Logging in with registered credentials...');
      const loginData = {
        email: email,
        password: 'TestPassword@123'
      };
      
      const login = await makeRequest('POST', '/api/auth/login', loginData);
      console.log('Response Status:', login.status);
      console.log('Response Body:', JSON.stringify(login.body, null, 2));
      
      if (login.status === 200) {
        console.log('✅ Login successful!');
        console.log(`✅ Token: ${login.body.token ? login.body.token.substring(0, 20) + '...' : 'No token'}\n`);
      } else {
        console.log('❌ Login failed!\n');
      }
    } else {
      console.log('❌ Registration failed!\n');
    }

    console.log('========================================\n');
    
  } catch (err) {
    console.error('\n❌ Error:', err.message, '\n');
    process.exit(1);
  }
})();
