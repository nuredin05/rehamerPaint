import React, { useState } from 'react';

export const Sales = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    { 
      id: 'SO-001', 
      customer: 'ABC Construction', 
      date: '2026-03-28', 
      total: 1250.00, 
      status: 'pending',
      items: 5
    },
    { 
      id: 'SO-002', 
      customer: 'XYZ Homes', 
      date: '2026-03-28', 
      total: 890.50, 
      status: 'confirmed',
      items: 3
    },
    { 
      id: 'SO-003', 
      customer: 'BuildRight Inc', 
      date: '2026-03-27', 
      total: 2100.00, 
      status: 'shipped',
      items: 8
    },
    { 
      id: 'SO-004', 
      customer: 'ColorPro Painters', 
      date: '2026-03-27', 
      total: 450.75, 
      status: 'delivered',
      items: 2
    },
  ];

  const customers = [
    { id: 1, name: 'ABC Construction', email: 'contact@abc.com', phone: '+1234567890', orders: 12, totalSpent: 15420.00 },
    { id: 2, name: 'XYZ Homes', email: 'info@xyzhomes.com', phone: '+1234567891', orders: 8, totalSpent: 8950.00 },
    { id: 3, name: 'BuildRight Inc', email: 'sales@buildright.com', phone: '+1234567892', orders: 15, totalSpent: 22100.00 },
    { id: 4, name: 'ColorPro Painters', email: 'hello@colorpro.com', phone: '+1234567893', orders: 6, totalSpent: 5400.00 },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-logoGold text-primaryClr',
      'confirmed': 'bg-primaryClr text-primaryClrText',
      'shipped': 'bg-accentClr text-white',
      'delivered': 'bg-accentClrDark text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Sales Management</h1>
        <p className="text-place">Manage customers, sales orders, and invoicing</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Orders</p>
              <p className="text-2xl font-bold text-primaryClr">4</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Revenue</p>
              <p className="text-2xl font-bold text-primaryClr">$4,691</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Customers</p>
              <p className="text-2xl font-bold text-primaryClr">4</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending</p>
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
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Sales Orders
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Invoices
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors">
                📊 Reports
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors">
                ➕ New Order
              </button>
            </div>
          </div>

          {/* Orders Table */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{order.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{order.customer}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.items}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">🖨️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customers Table */}
          {activeTab === 'customers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Orders</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Total Spent</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-primaryClr">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{customer.email}</td>
                      <td className="py-3 px-4 text-sm text-place">{customer.phone}</td>
                      <td className="py-3 px-4 text-sm text-place">{customer.orders}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${customer.totalSpent.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📧</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Invoices */}
          {activeTab === 'invoices' && (
            <div className="text-center py-12">
              <span className="text-4xl">🧾</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Invoice Management</h3>
              <p className="mt-2 text-place">Generate, track, and manage customer invoices</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors">
                  Generate Invoice
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors">
                  View All Invoices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
