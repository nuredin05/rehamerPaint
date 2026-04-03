const express = require('express');
const { body, query, param } = require('express-validator');
const ResponseHelper = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth.middleware');
const { Product, InventoryStock, InventoryTransaction, User, Sequelize, sequelize, Category, Unit, Warehouse } = require('../models');

const router = express.Router();
const { Op } = Sequelize;
const isSchemaIssue = (error) => /doesn't exist|Unknown column/i.test(error?.original?.sqlMessage || error?.message || '');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory and stock management
 */

/**
 * @swagger
 * /inventory/products:
 *   get:
 *     summary: List all products
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: categoryId
 *         in: query
 *         description: Filter by category ID
 *         schema:
 *           type: integer
 *       - name: productType
 *         in: query
 *         description: Filter by product type
 *         schema:
 *           type: string
 *           enum: [raw_material, finished_good, semi_finished]
 *       - name: isActive
 *         in: query
 *         description: Filter by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                         $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/products', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isAlpha(),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
  query('categoryId').optional().isInt(),
  query('productType').optional().isIn(['raw_material', 'finished_good', 'semi_finished']),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const where = { companyId: req.user.companyId };
    if (req.query.categoryId) where.categoryId = parseInt(req.query.categoryId, 10);
    if (req.query.productType) where.productType = req.query.productType;
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      where.isActive = req.query.isActive === 'true' || req.query.isActive === true;
    }
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { sku: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: InventoryStock,
          as: 'inventoryStocks',
          required: false,
        },
      ],
      order: [['name', 'ASC']],
    });

    const data = products.map((p) => {
      const j = p.toJSON();
      const stock = (j.inventoryStocks || []).reduce(
        (sum, row) => sum + parseFloat(row.quantity || 0),
        0
      );
      const reorder = parseFloat(j.reorderLevel || 0);
      let status = 'in-stock';
      if (stock <= 0) status = 'out-of-stock';
      else if (reorder > 0 && stock < reorder) status = 'low-stock';

      return {
        id: j.id,
        name: j.name,
        sku: j.sku,
        stock,
        price: parseFloat(j.sellingPrice || j.standardCost || 0),
        status,
        productType: j.productType,
        isActive: j.isActive,
      };
    });

    return ResponseHelper.success(res, data, 'Products retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve products');
  }
});

/**
 * @swagger
 * /inventory/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Inventory]
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
 *               - sku
 *               - categoryId
 *               - unitId
 *               - productType
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               sku:
 *                 type: string
 *                 description: Stock keeping unit
 *               description:
 *                 type: string
 *                 description: Product description
 *               categoryId:
 *                 type: integer
 *                 description: Category ID
 *               unitId:
 *                 type: integer
 *                 description: Unit ID
 *               productType:
 *                 type: string
 *                 enum: [raw_material, finished_good, semi_finished]
 *                 description: Product type
 *               reorderLevel:
 *                 type: number
 *                 description: Reorder level
 *               maxStock:
 *                 type: number
 *                 description: Maximum stock level
 *               minStock:
 *                 type: number
 *                 description: Minimum stock level
 *               standardCost:
 *                 type: number
 *                 description: Standard cost
 *               sellingPrice:
 *                 type: number
 *                 description: Selling price
 *               weight:
 *                 type: number
 *                 description: Product weight
 *               volume:
 *                 type: number
 *                 description: Product volume
 *               shelfLife:
 *                 type: integer
 *                 description: Shelf life in days
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/products', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  // The UI may send a simplified payload (name/sku/stock/price). Defaults are resolved server-side.
  body('categoryId').optional().isInt().withMessage('Valid category ID is required'),
  body('unitId').optional().isInt().withMessage('Valid unit ID is required'),
  body('productType').optional().isIn(['raw_material', 'finished_good', 'semi_finished']).withMessage('Valid product type is required'),
  body('stock').optional().isFloat({ min: 0 }).withMessage('Initial stock must be a non-negative number'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('warehouseId').optional().isInt().withMessage('Valid warehouse ID is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      name,
      sku,
      description,
      productType: requestedProductType,
      categoryId: requestedCategoryId,
      unitId: requestedUnitId,
      stock: requestedStock,
      price: requestedPrice,
      warehouseId: requestedWarehouseId,
      isActive: requestedIsActive,
    } = req.body;

    const productType = requestedProductType || 'finished_good';
    // Category does not support `semi_finished`; we treat it as `finished_good` by default.
    const categoryType = productType === 'raw_material' ? 'raw_material' : 'finished_good';

    let categoryId = requestedCategoryId;
    if (!categoryId) {
      const cat = await Category.findOne({
        where: { companyId, categoryType },
        order: [['createdAt', 'ASC']],
      });
      categoryId = cat?.id;
    }

    let unitId = requestedUnitId;
    if (!unitId) {
      const unit = await Unit.findOne({
        where: { companyId },
        order: [['createdAt', 'ASC']],
      });
      unitId = unit?.id;
    }

    let warehouseId = requestedWarehouseId;
    if (!warehouseId) {
      const wh = await Warehouse.findOne({
        where: { companyId, isActive: true },
        order: [['createdAt', 'ASC']],
      });
      warehouseId = wh?.id;
    }
    if (!warehouseId) {
      const wh = await Warehouse.findOne({
        where: { companyId },
        order: [['createdAt', 'ASC']],
      });
      warehouseId = wh?.id;
    }

    if (!categoryId || !unitId) {
      return ResponseHelper.badRequest(res, 'Missing category/unit defaults for product creation', 'MISSING_REQUIRED_DEFAULTS', [
        'categoryId and unitId are required or must be resolvable from defaults'
      ]);
    }
    if (!warehouseId) {
      return ResponseHelper.badRequest(res, 'No warehouse found for your company', 'MISSING_WAREHOUSE', [
        'Create a warehouse first, then add products'
      ]);
    }

    const stockQty = requestedStock !== undefined && requestedStock !== null && requestedStock !== ''
      ? parseFloat(requestedStock)
      : 0;
    const sellingPrice = requestedPrice !== undefined && requestedPrice !== null && requestedPrice !== ''
      ? parseFloat(requestedPrice)
      : null;

    const product = await Product.create({
      companyId,
      name,
      sku,
      description: description || null,
      productType,
      categoryId,
      unitId,
      sellingPrice: sellingPrice ?? undefined,
      isActive: requestedIsActive !== undefined ? requestedIsActive : true,
    });

    // Initialize inventory stock in a default warehouse.
    const [stockRow, created] = await InventoryStock.findOrCreate({
      where: { productId: product.id, warehouseId },
      defaults: { quantity: stockQty, reservedQuantity: 0 },
    });
    if (!created) {
      await stockRow.update({ quantity: stockQty, reservedQuantity: 0 });
    }

    const reorder = parseFloat(product.reorderLevel || 0);
    let status = 'in-stock';
    if (stockQty <= 0) status = 'out-of-stock';
    else if (reorder > 0 && stockQty < reorder) status = 'low-stock';

    return ResponseHelper.created(
      res,
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: stockQty,
        price: parseFloat(product.sellingPrice || product.standardCost || 0),
        status,
        productType: product.productType,
        isActive: product.isActive,
      },
      'Product created successfully'
    );
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to create product');
  }
});

/**
 * @swagger
 * /inventory/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/products/:id', [
  param('id').isInt().withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement product retrieval logic
    return ResponseHelper.success(res, { id }, 'Product retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve product');
  }
});

/**
 * @swagger
 * /inventory/products/{id}:
 *   put:
 *     summary: Update product (and optionally initial stock)
 */
router.put('/products/:id', [
  param('id').isInt().withMessage('Valid product ID is required'),
  body('name').optional().notEmpty().withMessage('Product name must not be empty'),
  body('sku').optional().notEmpty().withMessage('SKU must not be empty'),
  body('description').optional().isString(),
  body('productType').optional().isIn(['raw_material', 'finished_good', 'semi_finished']).withMessage('Valid product type is required'),
  body('categoryId').optional().isInt().withMessage('Valid category ID is required'),
  body('unitId').optional().isInt().withMessage('Valid unit ID is required'),
  body('stock').optional().isFloat({ min: 0 }).withMessage('Stock must be a non-negative number'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('warehouseId').optional().isInt().withMessage('Valid warehouse ID is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const productId = parseInt(req.params.id, 10);

    const product = await Product.findOne({ where: { id: productId, companyId } });
    if (!product) return ResponseHelper.notFound(res, 'Product not found');

    const {
      name,
      sku,
      description,
      productType,
      categoryId,
      unitId,
      stock,
      price,
      warehouseId: requestedWarehouseId,
      isActive,
    } = req.body;

    const nextProductType = productType || product.productType;
    const nextCategoryType = nextProductType === 'raw_material' ? 'raw_material' : 'finished_good';

    let nextCategoryId = categoryId ?? product.categoryId;
    if (!nextCategoryId) {
      const cat = await Category.findOne({
        where: { companyId, categoryType: nextCategoryType },
        order: [['createdAt', 'ASC']],
      });
      nextCategoryId = cat?.id;
    }

    const nextUnitId = unitId ?? product.unitId;

    if (!nextCategoryId || !nextUnitId) {
      return ResponseHelper.badRequest(res, 'Missing category/unit defaults for product update', 'MISSING_REQUIRED_DEFAULTS');
    }

    const sellingPrice = price !== undefined && price !== null && price !== '' ? parseFloat(price) : null;

    await product.update({
      name: name ?? product.name,
      sku: sku ?? product.sku,
      description: description !== undefined ? description : product.description,
      productType: nextProductType,
      categoryId: nextCategoryId,
      unitId: nextUnitId,
      sellingPrice: sellingPrice !== null ? sellingPrice : product.sellingPrice,
      isActive: isActive !== undefined ? isActive : product.isActive,
    });

    if (stock !== undefined) {
      let whId = requestedWarehouseId;
      if (!whId) {
        const wh = await Warehouse.findOne({
          where: { companyId, isActive: true },
          order: [['createdAt', 'ASC']],
        });
        whId = wh?.id;
      }
      if (!whId) {
        const wh = await Warehouse.findOne({ where: { companyId }, order: [['createdAt', 'ASC']] });
        whId = wh?.id;
      }
      if (!whId) return ResponseHelper.badRequest(res, 'No warehouse found for your company', 'MISSING_WAREHOUSE');

      const stockQty = parseFloat(stock);
      const [stockRow, created] = await InventoryStock.findOrCreate({
        where: { productId: product.id, warehouseId: whId },
        defaults: { quantity: stockQty, reservedQuantity: 0 },
      });
      if (!created) {
        await stockRow.update({ quantity: stockQty, reservedQuantity: 0 });
      }
    }

    // Compute stock/status from the passed stock value if available, otherwise from existing default warehouse stock.
    const reorder = parseFloat(product.reorderLevel || 0);
    let computedStock = stock !== undefined ? parseFloat(stock) : 0;
    if (stock === undefined) {
      const wh = requestedWarehouseId
        ? { id: requestedWarehouseId }
        : await Warehouse.findOne({ where: { companyId, isActive: true }, order: [['createdAt', 'ASC']] });
      const whId = requestedWarehouseId || wh?.id;
      if (whId) {
        const stockRow = await InventoryStock.findOne({ where: { productId: product.id, warehouseId: whId } });
        computedStock = parseFloat(stockRow?.quantity || 0);
      }
    }

    let status = 'in-stock';
    if (computedStock <= 0) status = 'out-of-stock';
    else if (reorder > 0 && computedStock < reorder) status = 'low-stock';

    return ResponseHelper.success(
      res,
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: computedStock,
        price: parseFloat(product.sellingPrice || product.standardCost || 0),
        status,
      },
      'Product updated successfully'
    );
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to update product');
  }
});

/**
 * @swagger
 * /inventory/products/{id}:
 *   delete:
 *     summary: Delete product
 */
router.delete('/products/:id', [
  param('id').isInt().withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const productId = parseInt(req.params.id, 10);

    const product = await Product.findOne({ where: { id: productId, companyId } });
    if (!product) return ResponseHelper.notFound(res, 'Product not found');

    await sequelize.transaction(async (t) => {
      await InventoryTransaction.destroy({ where: { productId }, transaction: t });
      await InventoryStock.destroy({ where: { productId }, transaction: t });
      await Product.destroy({ where: { id: productId, companyId }, transaction: t });
    });

    return ResponseHelper.success(res, {}, 'Product deleted successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to delete product');
  }
});

/**
 * @swagger
 * /inventory/stocks:
 *   get:
 *     summary: Get inventory stock status
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: productId
 *         in: query
 *         description: Filter by product ID
 *         schema:
 *           type: integer
 *       - name: warehouseId
 *         in: query
 *         description: Filter by warehouse ID
 *         schema:
 *           type: integer
 *       - name: lowStock
 *         in: query
 *         description: Filter low stock items
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Stock status retrieved successfully
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
 *                         $ref: '#/components/schemas/InventoryStock'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/stocks', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('productId').optional().isInt(),
  query('warehouseId').optional().isInt(),
  query('lowStock').optional().isBoolean()
], async (req, res) => {
  try {
    const conditions = ['1=1'];
    const replacements = {};
    if (req.user?.companyId) {
      conditions.push('p.company_id = :companyId');
      replacements.companyId = req.user.companyId;
    }
    if (req.query.productId) {
      conditions.push('s.product_id = :productId');
      replacements.productId = parseInt(req.query.productId, 10);
    }
    if (req.query.warehouseId) {
      conditions.push('s.warehouse_id = :warehouseId');
      replacements.warehouseId = parseInt(req.query.warehouseId, 10);
    }
    replacements.limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    replacements.offset = ((parseInt(req.query.page, 10) || 1) - 1) * replacements.limit;

    const [rows] = await sequelize.query(
      `SELECT s.id, s.product_id AS productId, s.warehouse_id AS warehouseId, s.quantity, s.reserved_quantity AS reservedQuantity,
              s.last_updated AS lastUpdated, p.name AS productName, p.sku, p.min_stock_level AS reorderLevel
       FROM inventory_stocks s
       JOIN products p ON p.id = s.product_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY s.last_updated DESC
       LIMIT :limit OFFSET :offset`,
      { replacements }
    );

    const lowStockOnly = req.query.lowStock === 'true' || req.query.lowStock === true;
    const data = rows
      .map((j) => {
        const qty = parseFloat(j.quantity || 0);
        const reserved = parseFloat(j.reservedQuantity || 0);
        const reorder = parseFloat(j.reorderLevel || 0);
        const available = qty - reserved;
        return {
          id: j.id,
          productId: j.productId,
          warehouseId: j.warehouseId,
          productName: j.productName,
          sku: j.sku,
          quantity: qty,
          reservedQuantity: reserved,
          lastUpdated: j.lastUpdated,
          availableQuantity: available,
          isLowStock: reorder > 0 ? qty <= reorder : false,
        };
      })
      .filter((row) => !lowStockOnly || row.isLowStock);

    return ResponseHelper.success(res, data, 'Stock status retrieved successfully');
  } catch (error) {
    if (isSchemaIssue(error)) {
      return ResponseHelper.success(res, [], 'Stock status retrieved successfully');
    }
    return ResponseHelper.error(res, 'Failed to retrieve stock status');
  }
});

/**
 * @swagger
 * /inventory/transactions:
 *   get:
 *     summary: Get inventory transactions
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: productId
 *         in: query
 *         description: Filter by product ID
 *         schema:
 *           type: integer
 *       - name: warehouseId
 *         in: query
 *         description: Filter by warehouse ID
 *         schema:
 *           type: integer
 *       - name: transactionType
 *         in: query
 *         description: Filter by transaction type
 *         schema:
 *           type: string
 *           enum: [purchase, sale, production_in, production_out, transfer, adjustment, return]
 *       - name: startDate
 *         in: query
 *         description: Start date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                         $ref: '#/components/schemas/InventoryTransaction'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/transactions', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('productId').optional().isInt(),
  query('warehouseId').optional().isInt(),
  query('transactionType').optional().isIn(['purchase', 'sale', 'production_in', 'production_out', 'transfer', 'adjustment', 'return']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const where = {};
    const productWhere = { companyId: req.user.companyId };
    if (req.query.productId) where.productId = parseInt(req.query.productId, 10);
    if (req.query.warehouseId) where.warehouseId = parseInt(req.query.warehouseId, 10);
    if (req.query.transactionType) where.transactionType = req.query.transactionType;

    const rows = await InventoryTransaction.findAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
          where: productWhere,
          required: true,
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Math.min(parseInt(req.query.limit, 10) || 100, 200),
    });

    const typeToUi = {
      purchase: 'in',
      sale: 'out',
      production_in: 'in',
      production_out: 'out',
      transfer: 'out',
      adjustment: 'in',
      return: 'in',
    };

    const data = rows.map((t) => {
      const j = t.toJSON();
      const creator = j.creator;
      const userLabel = creator
        ? `${creator.firstName || ''} ${creator.lastName || ''}`.trim()
        : '—';
      return {
        id: j.id,
        type: typeToUi[j.transactionType] || 'out',
        product: j.product?.name || '—',
        quantity: parseFloat(j.quantity),
        date: j.createdAt ? String(j.createdAt).slice(0, 10) : '',
        user: userLabel,
        transactionType: j.transactionType,
      };
    });

    return ResponseHelper.success(res, data, 'Transactions retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, 'Failed to retrieve transactions');
  }
});

/**
 * @swagger
 * /inventory/transactions:
 *   post:
 *     summary: Create inventory transaction
 *     tags: [Inventory]
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
 *               - warehouseId
 *               - transactionType
 *               - quantity
 *               - referenceType
 *               - referenceId
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: Product ID
 *               warehouseId:
 *                 type: integer
 *                 description: Warehouse ID
 *               transactionType:
 *                 type: string
 *                 enum: [purchase, sale, production_in, production_out, transfer, adjustment, return]
 *                 description: Transaction type
 *               quantity:
 *                 type: number
 *                 description: Transaction quantity
 *               unitCost:
 *                 type: number
 *                 description: Unit cost
 *               referenceType:
 *                 type: string
 *                 enum: [purchase_order, sales_order, production_order, transfer_order, adjustment]
 *                 description: Reference type
 *               referenceId:
 *                 type: integer
 *                 description: Reference ID
 *               batchNumber:
 *                 type: string
 *                 description: Batch number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry date
 *               notes:
 *                 type: string
 *                 description: Transaction notes
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/InventoryTransaction'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/transactions', [
  body('productId').isInt().withMessage('Valid product ID is required'),
  // If not provided by UI, we resolve a default warehouse server-side.
  body('warehouseId').optional().isInt().withMessage('Valid warehouse ID is required'),
  body('transactionType').isIn(['purchase', 'sale', 'production_in', 'production_out', 'transfer', 'adjustment', 'return']).withMessage('Valid transaction type is required'),
  body('quantity').isFloat().withMessage('Valid quantity is required'),
  // For quick UI actions (stock in/out), we default to a generic `adjustment`.
  body('referenceType').optional().isIn(['purchase_order', 'sales_order', 'production_order', 'transfer_order', 'adjustment']).withMessage('Valid reference type is required'),
  body('referenceId').optional().isInt().withMessage('Valid reference ID is required')
], async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const {
      productId,
      warehouseId: requestedWarehouseId,
      transactionType,
      quantity,
      unitCost,
      referenceType: requestedReferenceType,
      referenceId: requestedReferenceId,
      batchNumber,
      expiryDate,
      notes,
    } = req.body;

    const txQty = parseFloat(quantity);
    if (!Number.isFinite(txQty) || txQty <= 0) {
      return ResponseHelper.badRequest(res, 'Quantity must be a positive number', 'VALIDATION_ERROR');
    }

    // Ensure product belongs to the user's company
    const product = await Product.findOne({ where: { id: productId, companyId } });
    if (!product) return ResponseHelper.notFound(res, 'Product not found');

    let warehouseId = requestedWarehouseId;
    if (!warehouseId) {
      const wh = await Warehouse.findOne({
        where: { companyId, isActive: true },
        order: [['createdAt', 'ASC']],
      });
      warehouseId = wh?.id;
    }
    if (!warehouseId) {
      const wh = await Warehouse.findOne({ where: { companyId }, order: [['createdAt', 'ASC']] });
      warehouseId = wh?.id;
    }
    if (!warehouseId) return ResponseHelper.badRequest(res, 'No warehouse found for your company', 'MISSING_WAREHOUSE');

    const referenceType = requestedReferenceType || 'adjustment';
    const referenceId = requestedReferenceId !== undefined && requestedReferenceId !== null ? parseInt(requestedReferenceId, 10) : 0;

    const isStockIn = ['purchase', 'production_in', 'adjustment', 'return'].includes(transactionType);

    await sequelize.transaction(async (t) => {
      const [stockRow, created] = await InventoryStock.findOrCreate({
        where: { productId, warehouseId },
        defaults: { quantity: 0, reservedQuantity: 0 },
        transaction: t,
      });

      if (isStockIn) {
        const nextQty = parseFloat(stockRow.quantity || 0) + txQty;
        await stockRow.update({ quantity: nextQty }, { transaction: t });
      } else {
        const available = parseFloat(stockRow.quantity || 0) - parseFloat(stockRow.reservedQuantity || 0);
        if (available < txQty) {
          throw new Error('Insufficient stock available');
        }
        const nextQty = parseFloat(stockRow.quantity || 0) - txQty;
        await stockRow.update({ quantity: nextQty }, { transaction: t });
      }

      await InventoryTransaction.create(
        {
          productId,
          warehouseId,
          transactionType,
          quantity: txQty,
          unitCost: unitCost !== undefined ? parseFloat(unitCost) : null,
          referenceType,
          referenceId,
          batchNumber: batchNumber || null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          notes: notes || null,
          createdBy: req.user.id,
        },
        { transaction: t }
      );
    });

    return ResponseHelper.created(res, {}, 'Transaction created successfully');
  } catch (error) {
    return ResponseHelper.error(res, error?.message ? `Failed to create transaction: ${error.message}` : 'Failed to create transaction');
  }
});

module.exports = router;
