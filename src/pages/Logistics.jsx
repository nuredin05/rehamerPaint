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

  const vehicles = [
    { 
      id: 'VAN-001', 
      type: 'Delivery Van', 
      licensePlate: 'ABC-123', 
      capacity: 1000,
      status: 'available',
      driver: 'Tom Wilson',
      lastMaintenance: '2026-03-01',
      nextMaintenance: '2026-04-01'
    },
    { 
      id: 'TRUCK-002', 
      type: 'Heavy Truck', 
      licensePlate: 'XYZ-456', 
      capacity: 5000,
      status: 'in-use',
      driver: 'Sarah Davis',
      lastMaintenance: '2026-02-15',
      nextMaintenance: '2026-03-15'
    },
    { 
      id: 'VAN-003', 
      type: 'Delivery Van', 
      licensePlate: 'DEF-789', 
      capacity: 1000,
      status: 'maintenance',
      driver: 'Mike Johnson',
      lastMaintenance: '2026-03-20',
      nextMaintenance: '2026-03-25'
    },
  ];

  const drivers = [
    { 
      id: 1, 
      name: 'Tom Wilson', 
      license: 'DL-001', 
      phone: '+1234567890', 
      status: 'active',
      deliveries: 45,
      rating: 4.8,
      vehicle: 'VAN-001'
    },
    { 
      id: 2, 
      name: 'Sarah Davis', 
      license: 'DL-002', 
      phone: '+1234567891', 
      status: 'active',
      deliveries: 62,
      rating: 4.9,
      vehicle: 'TRUCK-002'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      license: 'DL-003', 
      phone: '+1234567892', 
      status: 'on-leave',
      deliveries: 38,
      rating: 4.6,
      vehicle: 'VAN-003'
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
      <span className={`px soda-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
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

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('deliveries')}
              classNameormal text-sm ${
                activeTab === 'deliveries'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Deliveries
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              classNameormal text-sm ${
                activeTab === 'vehicles'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              classNameormal text-sm ${
                activeTab === 'drivers'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              classNameormal text-sm ${
                activeTab === 'tracking'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Live Tracking
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sodaormal border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr sodaormal py-2 rounded-lg transition-colors">
                📍 Route Planning
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText sodaormal py-2 rounded-lg transition-colors">
                ➕ Schedule Delivery
              </button>
            </div>
          </div>

          {/* Deliveries Table */}
          {activeTab === 'deliveries' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Delivery ID</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Customer</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Product</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Quantity</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Driver</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Vehicle</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Est. Delivery</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Status</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td classNameormal sodaormal">
                        <span className="font-medium text-primaryClr">{delivery.id}</span>
                      </td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{delivery.customer}</td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{delivery.product}</td>
                      <td classNameormal sodaormal text-sm text-place">{delivery.quantity}L</td>
                      <td classNameormal sodaormal text-sm text-place">{delivery.driver}</td>
                      <td classNameormal sodaormal text-sm text-place">{delivery.vehicle}</td>
                      <td classNameormal sodaormal text-sm text-place">{delivery.estimatedDelivery}</td>
                      <td classNameormal sodaormal">{getStatusBadge(delivery.status)}</td>
                      <td classNameormal sodaormal">
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
          )}

          {/* Vehicles Table */}
          {activeTab === 'vehicles' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Vehicle ID</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Type</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">License Plate</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Capacity</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Driver</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Next Maintenance</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Status</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td classNameormal sodaormal">
                        <span className="font-medium text-primaryClr">{vehicle.id}</span>
                      </td>
                      <td classNameormal sodaormal text-sm text-primaryClr">{vehicle.type}</td>
                      <td classNameormal sodaormal text-sm text-place">{vehicle.licensePlate}</td>
                      <td classNameormal sodaormal text-sm text-place">{vehicle.capacity}kg</td>
                      <td classNameormal sodaormal text-sm text-place">{vehicle.driver}</td>
                      <td classNameormal sodaormal text-sm text-place">{vehicle.nextMaintenance}</td>
                      <td classNameormal sodaormal">{getStatusBadge(vehicle.status)}</td>
                      <td classNameormal sodaormal">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">🔧</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📊</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Drivers Table */}
          {activeTab === 'drivers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Driver</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">License</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Phone</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Vehicle</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Deliveries</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Rating</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Status</th>
                    <th classNameormal sodaormal text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td classNameormal sodaormal">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-primaryClr">{driver.name}</span>
                        </div>
                      </td>
                      <td classNameormal sodaormal text-sm text-place">{driver.license}</td>
                      <td classNameormal sodaormal text-sm text-place">{driver.phone}</td>
                      <td classNameormal sodaormal text-sm text-place">{driver.vehicle}</td>
                      <td classNameormal sodaormal text-sm text-place">{driver.deliveries}</td>
                      <td classNameormal sodaormal">{getRatingStars(driver.rating)}</td>
                      <td classNameormal sodaormal">{getStatusBadge(driver.status)}</td>
                      <td classNameormal sodaormal">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📞</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📊</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Live Tracking */}
          {activeTab === 'tracking' && (
            <div className="textormal">
              <span className="text-4xl">📍</span>
              <h3 classNameormal text-lg font-medium text-primaryClr">Live Vehicle Tracking</h3>
              <p classNameormal text-place">Real-time GPS tracking and route monitoring</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr sodaormal soda-2 rounded-lg transition-colors">
                  🗺️ Map View
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText sodaormal soda-2 rounded-lg transition-colors">
                  📡 Live Updates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
