const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load all components
const config = require('./src/config');
const models = require('./src/models');
const authMiddleware = require('./src/middleware/auth.middleware');
const ResponseHelper = require('./src/utils/responseHelper');
const authRoutes = require('./src/routes/auth.routes');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting RehamerPaint ERP API Server...');
    
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors());
    app.use(compression());

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Request logging
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    // API routes
    app.use('/api/v1/auth', authRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ 
        message: 'RehamerPaint ERP API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api-docs'
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found'
        },
        timestamp: new Date().toISOString()
      });
    });

    // Error handler
    app.use((error, req, res, next) => {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        timestamp: new Date().toISOString()
      });
    });

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🏠 Home: http://localhost:${PORT}/`);
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
