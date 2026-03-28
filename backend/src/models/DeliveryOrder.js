const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryOrder = sequelize.define('DeliveryOrder', {
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
    deliveryNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'delivery_number'
    },
    salesOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sales_orders',
        key: 'id'
      },
      field: 'sales_order_id'
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vehicles',
        key: 'id'
      },
      field: 'vehicle_id'
    },
    driverName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'driver_name'
    },
    driverPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'driver_phone'
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'delivery_date'
    },
    status: {
      type: DataTypes.ENUM('planned', 'in_transit', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'planned'
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
    tableName: 'delivery_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['delivery_number']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['sales_order_id']
      },
      {
        fields: ['vehicle_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['delivery_date']
      }
    ]
  });

  // Instance methods
  DeliveryOrder.prototype.isDispatched = function() {
    return ['in_transit', 'delivered'].includes(this.status);
  };

  DeliveryOrder.prototype.isDelivered = function() {
    return this.status === 'delivered';
  };

  DeliveryOrder.prototype.canBeDispatched = function() {
    return this.status === 'planned';
  };

  DeliveryOrder.prototype.canBeCompleted = function() {
    return this.status === 'in_transit';
  };

  DeliveryOrder.prototype.dispatch = function() {
    if (!this.canBeDispatched()) {
      throw new Error('Delivery order cannot be dispatched');
    }
    
    return this.update({
      status: 'in_transit'
    });
  };

  DeliveryOrder.prototype.complete = function() {
    if (!this.canBeCompleted()) {
      throw new Error('Delivery order cannot be completed');
    }
    
    return this.update({
      status: 'delivered'
    });
  };

  DeliveryOrder.prototype.cancel = function() {
    if (this.isDelivered()) {
      throw new Error('Delivered order cannot be cancelled');
    }
    
    return this.update({
      status: 'cancelled'
    });
  };

  // Class methods
  DeliveryOrder.findByNumber = function(deliveryNumber, companyId) {
    return this.findOne({
      where: { 
        deliveryNumber,
        companyId 
      },
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }]
    });
  };

  DeliveryOrder.findBySalesOrder = function(salesOrderId) {
    return this.findAll({
      where: { salesOrderId },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'vehicle'
      }]
    });
  };

  DeliveryOrder.findByVehicle = function(vehicleId, limit = 50) {
    return this.findAll({
      where: { vehicleId },
      limit,
      order: [['deliveryDate', 'DESC']],
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }]
    });
  };

  DeliveryOrder.findByStatus = function(status, companyId) {
    return this.findAll({
      where: { 
        status,
        companyId 
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }]
    });
  };

  DeliveryOrder.findByDateRange = function(startDate, endDate, companyId) {
    return this.findAll({
      where: {
        companyId,
        deliveryDate: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }]
    });
  };

  DeliveryOrder.getPendingDeliveries = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: 'planned'
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }]
    });
  };

  DeliveryOrder.getInTransitDeliveries = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: 'in_transit'
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }, {
        association: 'tracking',
        order: [['timestamp', 'DESC']]
      }]
    });
  };

  DeliveryOrder.getOverdueDeliveries = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: 'planned',
        deliveryDate: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      },
      order: [['deliveryDate', 'ASC']],
      include: [{
        association: 'salesOrder',
        include: [{
          association: 'customer'
        }]
      }]
    });
  };

  // Associations
  DeliveryOrder.associate = function(models) {
    // DeliveryOrder belongs to Company
    DeliveryOrder.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // DeliveryOrder belongs to Sales Order
    DeliveryOrder.belongsTo(models.SalesOrder, {
      foreignKey: 'salesOrderId',
      as: 'salesOrder'
    });

    // DeliveryOrder belongs to Vehicle
    DeliveryOrder.belongsTo(models.Vehicle, {
      foreignKey: 'vehicleId',
      as: 'vehicle'
    });

    // DeliveryOrder belongs to Creator (User)
    DeliveryOrder.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // DeliveryOrder has many Delivery Tracking entries
    DeliveryOrder.hasMany(models.DeliveryTracking, {
      foreignKey: 'deliveryOrderId',
      as: 'tracking'
    });
  };

  return DeliveryOrder;
};
