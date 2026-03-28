const app = require('./src/app-fixed');
const { sequelize } = require('./src/models');
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting RehamerPaint ERP API Server...');
    
    // Test database connection
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');
    } catch (error) {
      console.log('⚠️  Database connection failed:', error.message);
      console.log('   Server will continue without database functionality.');
    }

    // Sync database models (in development)
    if (process.env.NODE_ENV === 'development') {
      try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.');
      } catch (error) {
        console.log('⚠️  Database sync failed:', error.message);
      }
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🗄️  Database: Connected`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed.');
        
        try {
          await sequelize.close();
          console.log('Database connection closed.');
        } catch (error) {
          console.error('Error during database shutdown:', error);
        }
        
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

startServer();
