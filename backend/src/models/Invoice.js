const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
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
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'invoice_number'
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      },
      field: 'customer_id'
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id'
      },
      field: 'supplier_id'
    },
    invoiceType: {
      type: DataTypes.ENUM('sales', 'purchase'),
      allowNull: false,
      field: 'invoice_type'
    },
    invoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'invoice_date'
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'due_date'
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
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
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_amount'
    },
    paidAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'paid_amount'
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'balance_amount'
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
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['invoice_number']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['customer_id']
      },
      {
        fields: ['supplier_id']
      },
      {
        fields: ['invoice_type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['invoice_date']
      },
      {
        fields: ['due_date']
      }
    ]
  });

  // Instance methods
  Invoice.prototype.getOutstandingBalance = function() {
    return this.totalAmount - this.paidAmount;
  };

  Invoice.prototype.isPaid = function() {
    return this.paidAmount >= this.totalAmount;
  };

  Invoice.prototype.isOverdue = function() {
    if (this.isPaid()) return false;
    return new Date() > new Date(this.dueDate);
  };

  Invoice.prototype.getDaysOverdue = function() {
    if (!this.isOverdue()) return 0;
    const today = new Date();
    const dueDate = new Date(this.dueDate);
    return Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
  };

  Invoice.prototype.canBePaid = function() {
    return !this.isPaid() && !['draft', 'cancelled'].includes(this.status);
  };

  Invoice.prototype.addPayment = function(amount) {
    const newPaidAmount = this.paidAmount + amount;
    const newBalanceAmount = Math.max(0, this.totalAmount - newPaidAmount);
    
    const newStatus = newBalanceAmount === 0 ? 'paid' : 
                      (this.isOverdue() ? 'overdue' : 'sent');
    
    return this.update({
      paidAmount: newPaidAmount,
      balanceAmount: newBalanceAmount,
      status: newStatus
    });
  };

  // Class methods
  Invoice.findByNumber = function(invoiceNumber, companyId) {
    return this.findOne({
      where: { 
        invoiceNumber,
        companyId 
      }
    });
  };

  Invoice.findByCustomer = function(customerId, limit = 50) {
    return this.findAll({
      where: { customerId },
      limit,
      order: [['invoiceDate', 'DESC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  Invoice.findBySupplier = function(supplierId, limit = 50) {
    return this.findAll({
      where: { supplierId },
      limit,
      order: [['invoiceDate', 'DESC']],
      include: [{
        association: 'supplier'
      }]
    });
  };

  Invoice.findByType = function(invoiceType, companyId) {
    return this.findAll({
      where: { 
        invoiceType,
        companyId 
      },
      order: [['invoiceDate', 'DESC']]
    });
  };

  Invoice.getOverdueInvoices = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        status: 'overdue'
      },
      order: [['dueDate', 'ASC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  Invoice.getUnpaidInvoices = function(companyId) {
    return this.findAll({
      where: {
        companyId,
        balanceAmount: {
          [sequelize.Sequelize.Op.gt]: 0
        }
      },
      order: [['dueDate', 'ASC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  Invoice.getSalesInvoices = function(companyId, startDate, endDate) {
    const where = { 
      companyId,
      invoiceType: 'sales'
    };
    
    if (startDate && endDate) {
      where.invoiceDate = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }
    
    return this.findAll({
      where,
      order: [['invoiceDate', 'DESC']],
      include: [{
        association: 'customer'
      }]
    });
  };

  Invoice.getPurchaseInvoices = function(companyId, startDate, endDate) {
    const where = { 
      companyId,
      invoiceType: 'purchase'
    };
    
    if (startDate && endDate) {
      where.invoiceDate = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }
    
    return this.findAll({
      where,
      order: [['invoiceDate', 'DESC']],
      include: [{
        association: 'supplier'
      }]
    });
  };

  // Associations
  Invoice.associate = function(models) {
    // Invoice belongs to Company
    Invoice.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Invoice belongs to Customer (for sales invoices)
    Invoice.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });

    // Invoice belongs to Supplier (for purchase invoices)
    Invoice.belongsTo(models.Supplier, {
      foreignKey: 'supplierId',
      as: 'supplier'
    });

    // Invoice belongs to Creator (User)
    Invoice.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return Invoice;
};
