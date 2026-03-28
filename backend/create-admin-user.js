// Create admin user for RehamerPaint ERP

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    // Import models after database sync
    const { User } = require('./src/models');
    const { sequelize } = require('./src/config/database');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Plain password: User model beforeCreate hook hashes passwordHash
    // companyId must reference an existing companies row (seed or create company first)
    const user = await User.create({
      username: 'admin',
      email: 'admin@rehamerpaint.com',
      passwordHash: 'admin123',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true,
      loginAttempts: 0,
      lockedUntil: null,
      companyId: 1
    });
    
    console.log('✅ Admin user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email
    });
    
    console.log('\n📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();
