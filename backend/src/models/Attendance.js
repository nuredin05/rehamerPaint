const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkIn: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'check_in'
    },
    checkOut: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'check_out'
    },
    breakDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'break_duration'
    },
    overtimeHours: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'overtime_hours'
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'half_day'),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'attendance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['employee_id', 'date']
      },
      {
        fields: ['employee_id']
      },
      {
        fields: ['date']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Instance methods
  Attendance.prototype.getWorkHours = function() {
    if (!this.checkIn || !this.checkOut) return 0;
    
    const checkIn = new Date(`2000-01-01 ${this.checkIn}`);
    const checkOut = new Date(`2000-01-01 ${this.checkOut}`);
    
    let workHours = (checkOut - checkIn) / (1000 * 60 * 60); // Convert to hours
    workHours -= this.breakDuration / 60; // Subtract break duration
    
    return Math.max(0, workHours);
  };

  Attendance.prototype.getRegularHours = function() {
    const workHours = this.getWorkHours();
    const regularHours = Math.min(workHours, 8); // Standard 8 hours
    return Math.max(0, regularHours);
  };

  Attendance.prototype.getOvertimeHours = function() {
    const workHours = this.getWorkHours();
    return Math.max(0, workHours - 8); // Overtime after 8 hours
  };

  Attendance.prototype.isLate = function(expectedCheckIn = '09:00') {
    if (!this.checkIn) return false;
    return this.checkIn > expectedCheckIn;
  };

  Attendance.prototype.getLateMinutes = function(expectedCheckIn = '09:00') {
    if (!this.checkIn || !this.isLate(expectedCheckIn)) return 0;
    
    const expected = new Date(`2000-01-01 ${expectedCheckIn}`);
    const actual = new Date(`2000-01-01 ${this.checkIn}`);
    
    return (actual - expected) / (1000 * 60); // Convert to minutes
  };

  // Class methods
  Attendance.findByEmployee = function(employeeId, startDate, endDate) {
    const where = { employeeId };
    if (startDate && endDate) {
      where.date = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    }
    
    return this.findAll({
      where,
      order: [['date', 'DESC']],
      include: [{
        association: 'employee',
        include: [{
          association: 'user'
        }]
      }]
    });
  };

  Attendance.findByDate = function(date) {
    return this.findAll({
      where: { date },
      include: [{
        association: 'employee'
      }]
    });
  };

  Attendance.getMonthlySummary = function(employeeId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    
    return this.findAll({
      where: {
        employeeId,
        date: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
  };

  Attendance.getAbsentEmployees = function(date) {
    return this.findAll({
      where: {
        date,
        status: 'absent'
      },
      include: [{
        association: 'employee'
      }]
    });
  };

  Attendance.getLateEmployees = function(date) {
    return this.findAll({
      where: {
        date,
        status: 'late'
      },
      include: [{
        association: 'employee'
      }]
    });
  };

  // Associations
  Attendance.associate = function(models) {
    // Attendance belongs to Employee
    Attendance.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
  };

  return Attendance;
};
