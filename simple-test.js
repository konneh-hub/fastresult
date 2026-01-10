#!/usr/bin/env node

const http = require('http');

// Create a test that just makes one single request
console.log('Testing registration endpoint...\n');

const postData = JSON.stringify({
  email: 'testuser@example.com',
  password: 'TestPassword123!',
  role: 'student',
  fullName: 'Test User',
  matricNo: 'TST/2026/001',
  department: 'CS',
  program: 'BSc',
  level: '100'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending POST request to:', options.path);
console.log('Payload:', JSON.parse(postData));
console.log('\n');

const req = http.request(options, (res) => {
  let data = '';
  
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers));
  console.log('\nResponse Body:');
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e.message);
  console.error('Error code:', e.code);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
  process.exit(1);
});

req.write(postData);
req.end();
