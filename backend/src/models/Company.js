const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255]
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
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    taxId: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['code']
      },
      {
        fields: ['name']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Class methods
  Company.findByCode = function(code) {
    return this.findOne({
      where: { code }
    });
  };

  Company.findActive = function() {
    return this.findAll({
      where: { isActive: true }
    });
  };

  // Instance methods
  Company.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Associations
  Company.associate = function(models) {
    // Company has many Users
    Company.hasMany(models.User, {
      foreignKey: 'companyId',
      as: 'users'
    });

    // Company has many Employees
    Company.hasMany(models.Employee, {
      foreignKey: 'companyId',
      as: 'employees'
    });

    // Company has many Warehouses
    Company.hasMany(models.Warehouse, {
      foreignKey: 'companyId',
      as: 'warehouses'
    });

    // Company has many Categories
    Company.hasMany(models.Category, {
      foreignKey: 'companyId',
      as: 'categories'
    });

    // Company has many Units
    Company.hasMany(models.Unit, {
      foreignKey: 'companyId',
      as: 'units'
    });

    // Company has many Products
    Company.hasMany(models.Product, {
      foreignKey: 'companyId',
      as: 'products'
    });

    // Company has many Departments
    Company.hasMany(models.Department, {
      foreignKey: 'companyId',
      as: 'departments'
    });

    // Company has many Suppliers
    Company.hasMany(models.Supplier, {
      foreignKey: 'companyId',
      as: 'suppliers'
    });

    // Company has many Customers
    Company.hasMany(models.Customer, {
      foreignKey: 'companyId',
      as: 'customers'
    });

    // Company has many Chart of Accounts
    Company.hasMany(models.ChartOfAccounts, {
      foreignKey: 'companyId',
      as: 'chartOfAccounts'
    });

    // Company has many Vehicles
    Company.hasMany(models.Vehicle, {
      foreignKey: 'companyId',
      as: 'vehicles'
    });

    // Company has many System Settings
    Company.hasMany(models.SystemSetting, {
      foreignKey: 'companyId',
      as: 'systemSettings'
    });

    // Company has many Audit Logs
    Company.hasMany(models.AuditLog, {
      foreignKey: 'companyId',
      as: 'auditLogs'
    });
  };

  return Company;
};
