const { sequelize } = require('./src/models');

async function createTables() {
  try {
    console.log('🏗️  Creating database tables...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Create all tables
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully!');
    
    // List created tables
    const [results] = await sequelize.query('SHOW TABLES');
    const tables = results.map(result => Object.values(result)[0]);
    
    console.log('\n📋 Created Tables:');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table}`);
    });
    
    console.log(`\n🎉 Total: ${tables.length} tables created`);
    console.log('\n🚀 Your RehamerPaint ERP database is ready!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

createTables();
