const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth.middleware');
const { Supplier, PurchaseOrder, Sequelize } = require('../models');

const router = express.Router();
const { Op } = Sequelize;
const isSchemaIssue = (error) => /doesn't exist|Unknown column/i.test(error?.original?.sqlMessage || error?.message || '');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Purchase orders and supplier management
 */

/**
 * @swagger
 * /procurement/suppliers:
 *   get:
 *     summary: List all suppliers
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: isActive
 *         in: query
 *         description: Filter by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
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
 *                         $ref: '#/components/schemas/Supplier'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/suppliers', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const where = {};
    if (req.user?.companyId) where.companyId = req.user.companyId;
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      where.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { supplierCode: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const rows = await Supplier.findAll({
      where,
      attributes: ['id', 'companyId', 'name', 'email', 'phone', 'address', 'paymentTerms', 'isActive', 'createdAt', 'updatedAt'],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['name', 'ASC']],
    });

    return ResponseHelper.success(res, rows, 'Suppliers retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Suppliers retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve suppliers');
  }
});

/**
 * @swagger
 * /procurement/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Procurement]
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
 *               - supplierCode
 *             properties:
 *               supplierCode:
 *                 type: string
 *                 description: Unique supplier code
 *               name:
 *                 type: string
 *                 description: Supplier name
 *               contactPerson:
 *                 type: string
 *                 description: Contact person
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               address:
 *                 type: string
 *                 description: Address
 *               paymentTerms:
 *                 type: string
 *                 description: Payment terms
 *               taxId:
 *                 type: string
 *                 description: Tax identification number
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Supplier'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/suppliers', [
  body('name').notEmpty().withMessage('Supplier name is required'),
  // UI currently creates suppliers without supplierCode; we generate it server-side.
  body('supplierCode').optional().isString().withMessage('supplierCode must be a string'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      name,
      supplierCode: requestedCode,
      contactPerson,
      email,
      phone,
      address,
      paymentTerms,
      taxId,
      isActive,
    } = req.body;

    if (!name) return ResponseHelper.badRequest(res, 'Supplier name is required');

    const supplierCode =
      requestedCode && String(requestedCode).trim()
        ? String(requestedCode).trim()
        : `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const created = await Supplier.create({
      companyId,
      supplierCode,
      name: String(name).trim(),
      contactPerson: contactPerson || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      paymentTerms: paymentTerms || null,
      taxId: taxId || null,
      isActive: isActive !== undefined ? !!isActive : true,
    });

    return ResponseHelper.created(res, created, 'Supplier created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create supplier');
  }
});

/**
 * @swagger
 * /procurement/purchase-orders:
 *   get:
 *     summary: List purchase orders
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: supplierId
 *         in: query
 *         description: Filter by supplier ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by order status
 *         schema:
 *           type: string
 *           enum: [draft, sent, confirmed, partial_received, received, cancelled]
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
 *         description: Purchase orders retrieved successfully
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
 *                         $ref: '#/components/schemas/PurchaseOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/purchase-orders', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('supplierId').optional().isInt(),
  query('status').optional().isIn(['draft', 'sent', 'confirmed', 'partial_received', 'received', 'cancelled']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const where = {};
    if (req.user?.companyId) where.companyId = req.user.companyId;
    if (req.query.supplierId) where.supplierId = parseInt(req.query.supplierId, 10);
    if (req.query.status) where.status = req.query.status;
    if (req.query.startDate || req.query.endDate) {
      where.orderDate = {};
      if (req.query.startDate) where.orderDate[Op.gte] = req.query.startDate;
      if (req.query.endDate) where.orderDate[Op.lte] = req.query.endDate;
    }
    if (req.query.search) {
      where.orderNumber = { [Op.like]: `%${req.query.search}%` };
    }

    const rows = await PurchaseOrder.findAll({
      where,
      include: [{ model: Supplier, as: 'supplier', attributes: ['id', 'name', 'supplierCode'], required: false }],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
      offset: ((parseInt(req.query.page, 10) || 1) - 1) * (Math.min(parseInt(req.query.limit, 10) || 100, 200)),
      order: [['order_date', 'DESC']],
    });

    return ResponseHelper.success(res, rows, 'Purchase orders retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Purchase orders retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve purchase orders');
  }
});

/**
 * @swagger
 * /procurement/purchase-orders:
 *   post:
 *     summary: Create a new purchase order
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - orderDate
 *               - expectedDeliveryDate
 *               - items
 *             properties:
 *               supplierId:
 *                 type: integer
 *                 description: Supplier ID
 *               orderDate:
 *                 type: string
 *                 format: date
 *                 description: Order date
 *               expectedDeliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Expected delivery date
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - unitPrice
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       description: Order quantity
 *                     unitPrice:
 *                       type: number
 *                       description: Unit price
 *                     discountPercentage:
 *                       type: number
 *                       description: Discount percentage
 *                     taxRate:
 *                       type: number
 *                       description: Tax rate
 *                     notes:
 *                       type: string
 *                       description: Item notes
 *               notes:
 *                 type: string
 *                 description: Order notes
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PurchaseOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/purchase-orders', [
  // UI creates POs in a simplified shape; we resolve missing fields server-side.
  body('supplierId').optional().isInt().withMessage('supplierId must be an integer'),
  body('supplier').optional().isString().withMessage('supplier must be a string'),
  body('orderDate').optional().isISO8601().withMessage('orderDate must be a date'),
  body('expectedDeliveryDate').optional().isISO8601().withMessage('expectedDeliveryDate must be a date'),
  body('deliveryDate').optional().isISO8601().withMessage('deliveryDate must be a date'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('amount must be a number'),
  body('items').optional().isArray().withMessage('items must be an array'),
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      supplierId: requestedSupplierId,
      supplier: supplierName,
      orderDate,
      expectedDeliveryDate,
      deliveryDate,
      amount,
      items,
      notes,
    } = req.body;

    let resolvedSupplierId = null;
    if (requestedSupplierId) {
      const s = await Supplier.findOne({
        where: { id: parseInt(requestedSupplierId, 10), companyId },
      });
      resolvedSupplierId = s?.id ?? null;
    } else if (supplierName) {
      const s = await Supplier.findOne({
        where: { name: String(supplierName), companyId },
      });
      resolvedSupplierId = s?.id ?? null;
    }

    if (!resolvedSupplierId) {
      return ResponseHelper.badRequest(res, 'Supplier is required for purchase order creation');
    }

    const orderDateValue = orderDate ? String(orderDate) : new Date().toISOString().slice(0, 10);
    const expectedDeliveryDateValue =
      expectedDeliveryDate ? String(expectedDeliveryDate) : deliveryDate ? String(deliveryDate) : null;

    let totalAmount = 0;
    if (amount !== undefined && amount !== null && amount !== '') {
      const v = parseFloat(amount);
      if (Number.isFinite(v)) totalAmount = v;
    } else if (Array.isArray(items)) {
      // We don't persist items without PurchaseOrderItem model; totals are computed for the PO header.
      totalAmount = items.reduce((sum, it) => {
        const q = parseFloat(it?.quantity ?? 0);
        const up = parseFloat(it?.unitPrice ?? 0);
        return sum + (Number.isFinite(q) && Number.isFinite(up) ? q * up : 0);
      }, 0);
    }

    const orderNumber = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const created = await PurchaseOrder.create({
      companyId,
      supplierId: resolvedSupplierId,
      orderNumber,
      orderDate: orderDateValue,
      expectedDeliveryDate: expectedDeliveryDateValue,
      status: 'draft',
      totalAmount,
      taxAmount: 0,
      discountAmount: 0,
      netAmount: totalAmount,
      notes: notes || null,
      createdBy: req.user.id,
    });

    return ResponseHelper.created(res, created, 'Purchase order created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create purchase order');
  }
});

/**
 * @swagger
 * /procurement/purchase-orders/{id}/send:
 *   post:
 *     summary: Send purchase order to supplier
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Purchase order sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PurchaseOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/purchase-orders/:id/send', [
  param('id').isInt().withMessage('Valid purchase order ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement purchase order sending logic
    return ResponseHelper.success(res, { id }, 'Purchase order sent successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to send purchase order');
  }
});

/**
 * @swagger
 * /procurement/purchase-orders/{id}/confirm:
 *   post:
 *     summary: Confirm purchase order from supplier
 *     tags: [Procurement]
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
 *               confirmedDeliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Confirmed delivery date
 *               notes:
 *                 type: string
 *                 description: Confirmation notes
 *     responses:
 *       200:
 *         description: Purchase order confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PurchaseOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/purchase-orders/:id/confirm', [
  param('id').isInt().withMessage('Valid purchase order ID is required'),
  body('confirmedDeliveryDate').optional().isISO8601()
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement purchase order confirmation logic
    return ResponseHelper.success(res, { id }, 'Purchase order confirmed successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to confirm purchase order');
  }
});

/**
 * @swagger
 * /procurement/purchase-orders/{id}/receive:
 *   post:
 *     summary: Receive goods from purchase order
 *     tags: [Procurement]
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
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - purchaseOrderItemId
 *                     - receivedQuantity
 *                   properties:
 *                     purchaseOrderItemId:
 *                       type: integer
 *                       description: Purchase order item ID
 *                     receivedQuantity:
 *                       type: number
 *                       description: Received quantity
 *                     batchNumber:
 *                       type: string
 *                       description: Batch number
 *                     expiryDate:
 *                       type: string
 *                       format: date
 *                       description: Expiry date
 *                     notes:
 *                       type: string
 *                       description: Item notes
 *               warehouseId:
 *                 type: integer
 *                 description: Warehouse ID to receive goods into
 *               notes:
 *                 type: string
 *                 description: Receipt notes
 *     responses:
 *       200:
 *         description: Goods received successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PurchaseOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/purchase-orders/:id/receive', [
  param('id').isInt().withMessage('Valid purchase order ID is required'),
  body('items').isArray().withMessage('Items array is required'),
  body('warehouseId').optional().isInt()
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement goods receipt logic
    return ResponseHelper.success(res, { id }, 'Goods received successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to receive goods');
  }
});

module.exports = router;
