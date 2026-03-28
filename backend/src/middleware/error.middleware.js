const logger = require('../utils/logger');
const ResponseHelper = require('../utils/responseHelper');
const config = require('../config');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.logError(err, req);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
    return ResponseHelper.validationError(res, errors);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'unknown';
    return ResponseHelper.conflict(res, `${field} already exists`);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ResponseHelper.error(res, 'Invalid reference to related data', 'FOREIGN_KEY_ERROR');
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return ResponseHelper.error(res, 'Database operation failed', 'DATABASE_ERROR');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseHelper.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseHelper.unauthorized(res, 'Token expired');
  }

  // Joi validation error
  if (err.isJoi) {
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
    return ResponseHelper.validationError(res, errors);
  }

  // Multer file upload error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return ResponseHelper.error(res, 'File size too large', 'FILE_TOO_LARGE');
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return ResponseHelper.error(res, 'Too many files', 'TOO_MANY_FILES');
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return ResponseHelper.error(res, 'Unexpected file field', 'UNEXPECTED_FILE');
  }

  // Custom application errors
  if (err.statusCode) {
    return ResponseHelper.error(res, err.message, err.code || 'APPLICATION_ERROR', err.details, err.statusCode);
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = config.app.environment === 'production' 
    ? 'Internal server error' 
    : error.message || 'Something went wrong';

  return ResponseHelper.error(res, message, 'INTERNAL_ERROR', [], statusCode);
};

/**
 * Async error wrapper for route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler
};
