const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryTracking = sequelize.define('DeliveryTracking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    deliveryOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'delivery_orders',
        key: 'id'
      },
      field: 'delivery_order_id'
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('picked_up', 'in_transit', 'arrived', 'delivered'),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    }
  }, {
    tableName: 'delivery_tracking',
    timestamps: false,
    indexes: [
      {
        fields: ['delivery_order_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['timestamp']
      },
      {
        fields: ['created_by']
      }
    ]
  });

  // Instance methods
  DeliveryTracking.prototype.getStatusDescription = function() {
    const descriptions = {
      'picked_up': 'Package picked up from warehouse',
      'in_transit': 'Package is in transit',
      'arrived': 'Package arrived at destination',
      'delivered': 'Package successfully delivered'
    };
    return descriptions[this.status] || this.status;
  };

  DeliveryTracking.prototype.getFormattedTimestamp = function() {
    return this.timestamp.toLocaleString();
  };

  // Class methods
  DeliveryTracking.findByDeliveryOrder = function(deliveryOrderId, limit = 50) {
    return this.findAll({
      where: { deliveryOrderId },
      limit,
      order: [['timestamp', 'DESC']],
      include: [{
        association: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  DeliveryTracking.getLatestStatus = function(deliveryOrderId) {
    return this.findOne({
      where: { deliveryOrderId },
      order: [['timestamp', 'DESC']],
      include: [{
        association: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  DeliveryTracking.getByStatus = function(status, companyId) {
    return this.findAll({
      where: { status },
      order: [['timestamp', 'DESC']],
      include: [{
        association: 'deliveryOrder',
        where: { companyId },
        include: [{
          association: 'salesOrder',
          include: [{
            association: 'customer'
          }]
        }]
      }]
    });
  };

  DeliveryTracking.getByDateRange = function(startDate, endDate) {
    return this.findAll({
      where: {
        timestamp: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['timestamp', 'DESC']],
      include: [{
        association: 'deliveryOrder',
        include: [{
          association: 'salesOrder',
          include: [{
            association: 'customer'
          }]
        }]
      }]
    });
  };

  DeliveryTracking.getActiveTracking = function(companyId) {
    return this.findAll({
      where: {
        status: ['picked_up', 'in_transit', 'arrived']
      },
      order: [['timestamp', 'DESC']],
      include: [{
        association: 'deliveryOrder',
        where: { companyId },
        include: [{
          association: 'salesOrder',
          include: [{
            association: 'customer'
          }]
        }]
      }]
    });
  };

  // Associations
  DeliveryTracking.associate = function(models) {
    // DeliveryTracking belongs to Delivery Order
    DeliveryTracking.belongsTo(models.DeliveryOrder, {
      foreignKey: 'deliveryOrderId',
      as: 'deliveryOrder'
    });

    // DeliveryTracking belongs to Creator (User)
    DeliveryTracking.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return DeliveryTracking;
};
