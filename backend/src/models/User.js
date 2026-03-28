const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
      }
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 100],
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
      validate: {
        len: [1, 100]
      }
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
      validate: {
        len: [1, 100]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'operator', 'viewer'),
      allowNull: false,
      defaultValue: 'operator'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified'
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email_verification_token'
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'password_reset_token'
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'password_reset_expires'
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'login_attempts'
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'locked_until'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, config.security.bcryptRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, config.security.bcryptRounds);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.passwordHash;
    delete values.emailVerificationToken;
    delete values.passwordResetToken;
    delete values.passwordResetExpires;
    delete values.loginAttempts;
    delete values.lockedUntil;
    return values;
  };

  User.prototype.isLocked = function() {
    return !!(this.lockedUntil && this.lockedUntil > Date.now());
  };

  User.prototype.incrementLoginAttempts = async function() {
    const maxAttempts = 5;
    const lockTime = 30 * 60 * 1000; // 30 minutes

    // If we have a previous lock that has expired, restart at 1
    if (this.lockedUntil && this.lockedUntil < Date.now()) {
      return this.update({
        loginAttempts: 1,
        lockedUntil: null
      });
    }

    const updates = { loginAttempts: this.loginAttempts + 1 };
    
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
      updates.lockedUntil = new Date(Date.now() + lockTime);
    }

    return this.update(updates);
  };

  User.prototype.resetLoginAttempts = async function() {
    return this.update({
      loginAttempts: 0,
      lockedUntil: null
    });
  };

  // Class methods
  User.findByEmailOrUsername = function(identifier) {
    return this.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });
  };

  User.findActiveById = function(id) {
    return this.findOne({
      where: {
        id,
        isActive: true
      }
    });
  };

  // Associations
  User.associate = function(models) {
    // User belongs to Company
    User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // User can manage Department (as manager)
    User.hasMany(models.Department, {
      foreignKey: 'managerId',
      as: 'managedDepartments'
    });

    // User has Employee record
    User.hasOne(models.Employee, {
      foreignKey: 'userId',
      as: 'employee'
    });

    // User creates many records
    User.hasMany(models.PurchaseOrder, {
      foreignKey: 'createdBy',
      as: 'createdPurchaseOrders'
    });

    User.hasMany(models.SalesOrder, {
      foreignKey: 'createdBy',
      as: 'createdSalesOrders'
    });

    User.hasMany(models.ProductionOrder, {
      foreignKey: 'createdBy',
      as: 'createdProductionOrders'
    });

    User.hasMany(models.Transaction, {
      foreignKey: 'createdBy',
      as: 'createdTransactions'
    });

    User.hasMany(models.Invoice, {
      foreignKey: 'createdBy',
      as: 'createdInvoices'
    });

    User.hasMany(models.DeliveryOrder, {
      foreignKey: 'createdBy',
      as: 'createdDeliveryOrders'
    });

    User.hasMany(models.QualityTest, {
      foreignKey: 'testedBy',
      as: 'qualityTests'
    });

    User.hasMany(models.ProductionBatch, {
      foreignKey: 'createdBy',
      as: 'createdProductionBatches'
    });

    User.hasMany(models.InventoryTransaction, {
      foreignKey: 'createdBy',
      as: 'createdInventoryTransactions'
    });

    User.hasMany(models.AuditLog, {
      foreignKey: 'userId',
      as: 'auditLogs'
    });
  };

  return User;
};
