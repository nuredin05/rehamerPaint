const logger = require('../utils/logger');

/**
 * Audit logging middleware
 * Logs all authenticated API calls for compliance and security
 */
const auditMiddleware = (req, res, next) => {
  // Skip audit logging for health checks and documentation
  if (req.path === '/health' || req.path === '/api-docs') {
    return next();
  }

  // Store original res.end to capture response
  const originalEnd = res.end;
  let responseData = '';

  res.end = function(chunk, encoding) {
    if (chunk) {
      responseData = chunk.toString();
    }
    originalEnd.call(this, chunk, encoding);
  };

  // Log after response is sent
  res.on('finish', () => {
    // Only log authenticated requests
    if (req.user) {
      const auditData = {
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        companyId: req.user.companyId,
        action: getActionFromMethod(req.method),
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      };

      // Add request body for non-GET requests (excluding sensitive data)
      if (req.method !== 'GET' && req.body) {
        auditData.requestBody = sanitizeRequestBody(req.body);
      }

      // Add response data for successful operations
      if (res.statusCode < 400 && responseData) {
        try {
          const parsedResponse = JSON.parse(responseData);
          auditData.responseData = sanitizeResponseData(parsedResponse);
        } catch (e) {
          // Ignore JSON parse errors
        }
      }

      logger.logAudit(
        auditData.action,
        req.user.id,
        getTableNameFromPath(req.path),
        getRecordIdFromRequest(req),
        auditData
      );
    }
  });

  next();
};

/**
 * Extract action from HTTP method
 */
const getActionFromMethod = (method) => {
  const actions = {
    GET: 'READ',
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE'
  };
  return actions[method] || 'UNKNOWN';
};

/**
 * Extract table name from request path
 */
const getTableNameFromPath = (path) => {
  const pathSegments = path.split('/').filter(segment => segment);
  const apiIndex = pathSegments.findIndex(segment => segment === 'api');
  
  if (apiIndex !== -1 && pathSegments.length > apiIndex + 2) {
    const module = pathSegments[apiIndex + 1];
    const resource = pathSegments[apiIndex + 2];
    
    // Map API paths to table names
    const pathToTableMap = {
      'hr/employees': 'employees',
      'hr/attendance': 'attendance',
      'hr/payroll': 'payroll',
      'hr/departments': 'departments',
      'inventory/products': 'products',
      'inventory/warehouses': 'warehouses',
      'inventory/stocks': 'inventory_stocks',
      'inventory/transactions': 'inventory_transactions',
      'manufacturing/bom': 'bill_of_materials',
      'manufacturing/production-orders': 'production_orders',
      'manufacturing/batches': 'production_batches',
      'manufacturing/quality-tests': 'quality_tests',
      'sales/customers': 'customers',
      'sales/sales-orders': 'sales_orders',
      'sales/invoices': 'invoices',
      'procurement/suppliers': 'suppliers',
      'procurement/purchase-orders': 'purchase_orders',
      'finance/transactions': 'transactions',
      'finance/chart-of-accounts': 'chart_of_accounts',
      'logistics/vehicles': 'vehicles',
      'logistics/delivery-orders': 'delivery_orders',
      'admin/users': 'users',
      'admin/companies': 'companies'
    };
    
    return pathToTableMap[`${module}/${resource}`] || resource;
  }
  
  return 'unknown';
};

/**
 * Extract record ID from request
 */
const getRecordIdFromRequest = (req) => {
  // Try to get ID from URL parameters
  if (req.params.id) {
    return req.params.id;
  }
  
  // Try to get ID from request body for POST requests
  if (req.body && req.body.id) {
    return req.body.id;
  }
  
  // Try to get ID from query parameters
  if (req.query.id) {
    return req.query.id;
  }
  
  return null;
};

/**
 * Sanitize request body to remove sensitive information
 */
const sanitizeRequestBody = (body) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = [
    'password',
    'confirmPassword',
    'currentPassword',
    'newPassword',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'creditCard',
    'ssn',
    'socialSecurityNumber'
  ];

  const sanitized = { ...body };

  // Remove or mask sensitive fields
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  // Remove large binary data
  if (sanitized.file && sanitized.file.size > 1000) {
    sanitized.file = '[BINARY_DATA]';
  }

  return sanitized;
};

/**
 * Sanitize response data to remove sensitive information
 */
const sanitizeResponseData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // If it's an array, sanitize each item
  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponseData(item));
  }

  const sensitiveFields = [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey'
  ];

  const sanitized = { ...data };

  // Remove sensitive fields
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      delete sanitized[field];
    }
  });

  // Recursively sanitize nested objects
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeResponseData(sanitized[key]);
    }
  });

  return sanitized;
};

/**
 * Custom audit logging for specific events
 */
const logCustomEvent = (userId, action, tableName, recordId, details = {}) => {
  logger.logAudit(action, userId, tableName, recordId, {
    ...details,
    timestamp: new Date().toISOString(),
    customEvent: true
  });
};

module.exports = {
  auditMiddleware,
  logCustomEvent
};
