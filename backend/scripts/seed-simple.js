const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/models');
const config = require('../src/config');

/**
 * Simple database seeding script - creates admin user only
 */

async function seedDatabase() {
  try {
    console.log('Starting simple database seeding...');

    // Import models
    const models = require('../src/models');
    const { Company, User } = models;

    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create sample company
    const company = await Company.create({
      name: 'RehamerPaint Demo Company',
      code: 'RP_DEMO',
      address: '123 Industrial Street, Addis Ababa, Ethiopia',
      phone: '+251-11-1234567',
      email: 'info@rehamerpaint.com',
      taxId: 'TX123456789'
    });
    console.log('Sample company created:', company.name);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', config.security.bcryptRounds);
    const adminUser = await User.create({
      companyId: company.id,
      username: 'admin',
      email: 'admin@rehamerpaint.com',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin'
    });
    console.log('Admin user created:', adminUser.username);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🌐 Test Login: POST /api/v1/auth/login');
    console.log('🏥 Health Check: http://localhost:3000/health');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
