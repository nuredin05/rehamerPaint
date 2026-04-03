const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth.middleware');
const { Vehicle, DeliveryOrder, SalesOrder, Sequelize } = require('../models');

const router = express.Router();
const { Op } = Sequelize;
const isSchemaIssue = (error) => /doesn't exist|Unknown column/i.test(error?.original?.sqlMessage || error?.message || '');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Logistics
 *   description: Delivery and transportation management
 */

/**
 * @swagger
 * /logistics/vehicles:
 *   get:
 *     summary: List all vehicles
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: vehicleType
 *         in: query
 *         description: Filter by vehicle type
 *         schema:
 *           type: string
 *           enum: [truck, van, motorcycle]
 *       - name: isActive
 *         in: query
 *         description: Filter by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
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
 *                         $ref: '#/components/schemas/Vehicle'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/vehicles', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('vehicleType').optional().isIn(['truck', 'van', 'motorcycle']),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const where = {};
    if (req.user?.companyId) where.companyId = req.user.companyId;
    if (req.query.vehicleType) where.vehicleType = req.query.vehicleType;
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      where.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      where[Op.or] = [
        { vehicleNumber: { [Op.like]: `%${req.query.search}%` } },
        { driverName: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const rows = await Vehicle.findAll({
      where,
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['vehicle_number', 'ASC']],
    });

    return ResponseHelper.success(res, rows, 'Vehicles retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Vehicles retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve vehicles');
  }
});

/**
 * @swagger
 * /logistics/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleNumber
 *               - vehicleType
 *             properties:
 *               vehicleNumber:
 *                 type: string
 *                 description: Unique vehicle number
 *               vehicleType:
 *                 type: string
 *                 enum: [truck, van, motorcycle]
 *                 description: Vehicle type
 *               capacity:
 *                 type: number
 *                 description: Vehicle capacity
 *               driverName:
 *                 type: string
 *                 description: Driver name
 *               driverPhone:
 *                 type: string
 *                 description: Driver phone number
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vehicle'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/vehicles', [
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleType').isIn(['truck', 'van', 'motorcycle']).withMessage('Valid vehicle type is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const vehicleNumber = String(req.body.vehicleNumber).trim();
    const vehicleType = req.body.vehicleType;
    const capacity = req.body.capacity !== undefined && req.body.capacity !== null && req.body.capacity !== ''
      ? parseFloat(req.body.capacity)
      : null;

    const created = await Vehicle.create({
      companyId,
      vehicleNumber,
      vehicleType,
      capacity: Number.isFinite(capacity) ? capacity : null,
      driverName: req.body.driverName ? String(req.body.driverName).trim() : null,
      driverPhone: req.body.driverPhone ? String(req.body.driverPhone).trim() : null,
      isActive: req.body.status
        ? req.body.status === 'active' || req.body.status === true || req.body.status === 1
        : true
    });

    return ResponseHelper.created(res, created, 'Vehicle created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create vehicle');
  }
});

/**
 * @swagger
 * /logistics/delivery-orders:
 *   get:
 *     summary: List delivery orders
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: salesOrderId
 *         in: query
 *         description: Filter by sales order ID
 *         schema:
 *           type: integer
 *       - name: vehicleId
 *         in: query
 *         description: Filter by vehicle ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by delivery status
 *         schema:
 *           type: string
 *           enum: [planned, in_transit, delivered, cancelled]
 *       - name: deliveryDate
 *         in: query
 *         description: Delivery date filter (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Delivery orders retrieved successfully
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
 *                         $ref: '#/components/schemas/DeliveryOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/delivery-orders', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('salesOrderId').optional().isInt(),
  query('vehicleId').optional().isInt(),
  query('status').optional().isIn(['planned', 'in_transit', 'delivered', 'cancelled']),
  query('deliveryDate').optional().isISO8601()
], async (req, res) => {
  try {
    const where = {};
    if (req.user?.companyId) where.companyId = req.user.companyId;
    if (req.query.salesOrderId) where.salesOrderId = parseInt(req.query.salesOrderId, 10);
    if (req.query.vehicleId) where.vehicleId = parseInt(req.query.vehicleId, 10);
    if (req.query.status) where.status = req.query.status;
    if (req.query.deliveryDate) where.deliveryDate = req.query.deliveryDate;

    const rows = await DeliveryOrder.findAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'vehicleNumber', 'vehicleType'], required: false },
        { model: SalesOrder, as: 'salesOrder', attributes: ['id', 'orderNumber', 'status'], required: false },
      ],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['delivery_date', 'DESC']],
    });

    return ResponseHelper.success(res, rows, 'Delivery orders retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Delivery orders retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve delivery orders');
  }
});

/**
 * @swagger
 * /logistics/delivery-orders:
 *   post:
 *     summary: Create a new delivery order
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salesOrderId
 *               - deliveryDate
 *             properties:
 *               salesOrderId:
 *                 type: integer
 *                 description: Sales order ID
 *               vehicleId:
 *                 type: integer
 *                 description: Vehicle ID
 *               driverName:
 *                 type: string
 *                 description: Driver name
 *               driverPhone:
 *                 type: string
 *                 description: Driver phone number
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Delivery date
 *               notes:
 *                 type: string
 *                 description: Delivery notes
 *     responses:
 *       201:
 *         description: Delivery order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DeliveryOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/delivery-orders', [
  // UI uses a simplified payload (order string + deliveryDate). For now we relax validation.
  body('salesOrderId').optional().isInt().withMessage('salesOrderId must be an integer'),
  body('deliveryDate').optional().isISO8601().withMessage('Valid delivery date is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const createdBy = req.user.id;

    // UI sends: { order, customer, address, driver, vehicle, deliveryDate }
    // Backend DB model requires: salesOrderId + vehicleId.
    const order = req.body.order ? String(req.body.order).trim() : null;
    const driverName = req.body.driver ? String(req.body.driver).trim() : null;
    const driverPhone = req.body.driverPhone ? String(req.body.driverPhone).trim() : null;

    const vehicleIdRaw = req.body.vehicle !== undefined && req.body.vehicle !== null ? req.body.vehicle : null;
    const vehicleId = vehicleIdRaw !== null ? parseInt(vehicleIdRaw, 10) : null;

    let salesOrderId = req.body.salesOrderId !== undefined && req.body.salesOrderId !== null
      ? parseInt(req.body.salesOrderId, 10)
      : null;

    if (!salesOrderId && order) {
      // Try to match by SalesOrder.orderNumber (often like "SO-...").
      const exact = await SalesOrder.findOne({ where: { companyId, orderNumber: order } });
      salesOrderId = exact ? exact.id : null;

      if (!salesOrderId) {
        const partial = await SalesOrder.findOne({
          where: {
            companyId,
            orderNumber: { [Op.like]: `%${order}%` }
          }
        });
        salesOrderId = partial ? partial.id : null;
      }

      // Fallback: if the order looks like "SO-123" or just "123", try SalesOrder.id.
      if (!salesOrderId) {
        const m = String(order).match(/^SO-(\d+)$|^(\d+)$/);
        const idCandidate = m ? parseInt(m[1] || m[2], 10) : null;
        if (idCandidate && Number.isFinite(idCandidate)) {
          const byId = await SalesOrder.findOne({ where: { companyId, id: idCandidate } });
          salesOrderId = byId ? byId.id : null;
        }
      }
    }

    if (!salesOrderId || !Number.isFinite(salesOrderId)) {
      return ResponseHelper.badRequest(res, 'Valid salesOrderId is required (or provide an existing orderNumber in "order")');
    }

    if (!vehicleId || !Number.isFinite(vehicleId)) {
      return ResponseHelper.badRequest(res, 'Valid vehicleId is required');
    }

    const deliveryDate = req.body.deliveryDate ? String(req.body.deliveryDate) : new Date().toISOString().slice(0, 10);
    const deliveryNumber = `DEL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const created = await DeliveryOrder.create({
      companyId,
      deliveryNumber,
      salesOrderId,
      vehicleId,
      driverName,
      driverPhone,
      deliveryDate,
      status: 'planned',
      notes: req.body.notes ? String(req.body.notes) : null,
      createdBy
    });

    return ResponseHelper.created(res, created, 'Delivery order created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create delivery order');
  }
});

/**
 * @swagger
 * /logistics/delivery-orders/{id}/dispatch:
 *   post:
 *     summary: Dispatch delivery order
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Delivery order dispatched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DeliveryOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/delivery-orders/:id/dispatch', [
  param('id').isInt().withMessage('Valid delivery order ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement delivery order dispatch logic
    return ResponseHelper.success(res, { id }, 'Delivery order dispatched successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to dispatch delivery order');
  }
});

/**
 * @swagger
 * /logistics/delivery-orders/{id}/tracking:
 *   get:
 *     summary: Get delivery tracking information
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Tracking information retrieved successfully
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
 *                         deliveryOrder:
 *                           $ref: '#/components/schemas/DeliveryOrder'
 *                         trackingHistory:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               location:
 *                                 type: string
 *                               status:
 *                                 type: string
 *                               timestamp:
 *                                 type: string
 *                                 format: date-time
 *                               notes:
 *                                 type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/delivery-orders/:id/tracking', [
  param('id').isInt().withMessage('Valid delivery order ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement delivery tracking logic
    return ResponseHelper.success(res, {
      deliveryOrder: { id },
      trackingHistory: []
    }, 'Tracking information retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve tracking information');
  }
});

/**
 * @swagger
 * /logistics/delivery-orders/{id}/tracking:
 *   post:
 *     summary: Add tracking update
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - status
 *             properties:
 *               location:
 *                 type: string
 *                 description: Current location
 *               status:
 *                 type: string
 *                 enum: [picked_up, in_transit, arrived, delivered]
 *                 description: Tracking status
 *               notes:
 *                 type: string
 *                 description: Tracking notes
 *     responses:
 *       201:
 *         description: Tracking update added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DeliveryTracking'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/delivery-orders/:id/tracking', [
  param('id').isInt().withMessage('Valid delivery order ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('status').isIn(['picked_up', 'in_transit', 'arrived', 'delivered']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement tracking update logic
    return ResponseHelper.created(res, { deliveryOrderId: id }, 'Tracking update added successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to add tracking update');
  }
});

module.exports = router;
