import React, { useState } from 'react';

export const Logistics = () => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [searchTerm, setSearchTerm] = useState('');

  const deliveries = [
    { 
      id: 'DEL-001', 
      customer: 'ABC Construction', 
      product: 'Premium Paint - White', 
      quantity: 50,
      date: '2026-03-28',
      status: 'in-transit',
      driver: 'Tom Wilson',
      vehicle: 'VAN-001',
      estimatedDelivery: '2026-03-28 14:00'
    },
    { 
      id: 'DEL-002', 
      customer: 'XYZ Homes', 
      product: 'Premium Paint - Blue', 
      quantity: 25,
      date: '2026-03-28',
      status: 'delivered',
      driver: 'Sarah Davis',
      vehicle: 'TRUCK-002',
      estimatedDelivery: '2026-03-28 16:00'
    },
    { 
      id: 'DEL-003', 
      customer: 'BuildRight Inc', 
      product: 'Primer Coat', 
      quantity: 100,
      date: '2026-03-29',
      status: 'scheduled',
      driver: 'Mike Johnson',
      vehicle: 'VAN-003',
      estimatedDelivery: '2026-03-29 10:00'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'in-transit': 'bg-primaryClr text-primaryClrText',
      'delivered': 'bg-accentClr text-white',
      'scheduled': 'bg-logoGold text-primaryClr',
      'cancelled': 'bg-dangerClr text-white',
      'available': 'bg-accentClr text-white',
      'in-use': 'bg-primaryClr text-primaryClrText',
      'maintenance': 'bg-dangerClr text-white',
      'active': 'bg-accentClr text-white',
      'on-leave': 'bg-logoGold text-primaryClr'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Logistics Management</h1>
        <p className="text-place">Manage deliveries, vehicles, and driver operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">🚚</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Active Deliveries</p>
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
              <p className="text-sm text-place">Delivered Today</p>
              <p className="text-2xl font-bold text-primaryClr">2</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">🚐</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Vehicles</p>
              <p className="text-2xl font-bold text-primaryClr">3</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">👨‍✈️</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Active Drivers</p>
              <p className="text-2xl font-bold text-primaryClr">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
        <h2 className="text-lg font-medium text-primaryClr mb-4">Active Deliveries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondaryClr">
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Delivery ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Driver</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Vehicle</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Est. Delivery</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                  <td className="py-3 px-4">
                    <span className="font-medium text-primaryClr">{delivery.id}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-primaryClr">{delivery.customer}</td>
                  <td className="py-3 px-4 text-sm text-primaryClr">{delivery.product}</td>
                  <td className="py-3 px-4 text-sm text-place">{delivery.quantity}L</td>
                  <td className="py-3 px-4 text-sm text-place">{delivery.driver}</td>
                  <td className="py-3 px-4 text-sm text-place">{delivery.vehicle}</td>
                  <td className="py-3 px-4 text-sm text-place">{delivery.estimatedDelivery}</td>
                  <td className="py-3 px-4">{getStatusBadge(delivery.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                      <button className="text-primaryClr hover:text-primaryClrLight">📍</button>
                      <button className="text-primaryClr hover:text-primaryClrLight">📞</button>
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
