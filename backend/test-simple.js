const http = require('http');

// Simple test without database dependency
async function testSimple() {
  console.log('🧪 Testing Basic API Endpoints...\n');

  // Test health endpoint
  try {
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
    return;
  }

  // Test home endpoint
  try {
    const homeResponse = await fetch('http://localhost:3000/');
    const homeData = await homeResponse.json();
    console.log('✅ Home Endpoint:', homeData.message);
  } catch (error) {
    console.log('❌ Home Endpoint failed:', error.message);
  }

  // Test a simple route that doesn't require database
  try {
    const adminResponse = await fetch('http://localhost:3000/api/v1/admin/users');
    const adminData = await adminResponse.json();
    console.log('✅ Admin Users Endpoint:', adminData.success ? 'Working' : 'Needs auth');
  } catch (error) {
    console.log('❌ Admin Endpoint failed:', error.message);
  }

  console.log('\n🎉 Basic API Test Complete!');
  console.log('📝 Next: Add database connection and test login');
}

testSimple();
