const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/models');
const config = require('../src/config');

/**
 * Database seeding script
 * Creates initial data for development/testing
 */

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create sample company
    const { Company } = require('../src/models');
    const company = await Company.create({
      name: 'RehamerPaint Demo Company',
      code: 'RP_DEMO',
      address: '123 Industrial Street, Addis Ababa, Ethiopia',
      phone: '+251-11-1234567',
      email: 'info@rehamerpaint.com',
      taxId: 'TX123456789'
    });
    console.log('Sample company created:', company.name);

    // Create admin user
    const { User } = require('../src/models');
    const hashedPassword = await bcrypt.hash('admin123', config.security.bcryptRounds);
    const adminUser = await User.create({
      companyId: company.id,
      username: 'admin',
      email: 'admin@rehamerpaint.com',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin'
    });
    console.log('Admin user created:', adminUser.username);

    // Create sample categories
    const { Category } = require('../src/models');
    const categories = await Category.bulkCreate([
      {
        companyId: company.id,
        name: 'Raw Materials',
        categoryType: 'raw_material',
        description: 'Paint raw materials and chemicals'
      },
      {
        companyId: company.id,
        name: 'Finished Goods',
        categoryType: 'finished_good',
        description: 'Completed paint products'
      },
      {
        companyId: company.id,
        name: 'Packaging Materials',
        categoryType: 'consumable',
        description: 'Packaging and labeling materials'
      }
    ]);
    console.log('Sample categories created:', categories.length);

    // Create sample units
    const { Unit } = require('../src/models');
    const units = await Unit.bulkCreate([
      { companyId: company.id, name: 'Kilogram', code: 'kg' },
      { companyId: company.id, name: 'Liter', code: 'l' },
      { companyId: company.id, name: 'Piece', code: 'pcs' },
      { companyId: company.id, name: 'Gallon', code: 'gal' }
    ]);
    console.log('Sample units created:', units.length);

    // Create sample products
    const { Product } = require('../src/models');
    const products = await Product.bulkCreate([
      {
        companyId: company.id,
        categoryId: categories[0].id,
        unitId: units[0].id,
        sku: 'RM001',
        name: 'Titanium Dioxide',
        description: 'White pigment for paint manufacturing',
        productType: 'raw_material',
        reorderLevel: 100,
        standardCost: 5.50,
        weight: 1.0
      },
      {
        companyId: company.id,
        categoryId: categories[0].id,
        unitId: units[0].id,
        sku: 'RM002',
        name: 'Acrylic Resin',
        description: 'Binder for water-based paints',
        productType: 'raw_material',
        reorderLevel: 50,
        standardCost: 8.75,
        weight: 1.2
      },
      {
        companyId: company.id,
        categoryId: categories[1].id,
        unitId: units[3].id,
        sku: 'FG001',
        name: 'Premium Interior Paint',
        description: 'High-quality interior wall paint',
        productType: 'finished_good',
        reorderLevel: 20,
        sellingPrice: 45.00,
        weight: 8.5
      },
      {
        companyId: company.id,
        categoryId: categories[1].id,
        unitId: units[3].id,
        sku: 'FG002',
        name: 'Exterior Weatherproof Paint',
        description: 'Durable exterior paint for all weather conditions',
        productType: 'finished_good',
        reorderLevel: 15,
        sellingPrice: 55.00,
        weight: 9.0
      }
    ]);
    console.log('Sample products created:', products.length);

    // Create sample warehouse
    const { Warehouse } = require('../src/models');
    const warehouse = await Warehouse.create({
      companyId: company.id,
      name: 'Main Warehouse',
      code: 'WH001',
      address: 'Warehouse Complex, Addis Ababa',
      capacity: 10000,
      managerId: adminUser.id
    });
    console.log('Sample warehouse created:', warehouse.name);

    // Create sample inventory stocks
    const { InventoryStock } = require('../src/models');
    const stocks = await InventoryStock.bulkCreate([
      {
        productId: products[0].id,
        warehouseId: warehouse.id,
        quantity: 250
      },
      {
        productId: products[1].id,
        warehouseId: warehouse.id,
        quantity: 120
      },
      {
        productId: products[2].id,
        warehouseId: warehouse.id,
        quantity: 45
      },
      {
        productId: products[3].id,
        warehouseId: warehouse.id,
        quantity: 30
      }
    ]);
    console.log('Sample inventory stocks created:', stocks.length);

    // Create sample department
    const { Department } = require('../src/models');
    const department = await Department.create({
      companyId: company.id,
      name: 'Production',
      description: 'Paint production department',
      managerId: adminUser.id
    });
    console.log('Sample department created:', department.name);

    // Create sample employee
    const { Employee } = require('../src/models');
    const employee = await Employee.create({
      companyId: company.id,
      departmentId: department.id,
      employeeCode: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@rehamerpaint.com',
      position: 'Production Manager',
      salary: 15000.00,
      hireDate: '2023-01-15'
    });
    console.log('Sample employee created:', employee.firstName, employee.lastName);

    // Create sample supplier
    const { Supplier } = require('../src/models');
    const supplier = await Supplier.create({
      companyId: company.id,
      supplierCode: 'SUP001',
      name: 'Chemical Suppliers Ltd',
      contactPerson: 'Michael Johnson',
      email: 'michael@chemicalsuppliers.com',
      phone: '+251-11-9876543',
      address: 'Industrial Zone, Addis Ababa',
      paymentTerms: 'Net 30 days'
    });
    console.log('Sample supplier created:', supplier.name);

    // Create sample customer
    const { Customer } = require('../src/models');
    const customer = await Customer.create({
      companyId: company.id,
      customerCode: 'CUST001',
      name: 'ABC Construction Company',
      contactPerson: 'Sarah Williams',
      email: 'sarah@abcconstruction.com',
      phone: '+251-11-5556666',
      address: 'Business District, Addis Ababa',
      creditLimit: 100000.00,
      paymentTerms: 'Net 15 days'
    });
    console.log('Sample customer created:', customer.name);

    // Create sample chart of accounts
    const { ChartOfAccounts } = require('../src/models');
    const accounts = await ChartOfAccounts.bulkCreate([
      {
        companyId: company.id,
        accountCode: '1000',
        accountName: 'Cash',
        accountType: 'asset'
      },
      {
        companyId: company.id,
        accountCode: '1200',
        accountName: 'Inventory',
        accountType: 'asset'
      },
      {
        companyId: company.id,
        accountCode: '2000',
        accountName: 'Accounts Payable',
        accountType: 'liability'
      },
      {
        companyId: company.id,
        accountCode: '4000',
        accountName: 'Sales Revenue',
        accountType: 'revenue'
      },
      {
        companyId: company.id,
        accountCode: '5000',
        accountName: 'Cost of Goods Sold',
        accountType: 'expense'
      }
    ]);
    console.log('Sample chart of accounts created:', accounts.length);

    // Create sample vehicle
    const { Vehicle } = require('../src/models');
    const vehicle = await Vehicle.create({
      companyId: company.id,
      vehicleNumber: 'VH001',
      vehicleType: 'truck',
      capacity: 1000,
      driverName: 'Ali Ahmed',
      driverPhone: '+251-91-1234567'
    });
    console.log('Sample vehicle created:', vehicle.vehicleNumber);

    // Create system settings
    const { SystemSetting } = require('../src/models');
    const settings = await SystemSetting.bulkCreate([
      {
        companyId: company.id,
        settingKey: 'company_name',
        settingValue: company.name,
        description: 'Company name display'
      },
      {
        companyId: company.id,
        settingKey: 'default_currency',
        settingValue: 'ETB',
        description: 'Default currency code'
      },
      {
        companyId: company.id,
        settingKey: 'tax_rate',
        settingValue: '15',
        description: 'Default tax rate percentage'
      }
    ]);
    console.log('Sample system settings created:', settings.length);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🌐 API Documentation: http://localhost:3000/api-docs');
    console.log('🏥 Health Check: http://localhost:3000/health');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
