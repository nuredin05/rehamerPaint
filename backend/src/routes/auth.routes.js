const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { generateTokens, verifyToken, refreshToken } = require('../middleware/auth.middleware');
const ResponseHelper = require('../utils/responseHelper');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: Username or email
 *         password:
 *           type: string
 *           description: User password
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             tokens:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, manager, operator, viewer]
 *         companyId:
 *           type: integer
 *         isActive:
 *           type: boolean
 *         lastLogin:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many login attempts
 */
router.post('/login', [
  body('identifier')
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.validationError(res, errors.array());
    }

    const { identifier, password } = req.body;

    // Find user by username or email
    const user = await User.findByEmailOrUsername(identifier);

    if (!user) {
      logger.logAuth('LOGIN_FAILED', null, {
        identifier,
        reason: 'USER_NOT_FOUND',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return ResponseHelper.unauthorized(res, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      logger.logAuth('LOGIN_FAILED', user.id, {
        reason: 'USER_INACTIVE',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return ResponseHelper.unauthorized(res, 'Account is inactive');
    }

    // Check if user is locked
    if (user.isLocked()) {
      logger.logAuth('LOGIN_FAILED', user.id, {
        reason: 'USER_LOCKED',
        loginAttempts: user.loginAttempts,
        lockedUntil: user.lockedUntil,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return ResponseHelper.tooManyRequests(res, 'Account temporarily locked due to too many failed attempts');
    }

    // Validate password
    console.log('DEBUG - Login attempt:', { identifier, passwordLength: password?.length });
    console.log('DEBUG - User found:', { id: user.id, email: user.email, passwordHash: user.passwordHash?.substring(0, 20) + '...' });
    
    const isValidPassword = await user.validatePassword(password);
    
    console.log('DEBUG - Password validation result:', isValidPassword);

    if (!isValidPassword) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      
      logger.logAuth('LOGIN_FAILED', user.id, {
        reason: 'INVALID_PASSWORD',
        loginAttempts: user.loginAttempts + 1,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return ResponseHelper.unauthorized(res, 'Invalid credentials');
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate tokens
    const tokens = generateTokens(user);

    // Log successful login
    logger.logAuth('LOGIN_SUCCESS', user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Return user data and tokens
    return ResponseHelper.success(res, {
      user: user.toJSON(),
      tokens
    }, 'Login successful');

  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.error(res, 'Login failed');
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Not authenticated
 */
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyToken(token);
        
        logger.logAuth('LOGOUT', decoded.id, {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
      } catch (error) {
        // Token is invalid but we still return success for logout
        logger.warn('Logout attempted with invalid token', {
          token: token.substring(0, 10) + '...',
          ip: req.ip
        });
      }
    }

    return ResponseHelper.success(res, null, 'Logout successful');
  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.error(res, 'Logout failed');
  }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseHelper.unauthorized(res, 'Access token required');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          association: 'company',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!user || !user.isActive) {
      return ResponseHelper.unauthorized(res, 'Invalid or inactive user');
    }

    return ResponseHelper.success(res, user, 'Profile retrieved successfully');
  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.error(res, 'Failed to retrieve profile');
  }
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Not authenticated or invalid current password
 *       422:
 *         description: Validation error
 */
router.post('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseHelper.validationError(res, errors.array());
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseHelper.unauthorized(res, 'Access token required');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return ResponseHelper.unauthorized(res, 'Invalid or inactive user');
    }

    const { currentPassword, newPassword } = req.body;

    // Validate current password
    const isValidPassword = await user.validatePassword(currentPassword);

    if (!isValidPassword) {
      logger.logAuth('PASSWORD_CHANGE_FAILED', user.id, {
        reason: 'INVALID_CURRENT_PASSWORD',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return ResponseHelper.unauthorized(res, 'Current password is incorrect');
    }

    // Update password
    await user.update({ passwordHash: newPassword });

    logger.logAuth('PASSWORD_CHANGED', user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return ResponseHelper.success(res, null, 'Password changed successfully');
  } catch (error) {
    logger.logError(error, req);
    return ResponseHelper.error(res, 'Failed to change password');
  }
});

module.exports = router;
