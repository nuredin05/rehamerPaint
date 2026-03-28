const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransactionEntry = sequelize.define('TransactionEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id'
      },
      field: 'transaction_id'
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chart_of_accounts',
        key: 'id'
      },
      field: 'account_id'
    },
    debitAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'debit_amount'
    },
    creditAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'credit_amount'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'transaction_entries',
    timestamps: false,
    indexes: [
      {
        fields: ['transaction_id']
      },
      {
        fields: ['account_id']
      },
      {
        fields: ['debit_amount']
      },
      {
        fields: ['credit_amount']
      }
    ]
  });

  // Instance methods
  TransactionEntry.prototype.getAmount = function() {
    return this.debitAmount || this.creditAmount;
  };

  TransactionEntry.prototype.isDebit = function() {
    return this.debitAmount > 0;
  };

  TransactionEntry.prototype.isCredit = function() {
    return this.creditAmount > 0;
  };

  TransactionEntry.prototype.getAccountType = function() {
    return this.account ? this.account.accountType : null;
  };

  // Class methods
  TransactionEntry.findByAccount = function(accountId, limit = 100) {
    return this.findAll({
      where: { accountId },
      limit,
      order: [['id', 'DESC']],
      include: [{
        association: 'transaction',
        include: [{
          association: 'entries',
          include: [{
            association: 'account'
          }]
        }]
      }]
    });
  };

  TransactionEntry.getAccountBalance = function(accountId, asOfDate) {
    const where = { accountId };
    
    if (asOfDate) {
      where['$transaction.transactionDate$'] = {
        [sequelize.Sequelize.Op.lte]: asOfDate
      };
    }
    
    return this.findAll({
      where,
      include: [{
        association: 'transaction',
        where: asOfDate ? {
          transactionDate: {
            [sequelize.Sequelize.Op.lte]: asOfDate
          }
        } : undefined,
        required: true
      }]
    });
  };

  TransactionEntry.getTrialBalance = function(companyId, asOfDate) {
    const where = {};
    
    if (asOfDate) {
      where['$transaction.transactionDate$'] = {
        [sequelize.Sequelize.Op.lte]: asOfDate
      };
    }
    
    return this.findAll({
      where,
      include: [{
        association: 'transaction',
        where: {
          companyId,
          status: 'posted',
          ...(asOfDate && {
            transactionDate: {
              [sequelize.Sequelize.Op.lte]: asOfDate
            }
          })
        },
        required: true
      }, {
        association: 'account',
        where: { isActive: true },
        required: true
      }]
    });
  };

  TransactionEntry.getIncomeStatement = function(companyId, startDate, endDate) {
    return this.findAll({
      include: [{
        association: 'transaction',
        where: {
          companyId,
          status: 'posted',
          transactionDate: {
            [sequelize.Sequelize.Op.between]: [startDate, endDate]
          }
        },
        required: true
      }, {
        association: 'account',
        where: {
          accountType: {
            [sequelize.Sequelize.Op.in]: ['revenue', 'expense']
          },
          isActive: true
        },
        required: true
      }]
    });
  };

  TransactionEntry.getBalanceSheet = function(companyId, asOfDate) {
    return this.findAll({
      include: [{
        association: 'transaction',
        where: {
          companyId,
          status: 'posted',
          transactionDate: {
            [sequelize.Sequelize.Op.lte]: asOfDate
          }
        },
        required: true
      }, {
        association: 'account',
        where: {
          accountType: {
            [sequelize.Sequelize.Op.in]: ['asset', 'liability', 'equity']
          },
          isActive: true
        },
        required: true
      }]
    });
  };

  // Associations
  TransactionEntry.associate = function(models) {
    // TransactionEntry belongs to Transaction
    TransactionEntry.belongsTo(models.Transaction, {
      foreignKey: 'transactionId',
      as: 'transaction'
    });

    // TransactionEntry belongs to Account
    TransactionEntry.belongsTo(models.ChartOfAccounts, {
      foreignKey: 'accountId',
      as: 'account'
    });
  };

  return TransactionEntry;
};
