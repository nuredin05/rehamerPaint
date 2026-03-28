// Debug the backend login error
const axios = require('axios');

async function debugLogin() {
  try {
    console.log('🔍 Testing login endpoint...');
    
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
      identifier: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Success:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed with status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    console.error('❌ Full error:', error.message);
    
    if (error.response?.data?.stack) {
      console.error('❌ Stack trace:', error.response.data.stack);
    }
  }
}

debugLogin();
