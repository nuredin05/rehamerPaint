// Test backend connection
const axios = require('axios');

async function testBackend() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test login endpoint
    const loginResponse = await axios.post('http://localhost:3000/api/v1/auth/login', {
      identifier: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login successful:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testBackend();
