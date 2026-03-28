const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tableName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'table_name'
    },
    recordId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'record_id'
    },
    oldValues: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'old_values'
    },
    newValues: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'new_values'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'ip_address'
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['company_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['action']
      },
      {
        fields: ['table_name']
      },
      {
        fields: ['record_id']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['ip_address']
      }
    ]
  });

  // Instance methods
  AuditLog.prototype.getActionDescription = function() {
    const actionDescriptions = {
      'CREATE': 'Created new record',
      'UPDATE': 'Updated record',
      'DELETE': 'Deleted record',
      'LOGIN': 'User login',
      'LOGOUT': 'User logout',
      'PASSWORD_CHANGE': 'Password changed',
      'ROLE_CHANGE': 'Role changed',
      'EXPORT': 'Data exported',
      'IMPORT': 'Data imported'
    };
    return actionDescriptions[this.action] || this.action;
  };

  AuditLog.prototype.getChangesSummary = function() {
    if (!this.oldValues || !this.newValues) return null;
    
    const changes = [];
    const keys = new Set([...Object.keys(this.oldValues), ...Object.keys(this.newValues)]);
    
    for (const key of keys) {
      const oldValue = this.oldValues[key];
      const newValue = this.newValues[key];
      
      if (oldValue !== newValue) {
        changes.push({
          field: key,
          oldValue,
          newValue
        });
      }
    }
    
    return changes;
  };

  // Class methods
  AuditLog.findByUser = function(userId, limit = 100) {
    return this.findAll({
      where: { userId },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });
  };

  AuditLog.findByTable = function(tableName, limit = 100) {
    return this.findAll({
      where: { tableName },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  AuditLog.findByDateRange = function(startDate, endDate, limit = 100) {
    return this.findAll({
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  AuditLog.findByAction = function(action, limit = 100) {
    return this.findAll({
      where: { action },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  AuditLog.getRecentActivity = function(companyId, limit = 50) {
    return this.findAll({
      where: { companyId },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  };

  AuditLog.getSecurityEvents = function(companyId, limit = 100) {
    const securityActions = ['LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'ROLE_CHANGE'];
    
    return this.findAll({
      where: {
        companyId,
        action: {
          [sequelize.Sequelize.Op.in]: securityActions
        }
      },
      limit,
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });
  };

  AuditLog.getFailedLogins = function(companyId, hours = 24) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);
    
    return this.findAll({
      where: {
        companyId,
        action: 'LOGIN_FAILED',
        createdAt: {
          [sequelize.Sequelize.Op.gte]: startDate
        }
      },
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });
  };

  // Associations
  AuditLog.associate = function(models) {
    // AuditLog belongs to Company
    AuditLog.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // AuditLog belongs to User
    AuditLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return AuditLog;
};
