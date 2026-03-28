const app = require('./src/app-fixed');
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting RehamerPaint ERP API Server...');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🏠 Home: http://localhost:${PORT}/`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/v1/auth`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed.');
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
