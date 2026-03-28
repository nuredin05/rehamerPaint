const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const adminHandlers = require('../utils/adminHandlers');

const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System administration (admin only)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: companyId
 *         in: query
 *         description: Filter by company ID
 *         schema:
 *           type: integer
 *       - name: role
 *         in: query
 *         description: Filter by user role
 *         schema:
 *           type: string
 *           enum: [admin, manager, operator, viewer]
 *       - name: isActive
 *         in: query
 *         description: Filter by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('companyId').optional().isInt(),
  query('role').optional().isIn(['admin', 'manager', 'operator', 'viewer']),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    return await adminHandlers.listUsers(req, res);
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve users');
  }
});

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *               - companyId
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password
 *               firstName:
 *                 type: string
 *                 description: First name
 *               lastName:
 *                 type: string
 *                 description: Last name
 *               role:
 *                 type: string
 *                 enum: [admin, manager, operator, viewer]
 *                 description: User role
 *               companyId:
 *                 type: integer
 *                 description: Company ID
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/users', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 6 }),
  body('username').optional(),
  body('name').optional().isString(),
  body('firstName').optional(),
  body('lastName').optional(),
  body('role').optional(),
  body('companyId').optional().isInt(),
  body('status').optional(),
  body('department').optional()
], async (req, res) => {
  try {
    return await adminHandlers.createUser(req, res);
  } catch (error) {
    return ResponseHelper.error(res, error.message || 'Failed to create user');
  }
});

router.put('/users/:id', [
  param('id').isInt().withMessage('Valid user ID is required'),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    return await adminHandlers.updateUser(req, res);
  } catch (error) {
    return ResponseHelper.error(res, error.message || 'Failed to update user');
  }
});

router.delete('/users/:id', [
  param('id').isInt().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    return await adminHandlers.deleteUser(req, res);
  } catch (error) {
    return ResponseHelper.error(res, error.message || 'Failed to delete user');
  }
});

router.put('/users/:id/toggle-status', [
  param('id').isInt().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    return await adminHandlers.toggleUserStatus(req, res);
  } catch (error) {
    return ResponseHelper.error(res, error.message || 'Failed to toggle user status');
  }
});

/**
 * @swagger
 * /admin/users/{id}/activate:
 *   post:
 *     summary: Activate user account (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/users/:id/activate', [
  param('id').isInt().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement user activation logic (admin only)
    return ResponseHelper.success(res, { id }, 'User activated successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to activate user');
  }
});

/**
 * @swagger
 * /admin/users/{id}/deactivate:
 *   post:
 *     summary: Deactivate user account (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/users/:id/deactivate', [
  param('id').isInt().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement user deactivation logic (admin only)
    return ResponseHelper.success(res, { id }, 'User deactivated successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to deactivate user');
  }
});

/**
 * @swagger
 * /admin/companies:
 *   get:
 *     summary: List all companies (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/companies', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    // TODO: Implement company listing logic (admin only)
    return ResponseHelper.success(res, [], 'Companies retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve companies');
  }
});

/**
 * @swagger
 * /admin/companies:
 *   post:
 *     summary: Create a new company (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 description: Company name
 *               code:
 *                 type: string
 *                 description: Unique company code
 *               address:
 *                 type: string
 *                 description: Company address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               taxId:
 *                 type: string
 *                 description: Tax identification number
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Company'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/companies', [
  body('name').notEmpty().withMessage('Company name is required'),
  body('code').notEmpty().withMessage('Company code is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    // TODO: Implement company creation logic (admin only)
    return ResponseHelper.created(res, {}, 'Company created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create company');
  }
});

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     summary: Get system settings (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         settings:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               settingKey:
 *                                 type: string
 *                               settingValue:
 *                                 type: string
 *                               description:
 *                                 type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/settings', async (req, res) => {
  try {
    return await adminHandlers.listSettings(req, res);
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve system settings');
  }
});

router.put('/settings/:id', [
  param('id').isInt().withMessage('Valid setting ID is required'),
  body('settingValue').optional(),
  body('value').optional()
], async (req, res) => {
  try {
    return await adminHandlers.updateSettingById(req, res);
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to update setting');
  }
});

/**
 * @swagger
 * /admin/settings:
 *   put:
 *     summary: Update system settings (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 description: Key-value pairs of settings
 *     responses:
 *       200:
 *         description: System settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put('/settings', [
  body('settings').isObject().withMessage('Settings object is required')
], async (req, res) => {
  try {
    // TODO: Implement system settings update logic (admin only)
    return ResponseHelper.success(res, {}, 'System settings updated successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to update system settings');
  }
});

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Get audit logs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - name: userId
 *         in: query
 *         description: Filter by user ID
 *         schema:
 *           type: integer
 *       - name: action
 *         in: query
 *         description: Filter by action
 *         schema:
 *           type: string
 *       - name: tableName
 *         in: query
 *         description: Filter by table name
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         description: Start date filter (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date filter (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AuditLog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/audit-logs', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('userId').optional().isInt(),
  query('action').optional().isString(),
  query('tableName').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    return await adminHandlers.listAuditLogs(req, res);
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve audit logs');
  }
});

router.post('/audit-logs', async (req, res) => {
  try {
    return await adminHandlers.createAuditLog(req, res);
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create audit log');
  }
});

module.exports = router;
