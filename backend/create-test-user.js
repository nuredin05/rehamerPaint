// Create test user for RehamerPaint ERP
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');

async function createTestUser() {
  try {
    console.log('🔧 Creating test user...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Import and initialize User model
    const { User } = require('./src/models');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create test user
    const user = await User.create({
      username: 'admin',
      email: 'admin@rehamerpaint.com',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      loginAttempts: 0,
      lockedUntil: null,
      companyId: 1 // Assuming company with ID 1 exists
    });
    
    console.log('✅ Test user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email
    });
    
    console.log('\n📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await sequelize.close();
  }
}

createTestUser();
