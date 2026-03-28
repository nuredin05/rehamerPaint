// Test login functionality
async function testLogin() {
  console.log('🔐 Testing RehamerPaint ERP Login...\n');

  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'admin',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Login Successful!');
      console.log('📋 Response:', JSON.stringify(data, null, 2));
      console.log('\n🎉 Your ERP system is fully functional!');
    } else {
      console.log('❌ Login Failed');
      console.log('📋 Response:', JSON.stringify(data, null, 2));
      console.log('\n🔧 Check database connection or user credentials');
    }

  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('🔧 Make sure the server is running on port 3000');
  }
}

testLogin();
