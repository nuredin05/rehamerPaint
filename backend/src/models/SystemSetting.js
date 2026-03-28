const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SystemSetting = sequelize.define('SystemSetting', {
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
    settingKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'setting_key'
    },
    settingValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'setting_value'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'updated_by'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'system_settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['company_id', 'setting_key']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['setting_key']
      }
    ]
  });

  // Instance methods
  SystemSetting.prototype.getBooleanValue = function() {
    return this.settingValue === 'true' || this.settingValue === '1';
  };

  SystemSetting.prototype.getNumberValue = function() {
    const value = parseFloat(this.settingValue);
    return isNaN(value) ? 0 : value;
  };

  SystemSetting.prototype.getJsonValue = function() {
    try {
      return JSON.parse(this.settingValue || '{}');
    } catch (error) {
      return {};
    }
  };

  SystemSetting.prototype.getValueAsType = function(type) {
    switch (type) {
      case 'boolean':
        return this.getBooleanValue();
      case 'number':
        return this.getNumberValue();
      case 'json':
        return this.getJsonValue();
      default:
        return this.settingValue;
    }
  };

  // Class methods
  SystemSetting.findByKey = function(companyId, settingKey) {
    return this.findOne({
      where: { companyId, settingKey }
    });
  };

  SystemSetting.getValue = function(companyId, settingKey, defaultValue = null) {
    return this.findByKey(companyId, settingKey).then(setting => {
      return setting ? setting.settingValue : defaultValue;
    });
  };

  SystemSetting.getBooleanValue = function(companyId, settingKey, defaultValue = false) {
    return this.getValue(companyId, settingKey, defaultValue.toString()).then(value => {
      return value === 'true' || value === '1';
    });
  };

  SystemSetting.getNumberValue = function(companyId, settingKey, defaultValue = 0) {
    return this.getValue(companyId, settingKey, defaultValue.toString()).then(value => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    });
  };

  SystemSetting.getJsonValue = function(companyId, settingKey, defaultValue = {}) {
    return this.getValue(companyId, settingKey, JSON.stringify(defaultValue)).then(value => {
      try {
        return JSON.parse(value || '{}');
      } catch (error) {
        return defaultValue;
      }
    });
  };

  SystemSetting.setValue = function(companyId, settingKey, settingValue, updatedBy = null) {
    return this.upsert({
      companyId,
      settingKey,
      settingValue,
      updatedBy
    });
  };

  SystemSetting.getAllSettings = function(companyId) {
    return this.findAll({
      where: { companyId },
      order: [['settingKey', 'ASC']]
    });
  };

  SystemSetting.getSettingsByCategory = function(companyId, category) {
    return this.findAll({
      where: {
        companyId,
        settingKey: {
          [sequelize.Sequelize.Op.like]: `${category}_%`
        }
      },
      order: [['settingKey', 'ASC']]
    });
  };

  SystemSetting.deleteSetting = function(companyId, settingKey) {
    return this.destroy({
      where: { companyId, settingKey }
    });
  };

  SystemSetting.getDefaultSettings = function() {
    return [
      {
        settingKey: 'company_name',
        settingValue: '',
        description: 'Company name display'
      },
      {
        settingKey: 'company_address',
        settingValue: '',
        description: 'Company address'
      },
      {
        settingKey: 'company_phone',
        settingValue: '',
        description: 'Company phone number'
      },
      {
        settingKey: 'company_email',
        settingValue: '',
        description: 'Company email address'
      },
      {
        settingKey: 'default_currency',
        settingValue: 'ETB',
        description: 'Default currency code'
      },
      {
        settingKey: 'tax_rate',
        settingValue: '15',
        description: 'Default tax rate percentage'
      },
      {
        settingKey: 'working_hours_start',
        settingValue: '09:00',
        description: 'Standard working hours start time'
      },
      {
        settingKey: 'working_hours_end',
        settingValue: '18:00',
        description: 'Standard working hours end time'
      },
      {
        settingKey: 'overtime_rate',
        settingValue: '1.5',
        description: 'Overtime pay rate multiplier'
      },
      {
        settingKey: 'email_notifications',
        settingValue: 'true',
        description: 'Enable email notifications'
      },
      {
        settingKey: 'backup_frequency',
        settingValue: 'daily',
        description: 'Database backup frequency'
      },
      {
        settingKey: 'session_timeout',
        settingValue: '30',
        description: 'User session timeout in minutes'
      }
    ];
  };

  SystemSetting.initializeDefaults = function(companyId, updatedBy = null) {
    const defaultSettings = this.getDefaultSettings();
    const settingsToCreate = defaultSettings.map(setting => ({
      companyId,
      updatedBy,
      ...setting
    }));
    
    return this.bulkCreate(settingsToCreate, {
      ignoreDuplicates: true
    });
  };

  // Associations
  SystemSetting.associate = function(models) {
    // SystemSetting belongs to Company
    SystemSetting.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // SystemSetting belongs to UpdatedBy User
    SystemSetting.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  };

  return SystemSetting;
};
