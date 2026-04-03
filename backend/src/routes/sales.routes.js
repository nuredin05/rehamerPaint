const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth.middleware');
const { Customer, SalesOrder, Invoice, Sequelize, sequelize } = require('../models');

const router = express.Router();
const { Op } = Sequelize;

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales orders and customer management
 */

/**
 * @swagger
 * /sales/customers:
 *   get:
 *     summary: List all customers
 *     tags: [Sales]
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
 *         description: Customers retrieved successfully
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
 *                         $ref: '#/components/schemas/Customer'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/customers', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const where = { companyId: req.user.companyId };
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      where.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { customerCode: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ];
    }
    const rows = await Customer.findAll({
      where,
      order: [['name', 'ASC']],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
    });
    const data = rows.map((c) => {
      const j = c.toJSON();
      return {
        id: j.id,
        name: j.name,
        email: j.email || '',
        phone: j.phone || '',
        orders: 0,
        totalSpent: 0,
        status: j.isActive ? 'active' : 'inactive',
        customerCode: j.customerCode,
      };
    });
    return ResponseHelper.success(res, data, 'Customers retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve customers');
  }
});

/**
 * @swagger
 * /sales/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Sales]
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
 *               - customerCode
 *             properties:
 *               customerCode:
 *                 type: string
 *                 description: Unique customer code
 *               name:
 *                 type: string
 *                 description: Customer name
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
 *               creditLimit:
 *                 type: number
 *                 description: Credit limit
 *               taxId:
 *                 type: string
 *                 description: Tax identification number
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Customer'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/customers', [
  body('name').notEmpty().withMessage('Customer name is required'),
  // UI currently creates customers without customerCode; we generate it server-side.
  body('customerCode').optional().isString().withMessage('customerCode must be a string'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      name,
      customerCode: requestedCode,
      contactPerson,
      email,
      phone,
      address,
      paymentTerms,
      creditLimit,
      taxId,
    } = req.body;

    if (!name) {
      return ResponseHelper.badRequest(res, 'Customer name is required', 'VALIDATION_ERROR');
    }

    const customerCode =
      requestedCode && String(requestedCode).trim()
        ? String(requestedCode).trim()
        : `CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const creditLimitValue =
      creditLimit !== undefined && creditLimit !== null && creditLimit !== ''
        ? parseFloat(creditLimit)
        : 0;

    const created = await Customer.create({
      companyId,
      customerCode,
      name: String(name).trim(),
      contactPerson: contactPerson || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      paymentTerms: paymentTerms || null,
      creditLimit: Number.isFinite(creditLimitValue) ? creditLimitValue : 0,
      taxId: taxId || null,
      isActive: true,
    });

    return ResponseHelper.created(res, created, 'Customer created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create customer');
  }
});

/**
 * @swagger
 * /sales/sales-orders:
 *   get:
 *     summary: List sales orders
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: customerId
 *         in: query
 *         description: Filter by customer ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by order status
 *         schema:
 *           type: string
 *           enum: [draft, confirmed, in_production, ready, shipped, delivered, cancelled]
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
 *         description: Sales orders retrieved successfully
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
 *                         $ref: '#/components/schemas/SalesOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/sales-orders', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('customerId').optional().isInt(),
  query('status').optional().isIn(['draft', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const where = { companyId: req.user.companyId };
    if (req.query.customerId) where.customerId = parseInt(req.query.customerId, 10);
    if (req.query.status) where.status = req.query.status;

    const rows = await SalesOrder.findAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
      ],
      order: [['orderDate', 'DESC']],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
    });

    const data = rows.map((o) => {
      const j = o.toJSON();
      return {
        id: j.orderNumber || `SO-${j.id}`,
        customer: j.customer?.name || '—',
        product: '—',
        quantity: 0,
        amount: parseFloat(j.netAmount || j.totalAmount || 0),
        date: j.orderDate,
        status: j.status,
        deliveryDate: j.deliveryDate,
      };
    });

    return ResponseHelper.success(res, data, 'Sales orders retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve sales orders');
  }
});

/**
 * @swagger
 * /sales/sales-orders:
 *   post:
 *     summary: Create a new sales order
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - orderDate
 *               - deliveryDate
 *               - items
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: Customer ID
 *               orderDate:
 *                 type: string
 *                 format: date
 *                 description: Order date
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Requested delivery date
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
 *         description: Sales order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SalesOrder'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/sales-orders', [
  // UI creates orders in a simplified shape (customer name + product/quantity/amount).
  // We resolve/compute missing parts server-side.
  body('customerId').optional().isInt().withMessage('customerId must be an integer'),
  body('customer').optional().isString().withMessage('customer must be a string'),
  body('orderDate').optional().isISO8601().withMessage('orderDate must be a date'),
  body('deliveryDate').optional().isISO8601().withMessage('deliveryDate must be a date'),
  body('items').optional().isArray().withMessage('items must be an array'),
  body('amount').optional().isFloat().withMessage('amount must be a number'),
  body('quantity').optional().isFloat().withMessage('quantity must be a number'),
  body('product').optional().isString().withMessage('product must be a string'),
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      customerId: requestedCustomerId,
      customer: customerName,
      deliveryDate,
      orderDate,
      amount,
      // The UI also collects product/quantity; we store totals but do not persist order items
      product,
      quantity,
    } = req.body;

    let resolvedCustomerId = null;
    if (requestedCustomerId) {
      const cust = await Customer.findOne({
        where: { id: parseInt(requestedCustomerId, 10), companyId },
      });
      resolvedCustomerId = cust?.id ?? null;
    } else if (customerName) {
      const cust = await Customer.findOne({
        where: { name: String(customerName), companyId },
      });
      resolvedCustomerId = cust?.id ?? null;
    }

    if (!resolvedCustomerId) {
      return ResponseHelper.badRequest(res, 'Customer is required for sales order', 'MISSING_CUSTOMER');
    }

    const orderDateValue = orderDate
      ? String(orderDate)
      : new Date().toISOString().slice(0, 10);

    const deliveryDateValue = deliveryDate ? String(deliveryDate) : null;

    const amountValue =
      amount !== undefined && amount !== null && amount !== '' ? parseFloat(amount) : null;
    const totalAmount = amountValue !== null && Number.isFinite(amountValue) ? amountValue : 0;

    // Generate unique order number (order_number is unique).
    const orderNumber = `SO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const created = await SalesOrder.create({
      companyId,
      customerId: resolvedCustomerId,
      orderNumber,
      orderDate: orderDateValue,
      deliveryDate: deliveryDateValue,
      status: 'draft',
      totalAmount,
      taxAmount: 0,
      discountAmount: 0,
      netAmount: totalAmount,
      notes: `Created from UI. product=${product || '—'}, quantity=${quantity ?? '—'}`,
      createdBy: req.user.id,
    });

    return ResponseHelper.created(res, created, 'Sales order created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create sales order');
  }
});

/**
 * @swagger
 * /sales/sales-orders/{id}/confirm:
 *   post:
 *     summary: Confirm sales order
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Sales order confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SalesOrder'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/sales-orders/:id/confirm', [
  param('id').isInt().withMessage('Valid sales order ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement sales order confirmation logic
    return ResponseHelper.success(res, { id }, 'Sales order confirmed successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to confirm sales order');
  }
});

/**
 * @swagger
 * /sales/invoices:
 *   get:
 *     summary: List sales invoices
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - name: customerId
 *         in: query
 *         description: Filter by customer ID
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by invoice status
 *         schema:
 *           type: string
 *           enum: [draft, sent, paid, overdue, cancelled]
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
 *         description: Invoices retrieved successfully
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
 *                         $ref: '#/components/schemas/Invoice'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/invoices', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('customerId').optional().isInt(),
  query('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const where = {
      companyId: req.user.companyId,
      invoiceType: 'sales',
    };
    if (req.query.customerId) where.customerId = parseInt(req.query.customerId, 10);
    if (req.query.status) where.status = req.query.status;

    const rows = await Invoice.findAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
      order: [['invoiceDate', 'DESC']],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
    });

    const data = rows.map((inv) => {
      const j = inv.toJSON();
      return {
        id: j.invoiceNumber || `INV-${j.id}`,
        customer: j.customer?.name || '—',
        amount: parseFloat(j.totalAmount || 0),
        date: j.invoiceDate,
        status: j.status,
        dueDate: j.dueDate,
      };
    });

    return ResponseHelper.success(res, data, 'Invoices retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve invoices');
  }
});

/**
 * @swagger
 * /sales/invoices/{id}/send:
 *   post:
 *     summary: Send invoice to customer
 *     tags: [Sales]
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
 *               email:
 *                 type: string
 *                 description: Email address to send invoice to
 *               message:
 *                 type: string
 *                 description: Custom message to include
 *     responses:
 *       200:
 *         description: Invoice sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/invoices/:id/send', [
  param('id').isInt().withMessage('Valid invoice ID is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement invoice sending logic
    return ResponseHelper.success(res, { id }, 'Invoice sent successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to send invoice');
  }
});

/**
 * @swagger
 * /sales/invoices:
 *   post:
 *     summary: Create a new sales invoice (UI simplified)
 */
router.post('/invoices', [
  body('customerId').optional().isInt().withMessage('customerId must be an integer'),
  body('customer').optional().isString().withMessage('customer must be a string'),
  body('amount').isFloat({ min: 0 }).withMessage('amount must be a non-negative number'),
  body('dueDate').isISO8601().withMessage('dueDate must be a valid date'),
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { customerId: requestedCustomerId, customer, amount, dueDate } = req.body;

    let resolvedCustomerId = null;
    if (requestedCustomerId) {
      const cust = await Customer.findOne({
        where: { id: parseInt(requestedCustomerId, 10), companyId },
      });
      resolvedCustomerId = cust?.id ?? null;
    } else if (customer) {
      const cust = await Customer.findOne({
        where: { name: String(customer), companyId },
      });
      resolvedCustomerId = cust?.id ?? null;
    }

    if (!resolvedCustomerId) {
      return ResponseHelper.badRequest(res, 'Customer is required for invoice creation', 'MISSING_CUSTOMER');
    }

    const amountValue = parseFloat(amount);
    if (!Number.isFinite(amountValue)) {
      return ResponseHelper.badRequest(res, 'Invalid amount', 'VALIDATION_ERROR');
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const today = new Date().toISOString().slice(0, 10);

    const created = await Invoice.create({
      companyId,
      invoiceNumber,
      customerId: resolvedCustomerId,
      invoiceType: 'sales',
      invoiceDate: today,
      dueDate: String(dueDate),
      status: 'draft',
      subtotal: amountValue,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: amountValue,
      paidAmount: 0,
      balanceAmount: amountValue,
      notes: null,
      createdBy: req.user.id,
    });

    return ResponseHelper.created(res, created, 'Invoice created successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create invoice');
  }
});

module.exports = router;
