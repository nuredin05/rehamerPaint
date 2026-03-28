const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
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
    customerCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'customer_code'
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
    creditLimit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'credit_limit'
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
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['customer_code']
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
  Customer.prototype.getCurrentBalance = function() {
    // This would be calculated from unpaid invoices
    return 0; // Placeholder
  };

  Customer.prototype.getAvailableCredit = function() {
    const currentBalance = this.getCurrentBalance();
    return Math.max(0, this.creditLimit - currentBalance);
  };

  Customer.prototype.isCreditAvailable = function(amount) {
    return this.getAvailableCredit() >= amount;
  };

  Customer.prototype.isOverCreditLimit = function() {
    return this.getCurrentBalance() > this.creditLimit;
  };

  // Class methods
  Customer.findByCode = function(customerCode, companyId) {
    return this.findOne({
      where: { 
        customerCode,
        companyId 
      }
    });
  };

  Customer.findActive = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      }
    });
  };

  Customer.findOverCreditLimit = function(companyId) {
    return this.findAll({
      where: { 
        companyId 
      },
      include: [{
        association: 'salesOrders',
        where: { status: 'delivered' },
        include: [{
          association: 'invoices',
          where: { status: ['sent', 'overdue'] }
        }]
      }]
    });
  };

  // Associations
  Customer.associate = function(models) {
    // Customer belongs to Company
    Customer.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Customer has many Sales Orders
    Customer.hasMany(models.SalesOrder, {
      foreignKey: 'customerId',
      as: 'salesOrders'
    });

    // Customer has many Invoices
    Customer.hasMany(models.Invoice, {
      foreignKey: 'customerId',
      as: 'invoices'
    });
  };

  return Customer;
};
