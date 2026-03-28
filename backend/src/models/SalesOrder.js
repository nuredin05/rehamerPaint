const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SalesOrder = sequelize.define('SalesOrder', {
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
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      },
      field: 'customer_id'
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
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'delivery_date'
    },
    status: {
      type: DataTypes.ENUM('draft', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled'),
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
    tableName: 'sales_orders',
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
        fields: ['customer_id']
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
  SalesOrder.prototype.getTotalQuantity = function() {
    // This would be calculated from order items
    return 0; // Placeholder
  };

  SalesOrder.prototype.getDeliveredQuantity = function() {
    // This would be calculated from delivered items
    return 0; // Placeholder
  };

  SalesOrder.prototype.getPendingQuantity = function() {
    return this.getTotalQuantity() - this.getDeliveredQuantity();
  };

  SalesOrder.prototype.isFullyDelivered = function() {
    return this.getDeliveredQuantity() >= this.getTotalQuantity();
  };

  SalesOrder.prototype.canBeConfirmed = function() {
    return this.status === 'draft';
  };

  SalesOrder.prototype.canBeCancelled = function() {
    return !['shipped', 'delivered'].includes(this.status);
  };

  // Class methods
  SalesOrder.findByCustomer = function(customerId, limit = 50) {
    return this.findAll({
      where: { customerId },
      limit,
      order: [['orderDate', 'DESC']],
      include: [{
        association: 'customer'
      }, {
        association: 'items'
      }]
    });
  };

  SalesOrder.findByStatus = function(status, companyId) {
    return this.findAll({
      where: { 
        status,
        companyId 
      },
      order: [['orderDate', 'DESC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  SalesOrder.findByDateRange = function(startDate, endDate, companyId) {
    return this.findAll({
      where: {
        companyId,
        orderDate: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['orderDate', 'DESC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  SalesOrder.getPendingOrders = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: ['confirmed', 'in_production', 'ready']
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'customer'
      }, {
        association: 'items',
        include: [{
          association: 'product'
        }]
      }]
    });
  };

  SalesOrder.getOverdueOrders = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: ['confirmed', 'in_production', 'ready'],
        deliveryDate: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  // Associations
  SalesOrder.associate = function(models) {
    // SalesOrder belongs to Company
    SalesOrder.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // SalesOrder belongs to Customer
    SalesOrder.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });

    // SalesOrder belongs to Creator (User)
    SalesOrder.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    if (models.SalesOrderItem) {
      SalesOrder.hasMany(models.SalesOrderItem, {
        foreignKey: 'salesOrderId',
        as: 'items'
      });
    }

    // SalesOrder has many Delivery Orders
    SalesOrder.hasMany(models.DeliveryOrder, {
      foreignKey: 'salesOrderId',
      as: 'deliveryOrders'
    });

    // SalesOrder has many Invoices
    SalesOrder.hasMany(models.Invoice, {
      foreignKey: 'salesOrderId',
      as: 'invoices'
    });
  };

  return SalesOrder;
};
