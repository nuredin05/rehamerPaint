const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryStock = sequelize.define('InventoryStock', {
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
    quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      defaultValue: 0
    },
    reservedQuantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      defaultValue: 0,
      field: 'reserved_quantity'
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'last_updated'
    }
  }, {
    tableName: 'inventory_stocks',
    timestamps: true,
    createdAt: false,
    updatedAt: 'last_updated',
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'warehouse_id']
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['warehouse_id']
      }
    ]
  });

  // Virtual field for available quantity
  InventoryStock.prototype.getAvailableQuantity = function() {
    return this.quantity - this.reservedQuantity;
  };

  // Instance methods
  InventoryStock.prototype.isAvailable = function(requestedQuantity) {
    return this.getAvailableQuantity() >= requestedQuantity;
  };

  InventoryStock.prototype.isLowStock = function(product) {
    return this.quantity <= (product?.reorderLevel || 0);
  };

  InventoryStock.prototype.isOutOfStock = function() {
    return this.quantity === 0;
  };

  InventoryStock.prototype.getStockStatus = function(product) {
    const available = this.getAvailableQuantity();
    if (available === 0) return 'out_of_stock';
    if (product && this.isLowStock(product)) return 'low_stock';
    return 'normal';
  };

  InventoryStock.prototype.reserve = function(quantity) {
    if (!this.isAvailable(quantity)) {
      throw new Error('Insufficient stock available');
    }
    this.reservedQuantity += quantity;
    return this.save();
  };

  InventoryStock.prototype.release = function(quantity) {
    if (quantity > this.reservedQuantity) {
      throw new Error('Cannot release more than reserved quantity');
    }
    this.reservedQuantity -= quantity;
    return this.save();
  };

  InventoryStock.prototype.addStock = function(quantity) {
    this.quantity += quantity;
    return this.save();
  };

  InventoryStock.prototype.removeStock = function(quantity) {
    if (quantity > this.getAvailableQuantity()) {
      throw new Error('Insufficient stock available');
    }
    this.quantity -= quantity;
    return this.save();
  };

  // Class methods
  InventoryStock.findByProduct = function(productId, warehouseId = null) {
    const where = { productId };
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    return this.findAll({
      where,
      include: [{
        association: 'product'
      }]
    });
  };

  InventoryStock.findByWarehouse = function(warehouseId) {
    return this.findAll({
      where: { warehouseId },
      include: [{
        association: 'product'
      }]
    });
  };

  InventoryStock.getLowStock = function(companyId) {
    return this.findAll({
      include: [{
        association: 'product',
        where: {
          companyId,
          [sequelize.Sequelize.Op.and]: [
            sequelize.literal(`inventory_stocks.quantity <= products.reorder_level`)
          ]
        }
      }]
    });
  };

  InventoryStock.getOutOfStock = function(companyId) {
    return this.findAll({
      where: {
        quantity: 0
      },
      include: [{
        association: 'product',
        where: { companyId }
      }]
    });
  };

  // Associations
  InventoryStock.associate = function(models) {
    // InventoryStock belongs to Product
    InventoryStock.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    // InventoryStock belongs to Warehouse
    InventoryStock.belongsTo(models.Warehouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse'
    });

    // Composite (productId + warehouseId) → Sequelize hasMany is unreliable here; query transactions by scope instead.
  };

  return InventoryStock;
};
