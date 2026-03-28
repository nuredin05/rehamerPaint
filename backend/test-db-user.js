// Test database user connection
const { sequelize } = require('./src/models');

async function testDbUser() {
  try {
    console.log('🔍 Testing database user connection...');
    
    // Test if admin user exists in database
    const [results] = await sequelize.query(`
      SELECT id, username, email, role, password_hash 
      FROM users 
      WHERE username = 'admin' OR email = 'admin@rehamerpaint.com'
      LIMIT 1
    `);
    
    if (results.length > 0) {
      const user = results[0];
      console.log('✅ Admin user found in database:');
      console.log('   ID:', user.id);
      console.log('   Username:', user.username);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Has Password:', !!user.password_hash);
      
      // Test password verification
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare('admin123', user.password_hash);
      console.log('   Password Valid:', isValid);
      
    } else {
      console.log('❌ Admin user not found in database');
      console.log('🔧 Run the SQL script to create the admin user');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testDbUser();
