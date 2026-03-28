const { sequelize } = require('../config/database');
const { Sequelize } = require('sequelize');

const Company = require('./Company')(sequelize);
const User = require('./User')(sequelize);
const Department = require('./Department')(sequelize);
const Employee = require('./Employee')(sequelize);
const Attendance = require('./Attendance')(sequelize);
const Payroll = require('./Payroll')(sequelize);
const Warehouse = require('./Warehouse')(sequelize);
const Category = require('./Category')(sequelize);
const Unit = require('./Unit')(sequelize);
const Product = require('./Product')(sequelize);
const InventoryStock = require('./InventoryStock')(sequelize);
const InventoryTransaction = require('./InventoryTransaction')(sequelize);
const Supplier = require('./Supplier')(sequelize);
const Customer = require('./Customer')(sequelize);
const PurchaseOrder = require('./PurchaseOrder')(sequelize);
const SalesOrder = require('./SalesOrder')(sequelize);
const ChartOfAccounts = require('./ChartOfAccounts')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const TransactionEntry = require('./TransactionEntry')(sequelize);
const Invoice = require('./Invoice')(sequelize);
const Vehicle = require('./Vehicle')(sequelize);
const DeliveryOrder = require('./DeliveryOrder')(sequelize);
const DeliveryTracking = require('./DeliveryTracking')(sequelize);
const SystemSetting = require('./SystemSetting')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);

const models = {
  User,
  Company,
  Department,
  Employee,
  Attendance,
  Payroll,
  Warehouse,
  Category,
  Unit,
  Product,
  InventoryStock,
  InventoryTransaction,
  Supplier,
  Customer,
  PurchaseOrder,
  SalesOrder,
  ChartOfAccounts,
  Transaction,
  TransactionEntry,
  Invoice,
  Vehicle,
  DeliveryOrder,
  DeliveryTracking,
  SystemSetting,
  AuditLog,
  sequelize,
  Sequelize
};

Object.keys(models).forEach((modelName) => {
  const Model = models[modelName];
  if (Model && typeof Model.associate === 'function') {
    Model.associate(models);
  }
});

module.exports = models;
