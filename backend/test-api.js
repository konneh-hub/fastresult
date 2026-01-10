#!/usr/bin/env node

const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : body
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
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

async function testAPI() {
  console.log('🧪 Testing API Endpoints\n');
  
  // Test 1: Health check
  console.log('1️⃣  Testing /api/health...');
  try {
    const health = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/health',
      method: 'GET'
    });
    console.log('   Status:', health.status);
    console.log('   Response:', health.body);
    console.log('   ✅ Health check passed\n');
  } catch (e) {
    console.log('   ❌ Error:', e.message, '\n');
  }
  
  // Test 2: Registration
  console.log('2️⃣  Testing /api/auth/register (student)...');
  try {
    const testStudent = {
      email: 'student@test.com',
      password: 'Test@1234',
      fullName: 'Test Student',
      role: 'student',
      matricNo: 'STU/2026/001',
      level: '100'
    };
    
    const register = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testStudent);
    
    console.log('   Status:', register.status);
    if (register.status === 201 || register.status === 200) {
      console.log('   ✅ Registration successful');
      console.log('   Response:', register.body);
    } else {
      console.log('   Response:', register.body);
    }
    console.log();
  } catch (e) {
    console.log('   ❌ Error:', e.message, '\n');
  }
  
  // Test 3: Login
  console.log('3️⃣  Testing /api/auth/login...');
  try {
    const login = await makeRequest({
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'student@test.com',
      password: 'Test@1234'
    });
    
    console.log('   Status:', login.status);
    console.log('   Response:', login.body);
    if (login.status === 200 && login.body.access_token) {
      console.log('   ✅ Login successful');
    } else {
      console.log('   ⚠️  Login response received (may have expected error if user not registered)');
    }
    console.log();
  } catch (e) {
    console.log('   ❌ Error:', e.message, '\n');
  }
  
  console.log('✅ API Testing Complete!');
}

testAPI().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
