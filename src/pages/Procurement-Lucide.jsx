import React, { useState } from 'react';
import apiService from '../services/api';
import {
  ShoppingCart,
  Truck,
  DollarSign,
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
  FileText,
  X,
  Check,
  Download,
  Upload,
  BarChart3
} from 'lucide-react';

export const Procurement = () => {
  const [activeTab, setActiveTab] = useState('purchase-orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO-001',
      supplier: 'ChemCo Supplies',
      product: 'Raw Chemicals',
      quantity: 500,
      amount: 3500.00,
      date: '2026-03-28',
      deliveryDate: '2026-04-05',
      status: 'pending'
    },
    {
      id: 'PO-002',
      supplier: 'Packaging Inc',
      product: 'Paint Cans',
      quantity: 1000,
      amount: 1200.00,
      date: '2026-03-27',
      deliveryDate: '2026-04-03',
      status: 'approved'
    },
    {
      id: 'PO-003',
      supplier: 'Pigments Ltd',
      product: 'Color Pigments',
      quantity: 200,
      amount: 2800.00,
      date: '2026-03-26',
      deliveryDate: '2026-04-01',
      status: 'received'
    },
  ]);

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'ChemCo Supplies',
      email: 'orders@chemco.com',
      phone: '+1234567890',
      address: '123 Industrial Ave',
      status: 'active'
    },
    {
      id: 2,
      name: 'Packaging Inc',
      email: 'sales@packaging.com',
      phone: '+1234567891',
      address: '456 Factory Blvd',
      status: 'active'
    },
    {
      id: 3,
      name: 'Pigments Ltd',
      email: 'orders@pigments.com',
      phone: '+1234567892',
      address: '789 Chemical Lane',
      status: 'inactive'
    },
  ]);

  const [newOrder, setNewOrder] = useState({
    supplier: '',
    product: '',
    quantity: '',
    amount: '',
    deliveryDate: ''
  });

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddOrder = () => {
    if (!newOrder.supplier || !newOrder.product || !newOrder.quantity || !newOrder.amount) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    (async () => {
      try {
        const created = await apiService.createPurchaseOrder({
          supplier: newOrder.supplier,
          amount: parseFloat(newOrder.amount),
          deliveryDate: newOrder.deliveryDate || undefined,
          orderDate: new Date().toISOString().slice(0, 10),
        });

        const orderToAdd = {
          id: created?.orderNumber ?? `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
          supplier: newOrder.supplier,
          product: newOrder.product,
          quantity: parseInt(newOrder.quantity, 10),
          amount: parseFloat(newOrder.amount),
          date: created?.orderDate ?? new Date().toISOString().split('T')[0],
          deliveryDate: newOrder.deliveryDate,
          status: 'pending',
        };

        setPurchaseOrders([...purchaseOrders, orderToAdd]);
        setNewOrder({ supplier: '', product: '', quantity: '', amount: '', deliveryDate: '' });
        setShowOrderModal(false);
        showNotification('Purchase order added successfully', 'success');
      } catch (e) {
        showNotification(e?.message || 'Failed to create purchase order', 'error');
      }
    })();
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email || !newSupplier.phone || !newSupplier.address) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    (async () => {
      try {
        const created = await apiService.createSupplier({
          name: newSupplier.name,
          email: newSupplier.email,
          phone: newSupplier.phone,
          address: newSupplier.address,
          isActive: newSupplier.status === 'active',
        });

        const supplierToAdd = {
          id: created?.id ?? suppliers.length + 1,
          name: newSupplier.name,
          email: newSupplier.email,
          phone: newSupplier.phone,
          address: newSupplier.address,
          status: newSupplier.status,
        };

        setSuppliers([...suppliers, supplierToAdd]);
        setNewSupplier({ name: '', email: '', phone: '', address: '', status: 'active' });
        setShowSupplierModal(false);
        showNotification('Supplier added successfully', 'success');
      } catch (e) {
        showNotification(e?.message || 'Failed to create supplier', 'error');
      }
    })();
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setPurchaseOrders(purchaseOrders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
    showNotification('Order status updated', 'success');
  };

  const deleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'purchase-order') {
        setPurchaseOrders(purchaseOrders.filter(order => order.id !== id));
      } else if (type === 'supplier') {
        setSuppliers(suppliers.filter(supplier => supplier.id !== id));
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
      'approved': 'bg-accentClr text-white',
      'received': 'bg-primaryClrLight text-primaryClr',
      'cancelled': 'bg-dangerClr text-white',
      'active': 'bg-accentClr text-white',
      'inactive': 'bg-dangerClr text-white'
    };
    const icons = {
      'pending': Clock,
      'approved': CheckCircle,
      'received': Package,
      'cancelled': XCircle,
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
  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(o => o.status === 'pending').length;
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const totalSpend = purchaseOrders.reduce((sum, o) => sum + o.amount, 0);

  const filteredOrders = purchaseOrders.filter(order =>
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Procurement Management</h1>
        <p className="text-place">Manage purchase orders and supplier relationships</p>
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
              <ShoppingCart size={24} className="text-primaryClr" />
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
              <Clock size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending</p>
              <p className="text-2xl font-bold text-primaryClr">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <Truck size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Suppliers</p>
              <p className="text-2xl font-bold text-primaryClr">{totalSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Spend</p>
              <p className="text-2xl font-bold text-primaryClr">${totalSpend.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('purchase-orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'purchase-orders'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <ShoppingCart size={16} />
              <span>Purchase Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'suppliers'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Truck size={16} />
              <span>Suppliers</span>
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
                <span>Procurement Report</span>
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'purchase-orders') setShowOrderModal(true);
                  else if (activeTab === 'suppliers') setShowSupplierModal(true);
                }}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New {activeTab === 'purchase-orders' ? 'Order' : 'Supplier'}</span>
              </button>
            </div>
          </div>

          {/* Purchase Orders Table */}
          {activeTab === 'purchase-orders' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Supplier</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{order.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{order.supplier}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.product}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.quantity}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${order.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('purchase-order', order)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Order"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Order">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, order.status === 'pending' ? 'approved' : 'pending')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Approve Order"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('purchase-order', order.id)}
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

          {/* Suppliers Table */}
          {activeTab === 'suppliers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Supplier</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <Truck size={16} className="text-primaryClrText" />
                          </div>
                          <span className="font-medium text-primaryClr">{supplier.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{supplier.email}</td>
                      <td className="py-3 px-4 text-sm text-place">{supplier.phone}</td>
                      <td className="py-3 px-4 text-sm text-place">{supplier.address}</td>
                      <td className="py-3 px-4">{getStatusBadge(supplier.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('supplier', supplier)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Supplier"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Supplier">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('supplier', supplier.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Supplier"
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

      {/* Add Purchase Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <ShoppingCart size={20} />
                <span>New Purchase Order</span>
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
                <label className="block text-sm font-medium text-primaryClr mb-1">Supplier *</label>
                <select
                  value={newOrder.supplier}
                  onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.filter(s => s.status === 'active').map(supplier => (
                    <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-sm font-medium text-primaryClr mb-1">Amount ($) *</label>
                <input
                  type="number"
                  value={newOrder.amount}
                  onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Delivery Date</label>
                <input
                  type="date"
                  value={newOrder.deliveryDate}
                  onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
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

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Truck size={20} />
                <span>Add New Supplier</span>
              </h2>
              <button
                onClick={() => setShowSupplierModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Name *</label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Phone *</label>
                <input
                  type="tel"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Address *</label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSupplierModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddSupplier}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Add Supplier</span>
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
                    {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
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

export default Procurement;
