const app = require('./src/app-minimal');

const PORT = process.env.PORT || 3000;

console.log('Starting minimal server...');

try {
  const server = app.listen(PORT, () => {
    console.log(`✅ Minimal server is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🏠 Home: http://localhost:${PORT}/`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down...`);
    server.close(() => {
      console.log('Server closed.');
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
