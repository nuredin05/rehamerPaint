import React, { useState } from 'react';

export const Manufacturing = () => {
  const [activeTab, setActiveTab] = useState('production');
  const [searchTerm, setSearchTerm] = useState('');

  const productionOrders = [
    { 
      id: 'PO-001', 
      product: 'Premium Paint - White', 
      quantity: 500, 
      startDate: '2026-03-28', 
      endDate: '2026-04-02',
      status: 'in-progress',
      progress: 65,
      priority: 'high'
    },
    { 
      id: 'PO-002', 
      product: 'Premium Paint - Blue', 
      quantity: 300, 
      startDate: '2026-03-27', 
      endDate: '2026-03-30',
      status: 'completed',
      progress: 100,
      priority: 'medium'
    },
    { 
      id: 'PO-003', 
      product: 'Primer Coat', 
      quantity: 750, 
      startDate: '2026-03-29', 
      endDate: '2026-04-05',
      status: 'pending',
      progress: 0,
      priority: 'low'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'in-progress': 'bg-primaryClr text-primaryClrText',
      'completed': 'bg-accentClr text-white',
      'pending': 'bg-logoGold text-primaryClr',
      'cancelled': 'bg-dangerClr text-white',
      'pass': 'bg-accentClr text-white',
      'fail': 'bg-dangerClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'high': 'bg-dangerClr text-white',
      'medium': 'bg-logoGold text-primaryClr',
      'low': 'bg-secondaryClr text-primaryClr'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getProgressBar = (progress) => {
    return (
      <div className="w-full bg-secondaryClr rounded-full h-2">
        <div 
          className="bg-accentClr h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Manufacturing Management</h1>
        <p className="text-place">Manage production orders, BOM, and quality control</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">🏭</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Active Orders</p>
              <p className="text-2xl font-bold text-primaryClr">1</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Completed Today</p>
              <p className="text-2xl font-bold text-primaryClr">2</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">BOM Items</p>
              <p className="text-2xl font-bold text-primaryClr">3</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">QC Checks</p>
              <p className="text-2xl font-bold text-primaryClr">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
        <h2 className="text-lg font-medium text-primaryClr mb-4">Production Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondaryClr">
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Start Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">End Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Progress</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productionOrders.map((order) => (
                <tr key={order.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                  <td className="py-3 px-4">
                    <span className="font-medium text-primaryClr">{order.id}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-primaryClr">{order.product}</td>
                  <td className="py-3 px-4 text-sm text-place">{order.quantity}L</td>
                  <td className="py-3 px-4 text-sm text-place">{order.startDate}</td>
                  <td className="py-3 px-4 text-sm text-place">{order.endDate}</td>
                  <td className="py-3 px-4">
                    <div className="w-24">
                      {getProgressBar(order.progress)}
                      <p className="text-xs text-place mt-1">{order.progress}%</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getPriorityBadge(order.priority)}</td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                      <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                      <button className="text-primaryClr hover:text-primaryClrLight">📊</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
