const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Unit = sequelize.define('Unit', {
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
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 20]
      }
    },
    baseUnitId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'units',
        key: 'id'
      },
      field: 'base_unit_id'
    },
    conversionFactor: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      defaultValue: 1,
      field: 'conversion_factor'
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
    tableName: 'units',
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
        fields: ['base_unit_id']
      }
    ]
  });

  // Instance methods
  Unit.prototype.isBaseUnit = function() {
    return this.baseUnitId === null;
  };

  Unit.prototype.convertToBase = function(quantity) {
    return quantity * this.conversionFactor;
  };

  Unit.prototype.convertFromBase = function(baseQuantity) {
    if (this.conversionFactor === 0) return 0;
    return baseQuantity / this.conversionFactor;
  };

  Unit.prototype.convertTo = function(quantity, targetUnit) {
    // Convert to base unit first
    const baseQuantity = this.convertToBase(quantity);
    
    // Then convert from base to target
    return targetUnit.convertFromBase(baseQuantity);
  };

  // Class methods
  Unit.findByCode = function(code, companyId) {
    return this.findOne({
      where: { 
        code,
        companyId 
      }
    });
  };

  Unit.findBaseUnits = function(companyId) {
    return this.findAll({
      where: { 
        baseUnitId: null,
        companyId 
      }
    });
  };

  Unit.findSubUnits = function(baseUnitId) {
    return this.findAll({
      where: { baseUnitId }
    });
  };

  // Associations
  Unit.associate = function(models) {
    // Unit belongs to Company
    Unit.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Unit belongs to Base Unit
    Unit.belongsTo(models.Unit, {
      foreignKey: 'baseUnitId',
      as: 'baseUnit'
    });

    // Unit has many Sub Units
    Unit.hasMany(models.Unit, {
      foreignKey: 'baseUnitId',
      as: 'subUnits'
    });

    // Unit has many Products
    Unit.hasMany(models.Product, {
      foreignKey: 'unitId',
      as: 'products'
    });
  };

  return Unit;
};
