const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Department = sequelize.define('Department', {
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
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'manager_id'
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
    tableName: 'departments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['company_id']
      },
      {
        fields: ['manager_id']
      },
      {
        fields: ['name']
      }
    ]
  });

  // Class methods
  Department.findByCompany = function(companyId) {
    return this.findAll({
      where: { companyId }
    });
  };

  // Associations
  Department.associate = function(models) {
    // Department belongs to Company
    Department.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Department belongs to Manager (User)
    Department.belongsTo(models.User, {
      foreignKey: 'managerId',
      as: 'manager'
    });

    // Department has many Employees
    Department.hasMany(models.Employee, {
      foreignKey: 'departmentId',
      as: 'employees'
    });
  };

  return Department;
};
