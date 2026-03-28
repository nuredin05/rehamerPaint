// Create admin user in database
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/models');

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    await sequelize.query(`
      INSERT INTO users (id, username, email, password_hash, first_name, last_name, role, is_active, company_id, created_at, updated_at)
      VALUES (1, 'admin', 'admin@rehamerpaint.com', :password, 'Admin', 'User', 'admin', 1, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password_hash = :password, updated_at = NOW()
    `, {
      replacements: { password: hashedPassword }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();
