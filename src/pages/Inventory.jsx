import React, { useState } from 'react';

export const Inventory = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Premium Paint - White', sku: 'PNT-001', stock: 150, price: 25.99, status: 'in-stock' },
    { id: 2, name: 'Premium Paint - Blue', sku: 'PNT-002', stock: 89, price: 27.99, status: 'low-stock' },
    { id: 3, name: 'Premium Paint - Red', sku: 'PNT-003', stock: 0, price: 26.99, status: 'out-of-stock' },
    { id: 4, name: 'Primer Coat', sku: 'PRM-001', stock: 200, price: 15.99, status: 'in-stock' },
    { id: 5, name: 'Clear Varnish', sku: 'VRN-001', stock: 45, price: 22.99, status: 'in-stock' },
  ];

  const transactions = [
    { id: 1, type: 'in', product: 'Premium Paint - White', quantity: 50, date: '2026-03-28', user: 'Admin' },
    { id: 2, type: 'out', product: 'Premium Paint - Blue', quantity: 25, date: '2026-03-28', user: 'John' },
    { id: 3, type: 'in', product: 'Primer Coat', quantity: 100, date: '2026-03-27', user: 'Admin' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'in-stock': 'bg-accentClr text-white',
      'low-stock': 'bg-logoGold text-primaryClr',
      'out-of-stock': 'bg-dangerClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getTransactionType = (type) => {
    const styles = {
      'in': 'bg-accentClr text-white',
      'out': 'bg-dangerClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[type]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Inventory Management</h1>
        <p className="text-place">Manage your products, stock levels, and inventory transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Products</p>
              <p className="text-2xl font-bold text-primaryClr">5</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">In Stock</p>
              <p className="text-2xl font-bold text-primaryClr">3</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Low Stock</p>
              <p className="text-2xl font-bold text-primaryClr">1</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Out of Stock</p>
              <p className="text-2xl font-bold text-primaryClr">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('adjustments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'adjustments'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Stock Adjustments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors">
                📥 Import
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors">
                ➕ Add Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">SKU</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-primaryClr">{product.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{product.sku}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          product.stock === 0 ? 'text-dangerClr' : 
                          product.stock < 50 ? 'text-logoGold' : 'text-accentClr'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">${product.price}</td>
                      <td className="py-3 px-4">{getStatusBadge(product.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Transactions Table */}
          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">User</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">{getTransactionType(transaction.type)}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{transaction.product}</td>
                      <td className="py-3 px-4 text-sm font-medium">{transaction.quantity}</td>
                      <td className="py-3 px-4 text-sm text-place">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{transaction.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stock Adjustments */}
          {activeTab === 'adjustments' && (
            <div className="text-center py-12">
              <span className="text-4xl">🔧</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Stock Adjustments</h3>
              <p className="mt-2 text-place">Manage stock adjustments, damages, and returns</p>
              <button className="mt-4 bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors">
                New Adjustment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
