const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryTransaction = sequelize.define('InventoryTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      },
      field: 'product_id'
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id'
      },
      field: 'warehouse_id'
    },
    transactionType: {
      type: DataTypes.ENUM('purchase', 'sale', 'production_in', 'production_out', 'transfer', 'adjustment', 'return'),
      allowNull: false,
      field: 'transaction_type'
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'unit_cost'
    },
    referenceType: {
      type: DataTypes.ENUM('purchase_order', 'sales_order', 'production_order', 'transfer_order', 'adjustment'),
      allowNull: false,
      field: 'reference_type'
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reference_id'
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'batch_number'
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiry_date'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'created_by'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'inventory_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['product_id']
      },
      {
        fields: ['warehouse_id']
      },
      {
        fields: ['transaction_type']
      },
      {
        fields: ['reference_type', 'reference_id']
      },
      {
        fields: ['created_by']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['batch_number']
      }
    ]
  });

  // Instance methods
  InventoryTransaction.prototype.isStockIn = function() {
    return ['purchase', 'production_in', 'adjustment', 'return'].includes(this.transactionType);
  };

  InventoryTransaction.prototype.isStockOut = function() {
    return ['sale', 'production_out', 'transfer'].includes(this.transactionType);
  };

  InventoryTransaction.prototype.getTotalCost = function() {
    if (!this.unitCost) return 0;
    return Math.abs(this.quantity) * this.unitCost;
  };

  // Class methods
  InventoryTransaction.findByProduct = function(productId, warehouseId = null, limit = 50) {
    const where = { productId };
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    return this.findAll({
      where,
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'product'
      }, {
        association: 'warehouse'
      }, {
        association: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  InventoryTransaction.findByWarehouse = function(warehouseId, limit = 50) {
    return this.findAll({
      where: { warehouseId },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'product'
      }, {
        association: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  InventoryTransaction.findByDateRange = function(startDate, endDate, limit = 100) {
    return this.findAll({
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'product'
      }, {
        association: 'warehouse'
      }]
    });
  };

  InventoryTransaction.findByReference = function(referenceType, referenceId) {
    return this.findAll({
      where: { referenceType, referenceId },
      include: [{
        association: 'product'
      }, {
        association: 'warehouse'
      }]
    });
  };

  InventoryTransaction.getStockMovement = function(productId, warehouseId, startDate, endDate) {
    const where = { productId };
    if (warehouseId) where.warehouseId = warehouseId;
    if (startDate && endDate) {
      where.createdAt = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    return this.findAll({
      where,
      order: [['createdAt', 'ASC']],
      include: [{
        association: 'product'
      }, {
        association: 'warehouse'
      }]
    });
  };

  // Associations
  InventoryTransaction.associate = function(models) {
    // InventoryTransaction belongs to Product
    InventoryTransaction.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    // InventoryTransaction belongs to Warehouse
    InventoryTransaction.belongsTo(models.Warehouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse'
    });

    // InventoryTransaction belongs to Creator (User)
    InventoryTransaction.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return InventoryTransaction;
};
