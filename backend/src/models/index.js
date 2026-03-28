const { sequelize } = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');

// Import all models
const User = require('./User');
const Company = require('./Company');
const Department = require('./Department');
const Employee = require('./Employee');
const Attendance = require('./Attendance');
const Payroll = require('./Payroll');
const Warehouse = require('./Warehouse');
const Category = require('./Category');
const Unit = require('./Unit');
const Product = require('./Product');
const InventoryStock = require('./InventoryStock');
const InventoryTransaction = require('./InventoryTransaction');
const Supplier = require('./Supplier');
const Customer = require('./Customer');
const PurchaseOrder = require('./PurchaseOrder');
const SalesOrder = require('./SalesOrder');
const ChartOfAccounts = require('./ChartOfAccounts');
const Transaction = require('./Transaction');
const TransactionEntry = require('./TransactionEntry');
const Invoice = require('./Invoice');
const Vehicle = require('./Vehicle');
const DeliveryOrder = require('./DeliveryOrder');
const DeliveryTracking = require('./DeliveryTracking');
const SystemSetting = require('./SystemSetting');
const AuditLog = require('./AuditLog');

// Initialize models
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

// Setup model associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
