const http = require('http');

// Test the API endpoints
async function testAPI() {
  console.log('🧪 Testing RehamerPaint ERP API...\n');

  // Test health endpoint
  try {
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
  }

  // Test home endpoint
  try {
    const homeResponse = await fetch('http://localhost:3000/');
    const homeData = await homeResponse.json();
    console.log('✅ Home Endpoint:', homeData);
  } catch (error) {
    console.log('❌ Home Endpoint failed:', error.message);
  }

  // Test login endpoint (should work even without database)
  try {
    const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'test',
        password: 'test123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login Endpoint:', loginData);
  } catch (error) {
    console.log('❌ Login Endpoint failed:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
}

testAPI();
