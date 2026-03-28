/**
 * Standardized response helper functions
 */

class ResponseHelper {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  static success(res, data = null, message = 'Operation successful', statusCode = 200) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString()
    };
    
    if (data !== null) {
      response.data = data;
    }
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Success response with pagination
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Success message
   */
  static successWithPagination(res, data, pagination, message = 'Data retrieved successfully') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        total: pagination.total || 0,
        totalPages: pagination.totalPages || 0,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPrevPage || false
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {Array} details - Error details
   * @param {number} statusCode - HTTP status code
   */
  static error(res, message = 'Internal server error', code = 'INTERNAL_ERROR', details = [], statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation errors
   */
  static validationError(res, errors) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.map(error => ({
          field: error.field || error.path,
          message: error.message,
          value: error.value
        }))
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Not found error response
   * @param {Object} res - Express response object
   * @param {string} message - Not found message
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Unauthorized error response
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Forbidden error response
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   */
  static forbidden(res, message = 'Access forbidden') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Conflict error response
   * @param {Object} res - Express response object
   * @param {string} message - Conflict message
   */
  static conflict(res, message = 'Resource conflict') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Bad request error response
   * @param {Object} res - Express response object
   * @param {string} message - Bad request message
   */
  static badRequest(res, message = 'Bad request') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Too many requests error response
   * @param {Object} res - Express response object
   * @param {string} message - Rate limit message
   */
  static tooManyRequests(res, message = 'Too many requests') {
    return res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message
      },
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Created response
   * @param {Object} res - Express response object
   * @param {*} data - Created data
   * @param {string} message - Created message
   */
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }
  
  /**
   * No content response
   * @param {Object} res - Express response object
   * @param {string} message - No content message
   */
  static noContent(res, message = 'Operation completed successfully') {
    return res.status(204).send();
  }
}

module.exports = ResponseHelper;
