const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
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
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      },
      field: 'department_id'
    },
    employeeCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'employee_code'
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
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
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_of_birth'
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'hire_date'
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'employees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['employee_code']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['company_id']
      },
      {
        fields: ['department_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  Employee.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  Employee.prototype.getEmploymentDuration = function() {
    const hireDate = new Date(this.hireDate);
    const today = new Date();
    const months = (today.getFullYear() - hireDate.getFullYear()) * 12 + (today.getMonth() - hireDate.getMonth());
    return months;
  };

  // Class methods
  Employee.findByCode = function(employeeCode, companyId) {
    return this.findOne({
      where: { 
        employeeCode,
        companyId 
      }
    });
  };

  Employee.findActive = function(companyId) {
    return this.findAll({
      where: { 
        isActive: true,
        companyId 
      }
    });
  };

  Employee.findByDepartment = function(departmentId) {
    return this.findAll({
      where: { departmentId }
    });
  };

  // Associations
  Employee.associate = function(models) {
    // Employee belongs to Company
    Employee.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Employee belongs to Department
    Employee.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });

    // Employee can have associated User account
    Employee.hasOne(models.User, {
      foreignKey: 'employeeId',
      as: 'user'
    });

    // Employee has many Attendance records
    Employee.hasMany(models.Attendance, {
      foreignKey: 'employeeId',
      as: 'attendance'
    });

    // Employee has many Payroll records
    Employee.hasMany(models.Payroll, {
      foreignKey: 'employeeId',
      as: 'payroll'
    });
  };

  return Employee;
};
