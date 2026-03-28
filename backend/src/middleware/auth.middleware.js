const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ResponseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * JWT token generation
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Authentication middleware
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseHelper.unauthorized(res, 'Access token required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyToken(token);
      
      // Find user in database
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'companyId', 'isActive']
      });

      if (!user || !user.isActive) {
        return ResponseHelper.unauthorized(res, 'Invalid or inactive user');
      }

      // Attach user to request
      req.user = user;
      req.token = token;
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return ResponseHelper.unauthorized(res, 'Token expired');
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return ResponseHelper.unauthorized(res, 'Invalid token');
      }
      throw jwtError;
    }
  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.unauthorized(res, 'Authentication failed');
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'companyId', 'isActive']
      });

      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    } catch (jwtError) {
      // Ignore JWT errors in optional authentication
    }
    
    next();
  } catch (error) {
    // Ignore errors in optional authentication
    next();
  }
};

/**
 * Role-based authorization middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, 'Authentication required');
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      logger.logAuth('ACCESS_DENIED', req.user.id, {
        requiredRole: roles,
        userRole,
        path: req.path,
        method: req.method
      });
      
      return ResponseHelper.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

/**
 * Company access middleware - ensures user can only access their company data
 */
const requireCompanyAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, 'Authentication required');
    }

    const userCompanyId = req.user.companyId;
    
    // For admin users, allow cross-company access
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if request involves company-specific data
    const requestedCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;
    
    if (requestedCompanyId && requestedCompanyId !== userCompanyId) {
      logger.logAudit('COMPANY_ACCESS_DENIED', req.user.id, 'companies', requestedCompanyId);
      return ResponseHelper.forbidden(res, 'Access to other company data not allowed');
    }

    // Add company filter to queries
    req.companyFilter = { companyId: userCompanyId };
    
    next();
  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.error(res, 'Company access verification failed');
  }
};

/**
 * Resource ownership middleware - ensures user can only access their own resources
 */
const requireOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return ResponseHelper.unauthorized(res, 'Authentication required');
      }

      const resourceId = req.params[resourceIdParam];
      
      if (!resourceId) {
        return ResponseHelper.badRequest(res, 'Resource ID required');
      }

      const resource = await resourceModel.findByPk(resourceId);
      
      if (!resource) {
        return ResponseHelper.notFound(res, 'Resource not found');
      }

      // Check ownership or admin access
      const isOwner = resource.userId === req.user.id || resource.createdBy === req.user.id;
      const isAdmin = req.user.role === 'admin';
      const sameCompany = resource.companyId === req.user.companyId;

      if (!isOwner && !isAdmin && !sameCompany) {
        logger.logAudit('RESOURCE_ACCESS_DENIED', req.user.id, resourceModel.name, resourceId);
        return ResponseHelper.forbidden(res, 'Access to resource not allowed');
      }

      req.resource = resource;
      next();
    } catch (error) {
      logger.logError(error, req);
      return ResponseHelper.error(res, 'Resource ownership verification failed');
    }
  };
};

/**
 * Refresh token middleware
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return ResponseHelper.badRequest(res, 'Refresh token required');
    }

    try {
      const decoded = verifyToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        return ResponseHelper.unauthorized(res, 'Invalid refresh token');
      }

      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'companyId', 'isActive']
      });

      if (!user || !user.isActive) {
        return ResponseHelper.unauthorized(res, 'Invalid or inactive user');
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      logger.logAuth('TOKEN_REFRESHED', user.id);

      return ResponseHelper.success(res, tokens, 'Tokens refreshed successfully');
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return ResponseHelper.unauthorized(res, 'Refresh token expired');
      }
      throw jwtError;
    }
  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.error(res, 'Token refresh failed');
  }
};

module.exports = {
  generateTokens,
  verifyToken,
  authenticate,
  optionalAuthenticate,
  requireRole,
  requireCompanyAccess,
  requireOwnership,
  refreshToken
};
