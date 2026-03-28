import React, { useState } from 'react';
import {
  Wrench,
  Cog,
  Zap,
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
  Play,
  Pause,
  RotateCcw,
  FileText,
  BarChart3,
  X,
  Check,
  Layers,
  Settings,
  TrendingUp
} from 'lucide-react';

export const Manufacturing = () => {
  const [activeTab, setActiveTab] = useState('production-orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showBOMModal, setShowBOMModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [productionOrders, setProductionOrders] = useState([
    {
      id: 'PO-001',
      product: 'Premium Paint - White',
      quantity: 500,
      status: 'in-progress',
      startDate: '2026-03-28',
      endDate: '2026-03-30',
      efficiency: 85
    },
    {
      id: 'PO-002',
      product: 'Premium Paint - Blue',
      quantity: 300,
      status: 'completed',
      startDate: '2026-03-26',
      endDate: '2026-03-28',
      efficiency: 92
    },
    {
      id: 'PO-003',
      product: 'Primer Coat',
      quantity: 1000,
      status: 'pending',
      startDate: '2026-03-29',
      endDate: '2026-04-01',
      efficiency: 0
    },
  ]);

  const [billOfMaterials, setBillOfMaterials] = useState([
    {
      id: 1,
      product: 'Premium Paint - White',
      materials: [
        { name: 'Base Chemical', quantity: 100, unit: 'L' },
        { name: 'White Pigment', quantity: 25, unit: 'kg' },
        { name: 'Additives', quantity: 5, unit: 'kg' }
      ],
      status: 'active'
    },
    {
      id: 2,
      product: 'Premium Paint - Blue',
      materials: [
        { name: 'Base Chemical', quantity: 100, unit: 'L' },
        { name: 'Blue Pigment', quantity: 20, unit: 'kg' },
        { name: 'Additives', quantity: 5, unit: 'kg' }
      ],
      status: 'active'
    },
  ]);

  const [qualityChecks, setQualityChecks] = useState([
    {
      id: 1,
      batch: 'B-001',
      product: 'Premium Paint - White',
      tests: 5,
      passed: 5,
      status: 'passed'
    },
    {
      id: 2,
      batch: 'B-002',
      product: 'Premium Paint - Blue',
      tests: 5,
      passed: 4,
      status: 'warning'
    },
  ]);

  const [newOrder, setNewOrder] = useState({
    product: '',
    quantity: '',
    startDate: '',
    endDate: ''
  });

  const [newBOM, setNewBOM] = useState({
    product: '',
    materials: [],
    status: 'active'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddOrder = () => {
    if (!newOrder.product || !newOrder.quantity) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const orderToAdd = {
      id: `PO-${String(productionOrders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      quantity: parseInt(newOrder.quantity),
      status: 'pending',
      efficiency: 0
    };

    setProductionOrders([...productionOrders, orderToAdd]);
    setNewOrder({ product: '', quantity: '', startDate: '', endDate: '' });
    setShowOrderModal(false);
    showNotification('Production order added successfully', 'success');
  };

  const handleAddBOM = () => {
    if (!newBOM.product) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const bomToAdd = {
      id: billOfMaterials.length + 1,
      ...newBOM,
      materials: []
    };

    setBillOfMaterials([...billOfMaterials, bomToAdd]);
    setNewBOM({ product: '', materials: [], status: 'active' });
    setShowBOMModal(false);
    showNotification('Bill of Materials added successfully', 'success');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setProductionOrders(productionOrders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
    showNotification('Order status updated', 'success');
  };

  const deleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'production-order') {
        setProductionOrders(productionOrders.filter(order => order.id !== id));
      } else if (type === 'bill-of-materials') {
        setBillOfMaterials(billOfMaterials.filter(bom => bom.id !== id));
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
      'in-progress': 'bg-primaryClrLight text-primaryClr',
      'completed': 'bg-accentClr text-white',
      'cancelled': 'bg-dangerClr text-white',
      'passed': 'bg-accentClr text-white',
      'failed': 'bg-dangerClr text-white',
      'warning': 'bg-logoGold text-primaryClr',
      'active': 'bg-accentClr text-white',
      'inactive': 'bg-dangerClr text-white'
    };
    const icons = {
      'pending': Clock,
      'in-progress': Play,
      'completed': CheckCircle,
      'cancelled': XCircle,
      'passed': CheckCircle,
      'failed': XCircle,
      'warning': AlertTriangle,
      'active': CheckCircle,
      'inactive': XCircle
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
  const totalOrders = productionOrders.length;
  const inProgressOrders = productionOrders.filter(o => o.status === 'in-progress').length;
  const completedOrders = productionOrders.filter(o => o.status === 'completed').length;
  const avgEfficiency = productionOrders.filter(o => o.efficiency > 0).reduce((sum, o) => sum + o.efficiency, 0) / productionOrders.filter(o => o.efficiency > 0).length || 0;

  const filteredOrders = productionOrders.filter(order =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBOMs = billOfMaterials.filter(bom =>
    bom.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Manufacturing Management</h1>
        <p className="text-place">Manage production orders, BOM, and quality control</p>
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
              <Cog size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Orders</p>
              <p className="text-2xl font-bold text-primaryClr">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <Play size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">In Progress</p>
              <p className="text-2xl font-bold text-primaryClr">{inProgressOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Completed</p>
              <p className="text-2xl font-bold text-primaryClr">{completedOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Avg Efficiency</p>
              <p className="text-2xl font-bold text-primaryClr">{avgEfficiency.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('production-orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'production-orders'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Cog size={16} />
              <span>Production Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('bill-of-materials')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'bill-of-materials'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Layers size={16} />
              <span>Bill of Materials</span>
            </button>
            <button
              onClick={() => setActiveTab('quality-checks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'quality-checks'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <CheckCircle size={16} />
              <span>Quality Checks</span>
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
                <span>Production Report</span>
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'production-orders') setShowOrderModal(true);
                  else if (activeTab === 'bill-of-materials') setShowBOMModal(true);
                }}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New {activeTab === 'production-orders' ? 'Order' : 'BOM'}</span>
              </button>
            </div>
          </div>

          {/* Production Orders Table */}
          {activeTab === 'production-orders' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Efficiency</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{order.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{order.product}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.quantity}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.efficiency > 0 ? `${order.efficiency}%` : '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('production-order', order)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Order"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Order">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, order.status === 'pending' ? 'in-progress' : 'completed')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Update Status"
                          >
                            {order.status === 'in-progress' ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button
                            onClick={() => deleteItem('production-order', order.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Order"
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

          {/* Bill of Materials Table */}
          {activeTab === 'bill-of-materials' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Materials Count</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBOMs.map((bom) => (
                    <tr key={bom.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <Layers size={16} className="text-primaryClrText" />
                          </div>
                          <span className="font-medium text-primaryClr">{bom.product}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{bom.materials.length} items</td>
                      <td className="py-3 px-4">{getStatusBadge(bom.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('bill-of-materials', bom)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View BOM"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit BOM">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('bill-of-materials', bom.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete BOM"
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

          {/* Quality Checks Table */}
          {activeTab === 'quality-checks' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Batch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Tests</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Passed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityChecks.map((check) => (
                    <tr key={check.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{check.batch}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{check.product}</td>
                      <td className="py-3 px-4 text-sm text-place">{check.tests}</td>
                      <td className="py-3 px-4 text-sm text-place">{check.passed}</td>
                      <td className="py-3 px-4">{getStatusBadge(check.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Production Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Cog size={20} />
                <span>New Production Order</span>
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Product *</label>
                <input
                  type="text"
                  value={newOrder.product}
                  onChange={(e) => setNewOrder({...newOrder, product: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Quantity *</label>
                <input
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Start Date</label>
                <input
                  type="date"
                  value={newOrder.startDate}
                  onChange={(e) => setNewOrder({...newOrder, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">End Date</label>
                <input
                  type="date"
                  value={newOrder.endDate}
                  onChange={(e) => setNewOrder({...newOrder, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddOrder}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Create Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add BOM Modal */}
      {showBOMModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Layers size={20} />
                <span>New Bill of Materials</span>
              </h2>
              <button
                onClick={() => setShowBOMModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Product Name *</label>
                <input
                  type="text"
                  value={newBOM.product}
                  onChange={(e) => setNewBOM({...newBOM, product: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBOMModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddBOM}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Create BOM</span>
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
                  <p className="font-medium text-primaryClr">
                    {typeof value === 'number' ? (key === 'efficiency' ? `${value}%` : value) : (typeof value === 'object' ? JSON.stringify(value) : value)}
                  </p>
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

export default Manufacturing;
