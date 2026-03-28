const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChartOfAccounts = sequelize.define('ChartOfAccounts', {
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
    accountCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'account_code'
    },
    accountName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'account_name'
    },
    accountType: {
      type: DataTypes.ENUM('asset', 'liability', 'equity', 'revenue', 'expense'),
      allowNull: false,
      field: 'account_type'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chart_of_accounts',
        key: 'id'
      },
      field: 'parent_id'
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
    tableName: 'chart_of_accounts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['account_code']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['parent_id']
      },
      {
        fields: ['account_type']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  ChartOfAccounts.prototype.isRootAccount = function() {
    return this.parentId === null;
  };

  ChartOfAccounts.prototype.isParentAccount = function() {
    // Check if this account has child accounts
    return ChartOfAccounts.findOne({
      where: { parentId: this.id }
    }).then(child => !!child);
  };

  ChartOfAccounts.prototype.getFullPath = async function() {
    const path = [this.accountCode + ' - ' + this.accountName];
    let current = this;
    
    while (current.parentId) {
      const parent = await ChartOfAccounts.findByPk(current.parentId);
      if (!parent) break;
      path.unshift(parent.accountCode + ' - ' + parent.accountName);
      current = parent;
    }
    
    return path.join(' > ');
  };

  ChartOfAccounts.prototype.getAccountBalance = function(startDate, endDate) {
    // This would calculate the balance from transactions
    return 0; // Placeholder
  };

  // Class methods
  ChartOfAccounts.findByCode = function(accountCode, companyId) {
    return this.findOne({
      where: { 
        accountCode,
        companyId 
      }
    });
  };

  ChartOfAccounts.findByType = function(accountType, companyId) {
    return this.findAll({
      where: { 
        accountType,
        companyId,
        isActive: true
      },
      order: [['accountCode', 'ASC']]
    });
  };

  ChartOfAccounts.findRootAccounts = function(companyId) {
    return this.findAll({
      where: { 
        parentId: null,
        companyId,
        isActive: true
      },
      order: [['accountCode', 'ASC']]
    });
  };

  ChartOfAccounts.getChildAccounts = function(parentId) {
    return this.findAll({
      where: { 
        parentId,
        isActive: true
      },
      order: [['accountCode', 'ASC']]
    });
  };

  ChartOfAccounts.getAccountTree = function(companyId) {
    return this.findAll({
      where: { 
        companyId,
        isActive: true
      },
      order: [['accountCode', 'ASC']]
    });
  };

  ChartOfAccounts.getDefaultAccounts = function() {
    return [
      {
        accountCode: '1000',
        accountName: 'Assets',
        accountType: 'asset',
        parentId: null
      },
      {
        accountCode: '1100',
        accountName: 'Current Assets',
        accountType: 'asset',
        parentId: null // Will be set to Assets account ID
      },
      {
        accountCode: '1110',
        accountName: 'Cash',
        accountType: 'asset',
        parentId: null // Will be set to Current Assets account ID
      },
      {
        accountCode: '1200',
        accountName: 'Inventory',
        accountType: 'asset',
        parentId: null // Will be set to Current Assets account ID
      },
      {
        accountCode: '2000',
        accountName: 'Liabilities',
        accountType: 'liability',
        parentId: null
      },
      {
        accountCode: '2100',
        accountName: 'Current Liabilities',
        accountType: 'liability',
        parentId: null // Will be set to Liabilities account ID
      },
      {
        accountCode: '2110',
        accountName: 'Accounts Payable',
        accountType: 'liability',
        parentId: null // Will be set to Current Liabilities account ID
      },
      {
        accountCode: '3000',
        accountName: 'Equity',
        accountType: 'equity',
        parentId: null
      },
      {
        accountCode: '3100',
        accountName: 'Capital',
        accountType: 'equity',
        parentId: null // Will be set to Equity account ID
      },
      {
        accountCode: '4000',
        accountName: 'Revenue',
        accountType: 'revenue',
        parentId: null
      },
      {
        accountCode: '4100',
        accountName: 'Sales Revenue',
        accountType: 'revenue',
        parentId: null // Will be set to Revenue account ID
      },
      {
        accountCode: '5000',
        accountName: 'Expenses',
        accountType: 'expense',
        parentId: null
      },
      {
        accountCode: '5100',
        accountName: 'Cost of Goods Sold',
        accountType: 'expense',
        parentId: null // Will be set to Expenses account ID
      },
      {
        accountCode: '5200',
        accountName: 'Operating Expenses',
        accountType: 'expense',
        parentId: null // Will be set to Expenses account ID
      }
    ];
  };

  ChartOfAccounts.initializeDefaults = function(companyId) {
    const defaultAccounts = this.getDefaultAccounts();
    
    // First create root accounts
    const rootAccounts = defaultAccounts.filter(account => account.parentId === null);
    
    return this.sequelize.transaction(async (t) => {
      const createdAccounts = {};
      
      // Create root accounts first
      for (const account of rootAccounts) {
        const created = await this.create({
          companyId,
          ...account
        }, { transaction: t });
        createdAccounts[account.accountCode] = created;
      }
      
      // Create child accounts with parent references
      const childAccounts = defaultAccounts.filter(account => account.parentId === null && 
        ['1100', '1200', '2100', '2110', '3100', '4100', '5100', '5200'].includes(account.accountCode));
      
      for (const account of childAccounts) {
        let parentId = null;
        
        // Set parent based on account code
        if (account.accountCode.startsWith('11')) {
          parentId = createdAccounts['1100']?.id;
        } else if (account.accountCode.startsWith('12')) {
          parentId = createdAccounts['1100']?.id;
        } else if (account.accountCode.startsWith('21')) {
          parentId = createdAccounts['2100']?.id;
        } else if (account.accountCode.startsWith('31')) {
          parentId = createdAccounts['3000']?.id;
        } else if (account.accountCode.startsWith('41')) {
          parentId = createdAccounts['4000']?.id;
        } else if (account.accountCode.startsWith('51')) {
          parentId = createdAccounts['5000']?.id;
        } else if (account.accountCode.startsWith('52')) {
          parentId = createdAccounts['5000']?.id;
        }
        
        if (parentId) {
          await this.create({
            companyId,
            ...account,
            parentId
          }, { transaction: t });
        }
      }
    });
  };

  // Associations
  ChartOfAccounts.associate = function(models) {
    // Chart of Accounts belongs to Company
    ChartOfAccounts.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Chart of Accounts belongs to Parent Account
    ChartOfAccounts.belongsTo(models.ChartOfAccounts, {
      foreignKey: 'parentId',
      as: 'parent'
    });

    // Chart of Accounts has many Child Accounts
    ChartOfAccounts.hasMany(models.ChartOfAccounts, {
      foreignKey: 'parentId',
      as: 'children'
    });

    // Chart of Accounts has many Transaction Entries
    ChartOfAccounts.hasMany(models.TransactionEntry, {
      foreignKey: 'accountId',
      as: 'transactionEntries'
    });
  };

  return ChartOfAccounts;
};
