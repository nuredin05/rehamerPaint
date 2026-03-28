const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payroll = sequelize.define('Payroll', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id'
      },
      field: 'employee_id'
    },
    payPeriodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'pay_period_start'
    },
    payPeriodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'pay_period_end'
    },
    basicSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'basic_salary'
    },
    overtimePay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'overtime_pay'
    },
    deductions: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    bonuses: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    netSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'net_salary'
    },
    status: {
      type: DataTypes.ENUM('draft', 'approved', 'paid'),
      allowNull: false,
      defaultValue: 'draft'
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'payment_date'
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
    tableName: 'payroll',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['employee_id']
      },
      {
        fields: ['pay_period_start', 'pay_period_end']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_date']
      }
    ]
  });

  // Instance methods
  Payroll.prototype.getGrossSalary = function() {
    return this.basicSalary + this.overtimePay + this.bonuses;
  };

  Payroll.prototype.getTotalDeductions = function() {
    return this.deductions;
  };

  Payroll.prototype.calculateNetSalary = function() {
    return this.getGrossSalary() - this.getTotalDeductions();
  };

  Payroll.prototype.updateNetSalary = function() {
    this.netSalary = this.calculateNetSalary();
    return this.save();
  };

  Payroll.prototype.isPaid = function() {
    return this.status === 'paid';
  };

  Payroll.prototype.isApproved = function() {
    return ['approved', 'paid'].includes(this.status);
  };

  Payroll.prototype.getPayPeriodDescription = function() {
    const start = new Date(this.payPeriodStart);
    const end = new Date(this.payPeriodEnd);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  // Class methods
  Payroll.findByEmployee = function(employeeId, limit = 12) {
    return this.findAll({
      where: { employeeId },
      limit,
      order: [['payPeriodStart', 'DESC']],
      include: [{
        association: 'employee'
      }]
    });
  };

  Payroll.findByPeriod = function(startDate, endDate) {
    return this.findAll({
      where: {
        payPeriodStart: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      include: [{
        association: 'employee'
      }]
    });
  };

  Payroll.getPendingPayrolls = function() {
    return this.findAll({
      where: { status: 'draft' },
      include: [{
        association: 'employee'
      }]
    });
  };

  Payroll.getApprovedPayrolls = function() {
    return this.findAll({
      where: { status: 'approved' },
      include: [{
        association: 'employee'
      }]
    });
  };

  Payroll.getPaidPayrolls = function(startDate, endDate) {
    const where = { status: 'paid' };
    if (startDate && endDate) {
      where.paymentDate = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }
    
    return this.findAll({
      where,
      include: [{
        association: 'employee'
      }]
    });
  };

  Payroll.getPayrollSummary = function(startDate, endDate) {
    const where = {};
    if (startDate && endDate) {
      where.payPeriodStart = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }
    
    return this.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('basic_salary')), 'totalBasicSalary'],
        [sequelize.fn('SUM', sequelize.col('overtime_pay')), 'totalOvertimePay'],
        [sequelize.fn('SUM', sequelize.col('bonuses')), 'totalBonuses'],
        [sequelize.fn('SUM', sequelize.col('deductions')), 'totalDeductions'],
        [sequelize.fn('SUM', sequelize.col('net_salary')), 'totalNetSalary'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalEmployees']
      ]
    });
  };

  // Associations
  Payroll.associate = function(models) {
    // Payroll belongs to Employee
    Payroll.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
  };

  return Payroll;
};
