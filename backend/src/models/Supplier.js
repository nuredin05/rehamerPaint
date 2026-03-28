const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('Supplier', {
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
    supplierCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'supplier_code'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    contactPerson: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'contact_person'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentTerms: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'payment_terms'
    },
    taxId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'tax_id'
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
    tableName: 'suppliers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['supplier_code']
      },
      {
        fields: ['company_id']
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
  Supplier.prototype.getTotalPurchases = function(startDate, endDate) {
    // This would be calculated from purchase orders
    return 0; // Placeholder
  };

  Supplier.prototype.getAverageDeliveryTime = function() {
    // This would be calculated from purchase order delivery performance
    return 0; // Placeholder
  };

  Supplier.prototype.getQualityRating = function() {
    // This would be calculated from quality test results
    return 0; // Placeholder
  };

  // Class methods
  Supplier.findByCode = function(supplierCode, companyId) {
    return this.findOne({
      where: { 
        supplierCode,
        companyId 
      }
    });
  };

  Supplier.findActive = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      }
    });
  };

  Supplier.findTopSuppliers = function(companyId, limit = 10) {
    return this.findAll({
      where: { 
        companyId,
        isActive: true
      },
      limit,
      order: [['name', 'ASC']],
      include: [{
        association: 'purchaseOrders',
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
          [sequelize.fn('SUM', sequelize.col('net_amount')), 'totalAmount']
        ]
      }]
    });
  };

  // Associations
  Supplier.associate = function(models) {
    // Supplier belongs to Company
    Supplier.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Supplier has many Purchase Orders
    Supplier.hasMany(models.PurchaseOrder, {
      foreignKey: 'supplierId',
      as: 'purchaseOrders'
    });
  };

  return Supplier;
};
