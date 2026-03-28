import React, { useState } from 'react';

export const Procurement = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');

  const purchaseOrders = [
    { 
      id: 'PO-001', 
      supplier: 'ChemCo Supplies', 
      date: '2026-03-28', 
      total: 3500.00, 
      status: 'pending',
      items: 8,
      expectedDelivery: '2026-04-02'
    },
    { 
      id: 'PO-002', 
      supplier: 'Paint Materials Inc', 
      date: '2026-03-27', 
      total: 2100.00, 
      status: 'confirmed',
      items: 5,
      expectedDelivery: '2026-03-30'
    },
    { 
      id: 'PO-003', 
      supplier: 'Industrial Pigments Ltd', 
      date: '2026-03-26', 
      total: 4800.00, 
      status: 'received',
      items: 12,
      expectedDelivery: '2026-03-28'
    },
  ];

  const suppliers = [
    { 
      id: 1, 
      name: 'ChemCo Supplies', 
      email: 'orders@chemco.com', 
      phone: '+1234567890', 
      orders: 15, 
      totalSpent: 45200.00,
      rating: 4.5
    },
    { 
      id: 2, 
      name: 'Paint Materials Inc', 
      email: 'sales@paintmaterials.com', 
      phone: '+1234567891', 
      orders: 8, 
      totalSpent: 22100.00,
      rating: 4.8
    },
    { 
      id: 3, 
      name: 'Industrial Pigments Ltd', 
      email: 'info@pigmentsltd.com', 
      phone: '+1234567892', 
      orders: 12, 
      totalSpent: 38400.00,
      rating: 4.2
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-logoGold text-primaryClr',
      'confirmed': 'bg-primaryClr text-primaryClrText',
      'received': 'bg-accentClr text-white',
      'cancelled': 'bg-dangerClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        <span className="text-yellow-400">⭐</span>
        <span className="text-sm text-place ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Procurement Management</h1>
        <p className="text-place">Manage suppliers, purchase orders, and receiving</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total POs</p>
              <p className="text-2xl font-bold text-primaryClr">3</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending</p>
              <p className="text-2xl font-bold text-primaryClr">1</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">🏭</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Suppliers</p>
              <p className="text-2xl font-bold text-primaryClr">3</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Spend</p>
              <p className="text-2xl font-bold text-primaryClr">$10.4k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
        <h2 className="text-lg font-medium text-primaryClr mb-4">Purchase Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondaryClr">
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">PO ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Supplier</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((order) => (
                <tr key={order.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                  <td className="py-3 px-4">
                    <span className="font-medium text-primaryClr">{order.id}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-primaryClr">{order.supplier}</td>
                  <td className="py-3 px-4 text-sm text-place">{order.date}</td>
                  <td className="py-3 px-4 text-sm text-place">{order.items}</td>
                  <td className="py-3 px-4 text-sm font-medium text-primaryClr">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
