const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load configuration
const config = require('./config');

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
app.use('/api/v1/hr', hrRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/manufacturing', manufacturingRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/procurement', procurementRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/logistics', logisticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reports', reportRoutes);

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

module.exports = app;
