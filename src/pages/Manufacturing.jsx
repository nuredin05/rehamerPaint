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

  const billOfMaterials = [
    { 
      id: 1, 
      productName: 'Premium Paint - White', 
      component: 'Titanium Dioxide', 
      quantity: 50, 
      unit: 'kg',
      cost: 2.50,
      supplier: 'ChemCo Supplies'
    },
    { 
      id: 2, 
      productName: 'Premium Paint - White', 
      component: 'Acrylic Resin', 
      quantity: 30, 
      unit: 'kg',
      cost: 4.20,
      supplier: 'Paint Materials Inc'
    },
    { 
      id: 3, 
      productName: 'Premium Paint - Blue', 
      component: 'Blue Pigment', 
      quantity: 15, 
      unit: 'kg',
      cost: 8.75,
      supplier: 'Industrial Pigments Ltd'
    },
  ];

  const qualityChecks = [
    { 
      id: 'QC-001', 
      product: 'Premium Paint - White', 
      batch: 'B-2026-03-28-001', 
      test: 'Color Consistency', 
      result: 'pass',
      date: '2026-03-28',
      inspector: 'John Smith'
    },
    { 
      id: 'QC-002', 
      product: 'Premium Paint - Blue', 
      batch: 'B-2026-03-27-002', 
      test: 'Viscosity Test', 
      result: 'pass',
      date: '2026-03-27',
      inspector: 'Sarah Johnson'
    },
    { 
      id: 'QC-003', 
      product: 'Primer Coat', 
      batch: 'B-2026-03-26-003', 
      test: 'Drying Time', 
      result: 'fail',
      date: '2026-03-26',
      inspector: 'Mike Chen'
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
      <span className={`px-2 soda-1 text-xs font-medium rounded-full ${styles[status]}`}>
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
      <span className={`px soda-1 text-xs font-medium rounded ${styles[priority]}`}>
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

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('production')}
              classNameormal text-sm ${
                activeTab === 'production'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Production Orders
            </button>
            <button
              onClick={() => setActiveTab('bom')}
              classNameormal text-sm ${
                activeTab === 'bom'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Bill of Materials
            </button>
            <button
              onClick={() => setActiveTab('quality')}
              classNameormal text-sm ${
                activeTab === 'quality'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Quality Control
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              classNameormal text-sm ${
                activeTab === 'schedule'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Production Schedule
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search production orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sodaormal border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr sodaormal py-2 rounded-lg transition-colors">
                📊 Reports
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText sodaormal py-2 rounded-lg transition-colors">
                ➕ New Order
              </button>
            </div>
          </div>

          {/* Production Orders Table */}
          {activeTab === 'production' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="ormal sodaormal text-sm font-medium text-primaryClr">Order ID</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Product</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Quantity</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Start Date</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">End Date</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Progress</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Priority</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Status</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productionOrders.map((order) => (
                    <tr key={order.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td classNameormal sodaormal">
                        <span className="font-medium text-primaryClr">{order.id}</span>
                      </td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{order.product}</td>
                      <td classNameormal sodaormal text-sm text-place">{order.quantity}L</td>
                      <td classNameormal sodaormal text-sm text-place">{order.startDate}</td>
                      <td classNameormal sodaormal text-sm text-place">{order.endDate}</td>
                      <td classNameormal sodaormal">
                        <div className="w-24">
                          {getProgressBar(order.progress)}
                          <p className="text-xs text-place mt-1">{order.progress}%</p>
                        </div>
                      </td>
                      <td classNameormal sodaormal">{getPriorityBadge(order.priority)}</td>
                      <td classNameormal sodaormal">{getStatusBadge(order.status)}</td>
                      <td classNameormal sodaormal">
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
          )}

          {/* Bill of Materials */}
          {activeTab === 'bom' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Product</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Component</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Quantity</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Unit</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Cost/Unit</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Total Cost</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Supplier</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billOfMaterials.map((item) => (
                    <tr key={item.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td classNameormal sodaormal text-sm text-primaryClr">{item.productName}</td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{item.component}</td>
                      <td classNameormal sodaormal text-sm text-place">{item.quantity}</td>
                      <td classNameormal sodaormal text-sm text-place">{item.unit}</td>
                      <td classNameormal sodaormal text-sm font-medium text-primaryClr">${item.cost}</td>
                      <td classNameormal sodaormal text-sm font-medium text-primaryClr">${(item.quantity * item.cost).toFixed(2)}</td>
                      <td classNameormal sodaormal text-sm text-place">{item.supplier}</td>
                      <td classNameormal sodaormal">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quality Control */}
          {activeTab === 'quality' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">QC ID</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Product</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Batch</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Test</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Result</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Date</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Inspector</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityChecks.map((check) => (
                    <tr key={check.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td classNameormal sodaormal">
                        <span className="font-medium text-primaryClr">{check.id}</span>
                      </td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{check.product}</td>
                      <td classNameormal sodaormal text-sm text-place">{check.batch}</td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{check.test}</td>
                      <td classNameormal sodaormal">{getStatusBadge(check.result)}</td>
                      <td classNameormal sodaormal text-sm text-place">{check.date}</td>
                      <td classNameormal sodaormal text-sm text-place">{check.inspector}</td>
                      <td classNameormal sodaormal">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📄</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Production Schedule */}
          {activeTab === 'schedule' && (
            <div className="textormal">
              <span className="text-4xl">📅</span>
              <h3 classNameormal text-lg font-medium text-primaryClr">Production Schedule</h3>
              <p classNameormal text-place">Visual production planning and scheduling</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr sodaormal py-2 rounded-lg transition-colors">
                  Calendar View
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText sodaormal py-2 rounded-lg transition-colors">
                  Gantt Chart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
