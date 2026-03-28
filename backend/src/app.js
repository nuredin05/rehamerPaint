const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { specs } = require('./config/swagger');

const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');
const auditMiddleware = require('./middleware/audit.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const hrRoutes = require('./routes/hr.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const manufacturingRoutes = require('./routes/manufacturing.routes');
const salesRoutes = require('./routes/sales.routes');
const procurementRoutes = require('./routes/procurement.routes');
const financeRoutes = require('./routes/finance.routes');
const logisticsRoutes = require('./routes/logistics.routes');
const adminRoutes = require('./routes/admin.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Audit logging for authenticated routes
app.use('/api', auditMiddleware);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'RehamerPaint ERP API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    operationsSorter: 'alpha',
    tagsSorter: 'alpha',
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/hr`, authMiddleware.authenticate, hrRoutes);
app.use(`${config.api.prefix}/inventory`, authMiddleware.authenticate, inventoryRoutes);
app.use(`${config.api.prefix}/manufacturing`, authMiddleware.authenticate, manufacturingRoutes);
app.use(`${config.api.prefix}/sales`, authMiddleware.authenticate, salesRoutes);
app.use(`${config.api.prefix}/procurement`, authMiddleware.authenticate, procurementRoutes);
app.use(`${config.api.prefix}/finance`, authMiddleware.authenticate, financeRoutes);
app.use(`${config.api.prefix}/logistics`, authMiddleware.authenticate, logisticsRoutes);
app.use(`${config.api.prefix}/admin`, authMiddleware.authenticate, authMiddleware.requireRole(['admin']), adminRoutes);
app.use(`${config.api.prefix}/reports`, authMiddleware.authenticate, reportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
