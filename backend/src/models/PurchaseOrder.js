const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
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
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'suppliers',
        key: 'id'
      },
      field: 'supplier_id'
    },
    orderNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'order_number'
    },
    orderDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'order_date'
    },
    expectedDeliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expected_delivery_date'
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'confirmed', 'partial_received', 'received', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_amount'
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'tax_amount'
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'discount_amount'
    },
    netAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'net_amount'
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'purchase_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['order_number']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['supplier_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['order_date']
      }
    ]
  });

  // Instance methods
  PurchaseOrder.prototype.getTotalQuantity = function() {
    // This would be calculated from order items
    return 0; // Placeholder
  };

  PurchaseOrder.prototype.getReceivedQuantity = function() {
    // This would be calculated from received items
    return 0; // Placeholder
  };

  PurchaseOrder.prototype.getPendingQuantity = function() {
    return this.getTotalQuantity() - this.getReceivedQuantity();
  };

  PurchaseOrder.prototype.isFullyReceived = function() {
    return this.getReceivedQuantity() >= this.getTotalQuantity();
  };

  PurchaseOrder.prototype.isPartiallyReceived = function() {
    return this.getReceivedQuantity() > 0 && !this.isFullyReceived();
  };

  PurchaseOrder.prototype.canBeSent = function() {
    return this.status === 'draft';
  };

  PurchaseOrder.prototype.canBeConfirmed = function() {
    return this.status === 'sent';
  };

  PurchaseOrder.prototype.canBeCancelled = function() {
    return !['received', 'cancelled'].includes(this.status);
  };

  // Class methods
  PurchaseOrder.findBySupplier = function(supplierId, limit = 50) {
    return this.findAll({
      where: { supplierId },
      limit,
      order: [['orderDate', 'DESC']],
      include: [{
        association: 'supplier'
      }, {
        association: 'items'
      }]
    });
  };

  PurchaseOrder.findByStatus = function(status, companyId) {
    return this.findAll({
      where: { 
        status,
        companyId 
      },
      order: [['orderDate', 'DESC']],
      include: [{
        association: 'supplier'
      }]
    });
  };

  PurchaseOrder.findByDateRange = function(startDate, endDate, companyId) {
    return this.findAll({
      where: {
        companyId,
        orderDate: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['orderDate', 'DESC']],
      include: [{
        association: 'supplier'
      }]
    });
  };

  PurchaseOrder.getPendingOrders = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: ['sent', 'confirmed']
      },
      order: [['expectedDeliveryDate', 'ASC']],
      include: [{
        association: 'supplier'
      }, {
        association: 'items',
        include: [{
          association: 'product'
        }]
      }]
    });
  };

  PurchaseOrder.getOverdueOrders = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: ['sent', 'confirmed'],
        expectedDeliveryDate: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      },
      order: [['expectedDeliveryDate', 'ASC']],
      include: [{
        association: 'supplier'
      }]
    });
  };

  // Associations
  PurchaseOrder.associate = function(models) {
    // PurchaseOrder belongs to Company
    PurchaseOrder.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // PurchaseOrder belongs to Supplier
    PurchaseOrder.belongsTo(models.Supplier, {
      foreignKey: 'supplierId',
      as: 'supplier'
    });

    // PurchaseOrder belongs to Creator (User)
    PurchaseOrder.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    if (models.PurchaseOrderItem) {
      PurchaseOrder.hasMany(models.PurchaseOrderItem, {
        foreignKey: 'purchaseOrderId',
        as: 'items'
      });
    }
  };

  return PurchaseOrder;
};
