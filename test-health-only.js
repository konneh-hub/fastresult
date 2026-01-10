const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Health check status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Health check failed:', e.message);
  process.exit(1);
});

req.end();
