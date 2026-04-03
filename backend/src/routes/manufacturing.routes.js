const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Manufacturing
 *   description: Production planning and manufacturing
 */

/**
 * @swagger
 * /manufacturing/bom:
 *   get:
 *     summary: List all Bills of Materials (BOM)
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: productId
 *         in: query
 *         description: Filter by finished product ID
 *         schema:
 *           type: integer
 *       - name: isActive
 *         in: query
 *         description: Filter by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: BOMs retrieved successfully
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
 *                         $ref: '#/components/schemas/BillOfMaterials'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/bom', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('productId').optional().isInt(),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    // TODO: Implement BOM listing logic
    return ResponseHelper.success(res, [], 'BOMs retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve BOMs');
  }
});

/**
 * @swagger
 * /manufacturing/bom:
 *   post:
 *     summary: Create a new Bill of Materials
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - finishedProductId
 *               - version
 *               - effectiveDate
 *               - components
 *             properties:
 *               finishedProductId:
 *                 type: integer
 *                 description: Finished product ID
 *               version:
 *                 type: string
 *                 description: BOM version
 *               effectiveDate:
 *                 type: string
 *                 format: date
 *                 description: Effective date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry date
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - rawMaterialId
 *                     - quantity
 *                   properties:
 *                     rawMaterialId:
 *                       type: integer
 *                       description: Raw material ID
 *                     quantity:
 *                       type: number
 *                       description: Required quantity
 *                     unitCost:
 *                       type: number
 *                       description: Unit cost
 *                     scrapPercentage:
 *                       type: number
 *                       description: Scrap percentage
 *     responses:
 *       201:
 *         description: BOM created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BillOfMaterials'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/bom', [
  // UI currently creates BOMs with only `product`; we allow simplified payloads here.
  body('finishedProductId').optional().isInt(),
  body('version').optional().isString(),
  body('effectiveDate').optional().isISO8601(),
  body('components').optional().isArray(),
], async (req, res) => {
  try {
    // TODO: Implement BOM creation logic
    return ResponseHelper.created(res, {}, 'BOM created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create BOM');
  }
});

/**
 * @swagger
 * /manufacturing/production-orders:
 *   get:
 *     summary: List production orders
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: productId
 *         in: query
 *         description: Filter by product ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by status
 *         schema:
 *           type: string
 *           enum: [planned, released, in_progress, completed, cancelled]
 *       - name: priority
 *         in: query
 *         description: Filter by priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
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
 *         description: Production orders retrieved successfully
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
 *                         $ref: '#/components/schemas/ProductionOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/production-orders', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('productId').optional().isInt(),
  query('status').optional().isIn(['planned', 'released', 'in_progress', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    // TODO: Implement production order listing logic
    return ResponseHelper.success(res, [], 'Production orders retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve production orders');
  }
});

/**
 * @swagger
 * /manufacturing/production-orders:
 *   post:
 *     summary: Create a new production order
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - bomId
 *               - plannedQuantity
 *               - startDate
 *               - completionDate
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: Product ID
 *               bomId:
 *                 type: integer
 *                 description: BOM ID
 *               plannedQuantity:
 *                 type: number
 *                 description: Planned quantity
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *                 description: Priority level
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Planned start date
 *               completionDate:
 *                 type: string
 *                 format: date
 *                 description: Planned completion date
 *               notes:
 *                 type: string
 *                 description: Order notes
 *     responses:
 *       201:
 *         description: Production order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductionOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/production-orders', [
  // UI currently creates production orders with `product`, `quantity`, `startDate`, `endDate`.
  // We allow simplified payloads here and let the backend fill defaults when implemented.
  body('productId').optional().isInt(),
  body('bomId').optional().isInt(),
  body('plannedQuantity').optional().isFloat(),
  body('startDate').optional().isISO8601(),
  body('completionDate').optional().isISO8601(),
], async (req, res) => {
  try {
    // TODO: Implement production order creation logic
    return ResponseHelper.created(res, {}, 'Production order created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create production order');
  }
});

/**
 * @swagger
 * /manufacturing/production-orders/{id}/release:
 *   post:
 *     summary: Release production order
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Production order released successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductionOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/production-orders/:id/release', [
  param('id').isInt().withMessage('Valid production order ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement production order release logic
    return ResponseHelper.success(res, { id }, 'Production order released successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to release production order');
  }
});

/**
 * @swagger
 * /manufacturing/production-orders/{id}/start:
 *   post:
 *     summary: Start production order
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Production order started successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductionOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/production-orders/:id/start', [
  param('id').isInt().withMessage('Valid production order ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement production order start logic
    return ResponseHelper.success(res, { id }, 'Production order started successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to start production order');
  }
});

/**
 * @swagger
 * /manufacturing/production-orders/{id}/complete:
 *   post:
 *     summary: Complete production order
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualQuantity:
 *                 type: number
 *                 description: Actual produced quantity
 *               notes:
 *                 type: string
 *                 description: Completion notes
 *     responses:
 *       200:
 *         description: Production order completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductionOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/production-orders/:id/complete', [
  param('id').isInt().withMessage('Valid production order ID is required'),
  body('actualQuantity').optional().isFloat()
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement production order completion logic
    return ResponseHelper.success(res, { id }, 'Production order completed successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to complete production order');
  }
});

/**
 * @swagger
 * /manufacturing/batches:
 *   get:
 *     summary: List production batches
 *     tags: [Manufacturing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - name: productionOrderId
 *         in: query
 *         description: Filter by production order ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by batch status
 *         schema:
 *           type: string
 *           enum: [mixed, quality_check, approved, rejected]
 *       - name: productionDate
 *         in: query
 *         description: Production date filter (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Production batches retrieved successfully
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
 *                         $ref: '#/components/schemas/ProductionBatch'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/batches', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('productionOrderId').optional().isInt(),
  query('status').optional().isIn(['mixed', 'quality_check', 'approved', 'rejected']),
  query('productionDate').optional().isISO8601()
], async (req, res) => {
  try {
    // TODO: Implement batch listing logic
    return ResponseHelper.success(res, [], 'Production batches retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve production batches');
  }
});

module.exports = router;
