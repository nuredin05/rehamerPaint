// Database setup script for RehamerPaint ERP
const { sequelize } = require('./src/config/database');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync all models
    const { sequelize: db } = require('./src/config/database');
    await db.sync({ force: false });
    console.log('✅ Database models synchronized successfully');
    
    console.log('\n🎉 Database setup complete!');
    console.log('📝 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('\n💡 Possible solutions:');
    console.error('   1. Check MySQL is running');
    console.error('   2. Verify database credentials in .env');
    console.error('   3. Ensure database exists: CREATE DATABASE rehamerpaint_erp;');
    console.error('   4. Check MySQL user has proper permissions');
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
