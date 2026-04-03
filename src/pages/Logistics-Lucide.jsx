import React, { useState } from 'react';
import apiService from '../services/api';
import {
  Truck,
  MapPin,
  Navigation,
  Package,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Printer,
  Fuel,
  Wrench,
  X,
  Check,
  BarChart3,
  Route,
  Calendar
} from 'lucide-react';

export const Logistics = () => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-001',
      order: 'SO-001',
      customer: 'ABC Construction',
      address: '123 Main St, City',
      status: 'in-transit',
      driver: 'Mike Johnson',
      vehicle: 'TRK-001',
      deliveryDate: '2026-04-02'
    },
    {
      id: 'DEL-002',
      order: 'SO-002',
      customer: 'XYZ Homes',
      address: '456 Oak Ave, Town',
      status: 'delivered',
      driver: 'Sarah Wilson',
      vehicle: 'TRK-002',
      deliveryDate: '2026-03-30'
    },
    {
      id: 'DEL-003',
      order: 'SO-003',
      customer: 'BuildRight Inc',
      address: '789 Pine Rd, Village',
      status: 'pending',
      driver: 'Tom Brown',
      vehicle: 'TRK-001',
      deliveryDate: '2026-04-05'
    },
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: 'TRK-001',
      type: 'Box Truck',
      capacity: 5000,
      status: 'active',
      lastMaintenance: '2026-03-15'
    },
    {
      id: 'TRK-002',
      type: 'Delivery Van',
      capacity: 2000,
      status: 'active',
      lastMaintenance: '2026-03-20'
    },
    {
      id: 'TRK-003',
      type: 'Flatbed',
      capacity: 8000,
      status: 'maintenance',
      lastMaintenance: '2026-03-25'
    },
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'Mike Johnson',
      license: 'CDL-A',
      status: 'on-duty',
      deliveries: 45
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      license: 'CDL-B',
      status: 'on-duty',
      deliveries: 38
    },
    {
      id: 3,
      name: 'Tom Brown',
      license: 'CDL-A',
      status: 'off-duty',
      deliveries: 52
    },
  ]);

  const [newDelivery, setNewDelivery] = useState({
    order: '',
    customer: '',
    address: '',
    driver: '',
    vehicle: '',
    deliveryDate: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddDelivery = () => {
    if (!newDelivery.order || !newDelivery.customer || !newDelivery.address || !newDelivery.driver || !newDelivery.vehicle) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    (async () => {
      try {
        await apiService.createDelivery({
          // Backend is currently flexible (stub) - UI provides an order string + delivery date.
          salesOrderId: undefined,
          deliveryDate: newDelivery.deliveryDate || undefined,
          order: newDelivery.order,
          driver: newDelivery.driver,
          vehicle: newDelivery.vehicle,
        });

        const deliveryToAdd = {
          id: `DEL-${String(deliveries.length + 1).padStart(3, '0')}`,
          ...newDelivery,
          status: 'pending',
        };

        setDeliveries([...deliveries, deliveryToAdd]);
        setNewDelivery({ order: '', customer: '', address: '', driver: '', vehicle: '', deliveryDate: '' });
        setShowDeliveryModal(false);
        showNotification('Delivery added successfully', 'success');
      } catch (e) {
        showNotification(e?.message || 'Failed to create delivery order', 'error');
      }
    })();
  };

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === deliveryId
        ? { ...delivery, status: newStatus }
        : delivery
    ));
    showNotification('Delivery status updated', 'success');
  };

  const deleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'delivery') {
        setDeliveries(deliveries.filter(delivery => delivery.id !== id));
      } else if (type === 'vehicle') {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      } else if (type === 'driver') {
        setDrivers(drivers.filter(driver => driver.id !== id));
      }
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success');
    }
  };

  const viewItemDetails = (type, item) => {
    setSelectedItem({ type, data: item });
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-logoGold text-primaryClr',
      'in-transit': 'bg-primaryClrLight text-primaryClr',
      'delivered': 'bg-accentClr text-white',
      'cancelled': 'bg-dangerClr text-white',
      'active': 'bg-accentClr text-white',
      'maintenance': 'bg-logoGold text-primaryClr',
      'inactive': 'bg-dangerClr text-white',
      'on-duty': 'bg-accentClr text-white',
      'off-duty': 'bg-dangerClr text-white'
    };
    const icons = {
      'pending': Clock,
      'in-transit': Truck,
      'delivered': CheckCircle,
      'cancelled': XCircle,
      'active': CheckCircle,
      'maintenance': Wrench,
      'inactive': XCircle,
      'on-duty': CheckCircle,
      'off-duty': XCircle
    };
    const IconComponent = icons[status] || Clock;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${styles[status]}`}>
        <IconComponent size={12} />
        <span>{status.toUpperCase()}</span>
      </span>
    );
  };

  // Calculate stats
  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'in-transit').length;
  const deliveredToday = deliveries.filter(d => d.status === 'delivered').length;

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Logistics Management</h1>
        <p className="text-place">Manage deliveries, vehicles, and drivers</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-accentClr text-white' : 'bg-dangerClr text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <Package size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Deliveries</p>
              <p className="text-2xl font-bold text-primaryClr">{totalDeliveries}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <Clock size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending</p>
              <p className="text-2xl font-bold text-primaryClr">{pendingDeliveries}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <Truck size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">In Transit</p>
              <p className="text-2xl font-bold text-primaryClr">{inTransitDeliveries}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Delivered Today</p>
              <p className="text-2xl font-bold text-primaryClr">{deliveredToday}</p>
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
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'deliveries'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Package size={16} />
              <span>Deliveries</span>
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'vehicles'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Truck size={16} />
              <span>Vehicles</span>
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'drivers'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Navigation size={16} />
              <span>Drivers</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-place" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <BarChart3 size={16} />
                <span>Logistics Report</span>
              </button>
              {activeTab === 'deliveries' && (
                <button
                  onClick={() => setShowDeliveryModal(true)}
                  className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>New Delivery</span>
                </button>
              )}
            </div>
          </div>

          {/* Deliveries Table */}
          {activeTab === 'deliveries' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Delivery ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Order</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Driver</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{delivery.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{delivery.order}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{delivery.customer}</td>
                      <td className="py-3 px-4 text-sm text-place">{delivery.address}</td>
                      <td className="py-3 px-4">{getStatusBadge(delivery.status)}</td>
                      <td className="py-3 px-4 text-sm text-place">{delivery.driver}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('delivery', delivery)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Delivery"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Delivery">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => updateDeliveryStatus(delivery.id, delivery.status === 'pending' ? 'in-transit' : 'delivered')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Update Status"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('delivery', delivery.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Delivery"
                          >
                            <Trash2 size={16} />
                          </button>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Vehicle ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Capacity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Last Maintenance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{vehicle.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{vehicle.type}</td>
                      <td className="py-3 px-4 text-sm text-place">{vehicle.capacity} kg</td>
                      <td className="py-3 px-4">{getStatusBadge(vehicle.status)}</td>
                      <td className="py-3 px-4 text-sm text-place">{vehicle.lastMaintenance}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('vehicle', vehicle)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Vehicle"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Vehicle">
                            <Edit size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Maintenance">
                            <Wrench size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('vehicle', vehicle.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Vehicle"
                          >
                            <Trash2 size={16} />
                          </button>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Driver</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">License</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Deliveries</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <Navigation size={16} className="text-primaryClrText" />
                          </div>
                          <span className="font-medium text-primaryClr">{driver.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{driver.license}</td>
                      <td className="py-3 px-4">{getStatusBadge(driver.status)}</td>
                      <td className="py-3 px-4 text-sm text-place">{driver.deliveries}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('driver', driver)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Driver"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Driver">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('driver', driver.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Driver"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Package size={20} />
                <span>New Delivery</span>
              </h2>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Order *</label>
                <input
                  type="text"
                  value={newDelivery.order}
                  onChange={(e) => setNewDelivery({...newDelivery, order: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Customer *</label>
                <input
                  type="text"
                  value={newDelivery.customer}
                  onChange={(e) => setNewDelivery({...newDelivery, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Address *</label>
                <input
                  type="text"
                  value={newDelivery.address}
                  onChange={(e) => setNewDelivery({...newDelivery, address: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Driver *</label>
                <select
                  value={newDelivery.driver}
                  onChange={(e) => setNewDelivery({...newDelivery, driver: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="">Select Driver</option>
                  {drivers.filter(d => d.status === 'on-duty').map(driver => (
                    <option key={driver.id} value={driver.name}>{driver.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Vehicle *</label>
                <select
                  value={newDelivery.vehicle}
                  onChange={(e) => setNewDelivery({...newDelivery, vehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.filter(v => v.status === 'active').map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Delivery Date</label>
                <input
                  type="date"
                  value={newDelivery.deliveryDate}
                  onChange={(e) => setNewDelivery({...newDelivery, deliveryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddDelivery}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Create Delivery</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Eye size={20} />
                <span>{selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Details</span>
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedItem.data).map(([key, value]) => (
                <div key={key}>
                  <span className="text-sm text-place capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <p className="font-medium text-primaryClr">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;
