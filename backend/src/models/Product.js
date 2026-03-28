const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      field: 'company_id'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      field: 'category_id'
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'units',
        key: 'id'
      },
      field: 'unit_id'
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100]
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    productType: {
      type: DataTypes.ENUM('raw_material', 'finished_good', 'semi_finished'),
      allowNull: false,
      field: 'product_type'
    },
    reorderLevel: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'reorder_level'
    },
    maxStock: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'max_stock'
    },
    minStock: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'min_stock'
    },
    standardCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'standard_cost'
    },
    sellingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'selling_price'
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    volume: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    shelfLife: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'shelf_life'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['sku']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['category_id']
      },
      {
        fields: ['product_type']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['name']
      }
    ]
  });

  // Instance methods
  Product.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  Product.prototype.isLowStock = function(currentStock) {
    return currentStock <= this.reorderLevel;
  };

  Product.prototype.isOverstocked = function(currentStock) {
    return this.maxStock && currentStock >= this.maxStock;
  };

  Product.prototype.getStockStatus = function(currentStock) {
    if (currentStock === 0) return 'out_of_stock';
    if (this.isLowStock(currentStock)) return 'low_stock';
    if (this.isOverstocked(currentStock)) return 'overstocked';
    return 'normal';
  };

  // Class methods
  Product.findBySku = function(sku, companyId) {
    return this.findOne({
      where: { 
        sku,
        companyId 
      }
    });
  };

  Product.findActive = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      }
    });
  };

  Product.findByType = function(productType, companyId) {
    return this.findAll({
      where: { 
        productType,
        companyId 
      }
    });
  };

  Product.findLowStock = function(companyId) {
    return this.findAll({
      where: { 
        companyId 
      },
      include: [{
        association: 'inventoryStocks',
        where: {
          quantity: {
            [sequelize.Sequelize.Op.lte]: sequelize.col('reorder_level')
          }
        }
      }]
    });
  };

  // Associations
  Product.associate = function(models) {
    // Product belongs to Company
    Product.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Product belongs to Category
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // Product belongs to Unit
    Product.belongsTo(models.Unit, {
      foreignKey: 'unitId',
      as: 'unit'
    });

    // Product has many Inventory Stocks
    Product.hasMany(models.InventoryStock, {
      foreignKey: 'productId',
      as: 'inventoryStocks'
    });

    // Product has many Inventory Transactions
    Product.hasMany(models.InventoryTransaction, {
      foreignKey: 'productId',
      as: 'inventoryTransactions'
    });

    // Product can be a finished product in BOM
    Product.hasMany(models.BOM, {
      foreignKey: 'finishedProductId',
      as: 'bomAsFinished'
    });

    // Product can be a raw material in BOM components
    Product.hasMany(models.BOMComponent, {
      foreignKey: 'rawMaterialId',
      as: 'bomAsRawMaterial'
    });

    // Product has many Production Orders
    Product.hasMany(models.ProductionOrder, {
      foreignKey: 'productId',
      as: 'productionOrders'
    });

    // Product appears in Sales Order Items
    Product.hasMany(models.SalesOrderItem, {
      foreignKey: 'productId',
      as: 'salesOrderItems'
    });

    // Product appears in Purchase Order Items
    Product.hasMany(models.PurchaseOrderItem, {
      foreignKey: 'productId',
      as: 'purchaseOrderItems'
    });
  };

  return Product;
};
