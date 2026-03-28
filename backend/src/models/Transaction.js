const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
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
    transactionNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'transaction_number'
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'transaction_date'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    referenceType: {
      type: DataTypes.ENUM('invoice', 'payment', 'purchase', 'expense', 'journal'),
      allowNull: false,
      field: 'reference_type'
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reference_id'
    },
    totalDebit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_debit'
    },
    totalCredit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'total_credit'
    },
    status: {
      type: DataTypes.ENUM('draft', 'posted', 'reversed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    postedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'posted_by'
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'posted_at'
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
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['transaction_number']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['transaction_date']
      },
      {
        fields: ['reference_type', 'reference_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['created_by']
      },
      {
        fields: ['posted_by']
      }
    ]
  });

  // Instance methods
  Transaction.prototype.isBalanced = function() {
    return this.totalDebit === this.totalCredit;
  };

  Transaction.prototype.isPosted = function() {
    return this.status === 'posted';
  };

  Transaction.prototype.isDraft = function() {
    return this.status === 'draft';
  };

  Transaction.prototype.canBePosted = function() {
    return this.status === 'draft' && this.isBalanced();
  };

  Transaction.prototype.canBeReversed = function() {
    return this.status === 'posted';
  };

  Transaction.prototype.post = function(postedBy) {
    if (!this.canBePosted()) {
      throw new Error('Transaction cannot be posted');
    }
    
    return this.update({
      status: 'posted',
      postedBy,
      postedAt: new Date()
    });
  };

  Transaction.prototype.reverse = function() {
    if (!this.canBeReversed()) {
      throw new Error('Transaction cannot be reversed');
    }
    
    return this.update({
      status: 'reversed'
    });
  };

  // Class methods
  Transaction.findByNumber = function(transactionNumber, companyId) {
    return this.findOne({
      where: { 
        transactionNumber,
        companyId 
      },
      include: [{
        association: 'entries',
        include: [{
          association: 'account'
        }]
      }]
    });
  };

  Transaction.findByDateRange = function(startDate, endDate, companyId) {
    return this.findAll({
      where: {
        companyId,
        transactionDate: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['transactionDate', 'DESC']],
      include: [{
        association: 'entries',
        include: [{
          association: 'account'
        }]
      }]
    });
  };

  Transaction.findByReference = function(referenceType, referenceId, companyId) {
    return this.findAll({
      where: { 
        referenceType,
        referenceId,
        companyId 
      },
      order: [['transactionDate', 'DESC']],
      include: [{
        association: 'entries',
        include: [{
          association: 'account'
        }]
      }]
    });
  };

  Transaction.getPostedTransactions = function(companyId, limit = 100) {
    return this.findAll({
      where: { 
        status: 'posted',
        companyId 
      },
      limit,
      order: [['transactionDate', 'DESC']],
      include: [{
        association: 'entries',
        include: [{
          association: 'account'
        }]
      }]
    });
  };

  Transaction.getDraftTransactions = function(companyId) {
    return this.findAll({
      where: { 
        status: 'draft',
        companyId 
      },
      order: [['transactionDate', 'ASC']],
      include: [{
        association: 'entries',
        include: [{
          association: 'account'
        }]
      }]
    });
  };

  Transaction.getTrialBalance = function(companyId, asOfDate) {
    const where = { companyId };
    if (asOfDate) {
      where.transactionDate = {
        [sequelize.Sequelize.Op.lte]: asOfDate
      };
    }
    
    return this.findAll({
      where,
      include: [{
        association: 'entries',
        include: [{
          association: 'account'
        }]
      }]
    });
  };

  // Associations
  Transaction.associate = function(models) {
    // Transaction belongs to Company
    Transaction.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Transaction belongs to PostedBy User
    Transaction.belongsTo(models.User, {
      foreignKey: 'postedBy',
      as: 'poster'
    });

    // Transaction belongs to CreatedBy User
    Transaction.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // Transaction has many Transaction Entries
    Transaction.hasMany(models.TransactionEntry, {
      foreignKey: 'transactionId',
      as: 'entries'
    });
  };

  return Transaction;
};
