const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Warehouse = sequelize.define('Warehouse', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50]
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    capacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    currentUtilization: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'current_utilization'
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'manager_id'
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
    tableName: 'warehouses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['manager_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  Warehouse.prototype.getUtilizationPercentage = function() {
    if (!this.capacity || this.capacity === 0) return 0;
    return (this.currentUtilization / this.capacity) * 100;
  };

  Warehouse.prototype.isOverCapacity = function() {
    return this.capacity && this.currentUtilization > this.capacity;
  };

  Warehouse.prototype.getAvailableCapacity = function() {
    if (!this.capacity) return null;
    return this.capacity - this.currentUtilization;
  };

  // Class methods
  Warehouse.findByCode = function(code, companyId) {
    return this.findOne({
      where: { 
        code,
        companyId 
      }
    });
  };

  Warehouse.findActive = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      }
    });
  };

  Warehouse.findAvailable = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId,
        [sequelize.Sequelize.Op.or]: [
          { capacity: null },
          { currentUtilization: { [sequelize.Sequelize.Op.lt]: sequelize.col('capacity') } }
        ]
      }
    });
  };

  // Associations
  Warehouse.associate = function(models) {
    // Warehouse belongs to Company
    Warehouse.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Warehouse belongs to Manager (User)
    Warehouse.belongsTo(models.User, {
      foreignKey: 'managerId',
      as: 'manager'
    });

    // Warehouse has many Inventory Stocks
    Warehouse.hasMany(models.InventoryStock, {
      foreignKey: 'warehouseId',
      as: 'inventoryStocks'
    });

    // Warehouse has many Inventory Transactions
    Warehouse.hasMany(models.InventoryTransaction, {
      foreignKey: 'warehouseId',
      as: 'inventoryTransactions'
    });

    // Warehouse has many Delivery Orders
    Warehouse.hasMany(models.DeliveryOrder, {
      foreignKey: 'warehouseId',
      as: 'deliveryOrders'
    });
  };

  return Warehouse;
};
