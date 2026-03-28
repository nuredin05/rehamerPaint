// Database setup: align schema with Sequelize models (adds missing columns, safe for dev)
const { sequelize } = require('./src/models');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: true });
    console.log('✅ Schema synchronized (alter: true) — tables match models');

    console.log('\n🎉 Database setup complete!');
    console.log('📝 You can now start the server with: npm start');
    console.log('💡 To create admin user: node create-test-user.js (needs company id 1)');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('\n💡 Possible solutions:');
    console.error('   1. Check MySQL is running');
    console.error('   2. Verify database credentials in backend/.env');
    console.error('   3. Ensure database exists: CREATE DATABASE rehamerpaint_erp;');
    console.error('   4. Check MySQL user has proper permissions');
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
