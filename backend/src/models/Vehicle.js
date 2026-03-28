const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vehicle = sequelize.define('Vehicle', {
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
    vehicleNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'vehicle_number'
    },
    vehicleType: {
      type: DataTypes.ENUM('truck', 'van', 'motorcycle'),
      allowNull: false,
      field: 'vehicle_type'
    },
    capacity: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
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
    tableName: 'vehicles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['vehicle_number']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['vehicle_type']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  Vehicle.prototype.isAvailable = function(date) {
    // Check if vehicle is available for the given date
    // This would be calculated from delivery orders
    return true; // Placeholder
  };

  Vehicle.prototype.getCurrentLocation = function() {
    // Get current location from latest delivery tracking
    return null; // Placeholder
  };

  Vehicle.prototype.getDeliveryCount = function(startDate, endDate) {
    // Get number of deliveries in date range
    return 0; // Placeholder
  };

  Vehicle.prototype.getUtilizationRate = function(startDate, endDate) {
    // Calculate utilization rate based on deliveries
    return 0; // Placeholder
  };

  // Class methods
  Vehicle.findByNumber = function(vehicleNumber, companyId) {
    return this.findOne({
      where: { 
        vehicleNumber,
        companyId 
      }
    });
  };

  Vehicle.findByType = function(vehicleType, companyId) {
    return this.findAll({
      where: { 
        vehicleType,
        companyId,
        isActive: true
      },
      order: [['vehicleNumber', 'ASC']]
    });
  };

  Vehicle.findActive = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      },
      order: [['vehicleNumber', 'ASC']]
    });
  };

  Vehicle.findAvailable = function(companyId, date) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      },
      order: [['vehicleNumber', 'ASC']]
    });
  };

  Vehicle.getVehicleUtilization = function(companyId, startDate, endDate) {
    return this.findAll({
      where: { 
        companyId,
        isActive: true
      },
      include: [{
        association: 'deliveryOrders',
        where: {
          deliveryDate: {
            [sequelize.Sequelize.Op.between]: [startDate, endDate]
          },
          status: ['planned', 'in_transit', 'delivered']
        }
      }]
    });
  };

  // Associations
  Vehicle.associate = function(models) {
    // Vehicle belongs to Company
    Vehicle.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Vehicle has many Delivery Orders
    Vehicle.hasMany(models.DeliveryOrder, {
      foreignKey: 'vehicleId',
      as: 'deliveryOrders'
    });
  };

  return Vehicle;
};
