import React, { useState } from 'react';

export const Sales = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');

  const [orders, setOrders] = useState([
    { 
      id: 'SO-001', 
      customer: 'ABC Construction', 
      product: 'Premium Paint - White', 
      quantity: 100,
      amount: 2500.00, 
      date: '2026-03-28',
      status: 'confirmed',
      deliveryDate: '2026-04-02'
    },
    { 
      id: 'SO-002', 
      customer: 'XYZ Homes', 
      product: 'Premium Paint - Blue', 
      quantity: 50,
      amount: 1250.00, 
      date: '2026-03-28',
      status: 'pending',
      deliveryDate: '2026-04-05'
    },
    { 
      id: 'SO-003', 
      customer: 'BuildRight Inc', 
      product: 'Primer Coat', 
      quantity: 200,
      amount: 3000.00, 
      date: '2026-03-27',
      status: 'shipped',
      deliveryDate: '2026-03-30'
    },
  ]);

  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      name: 'ABC Construction', 
      email: 'contact@abc.com', 
      phone: '+1234567890', 
      orders: 15, 
      totalSpent: 45200.00,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'XYZ Homes', 
      email: 'info@xyzhomes.com', 
      phone: '+1234567891', 
      orders: 8, 
      totalSpent: 22100.00,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'BuildRight Inc', 
      email: 'sales@buildright.com', 
      phone: '+1234567892', 
      orders: 12, 
      totalSpent: 38400.00,
      status: 'inactive'
    },
  ]);

  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-001', 
      customer: 'ABC Construction', 
      amount: 2500.00, 
      dueDate: '2026-04-15',
      status: 'paid',
      date: '2026-03-28'
    },
    { 
      id: 'INV-002', 
      customer: 'XYZ Homes', 
      amount: 1250.00, 
      dueDate: '2026-04-20',
      status: 'pending',
      date: '2026-03-28'
    },
    { 
      id: 'INV-003', 
      customer: 'BuildRight Inc', 
      amount: 3000.00, 
      dueDate: '2026-04-10',
      status: 'overdue',
      date: '2026-03-20'
    },
  ]);

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [newOrder, setNewOrder] = useState({
    customer: '',
    product: '',
    quantity: '',
    amount: '',
    deliveryDate: ''
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });

  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    amount: '',
    dueDate: ''
  });

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Add new order
  const handleAddOrder = () => {
    if (!newOrder.customer || !newOrder.product || !newOrder.quantity || !newOrder.amount) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const orderToAdd = {
      id: `SO-${String(orders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setOrders([...orders, orderToAdd]);
    setNewOrder({ customer: '', product: '', quantity: '', amount: '', deliveryDate: '' });
    setShowOrderModal(false);
    showNotification('Order added successfully', 'success');
  };

  // Add new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const customerToAdd = {
      id: customers.length + 1,
      ...newCustomer,
      orders: 0,
      totalSpent: 0
    };

    setCustomers([...customers, customerToAdd]);
    setNewCustomer({ name: '', email: '', phone: '', status: 'active' });
    setShowCustomerModal(false);
    showNotification('Customer added successfully', 'success');
  };

  // Add new invoice
  const handleAddInvoice = () => {
    if (!newInvoice.customer || !newInvoice.amount || !newInvoice.dueDate) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const invoiceToAdd = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...newInvoice,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setInvoices([...invoices, invoiceToAdd]);
    setNewInvoice({ customer: '', amount: '', dueDate: '' });
    setShowInvoiceModal(false);
    showNotification('Invoice created successfully', 'success');
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    showNotification('Order status updated', 'success');
  };

  // Update invoice status
  const updateInvoiceStatus = (invoiceId, newStatus) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: newStatus }
        : invoice
    ));
    showNotification('Invoice status updated', 'success');
  };

  // Delete item
  const deleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'order') {
        setOrders(orders.filter(order => order.id !== id));
      } else if (type === 'customer') {
        setCustomers(customers.filter(customer => customer.id !== id));
      } else if (type === 'invoice') {
        setInvoices(invoices.filter(invoice => invoice.id !== id));
      }
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success');
    }
  };

  // View item details
  const viewItemDetails = (type, item) => {
    setSelectedItem({ type, data: item });
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-logoGold text-primaryClr',
      'confirmed': 'bg-primaryClr text-primaryClrText',
      'shipped': 'bg-accentClr text-white',
      'delivered': 'bg-accentClr text-white',
      'cancelled': 'bg-dangerClr text-white',
      'paid': 'bg-accentClr text-white',
      'overdue': 'bg-dangerClr text-white',
      'active': 'bg-accentClr text-white',
      'inactive': 'bg-dangerClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Sales Management</h1>
        <p className="text-place">Manage customers, orders, and invoicing</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-accentClr text-white' : 'bg-dangerClr text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Orders</p>
              <p className="text-2xl font-bold text-primaryClr">{orders.length}</p>
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
              <p className="text-2xl font-bold text-primaryClr">{customers.length}</p>
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
              <p className="text-2xl font-bold text-primaryClr">${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">🧾</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending Invoices</p>
              <p className="text-2xl font-bold text-primaryClr">{invoices.filter(inv => inv.status === 'pending').length}</p>
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
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors">
                📊 Reports
              </button>
              <button 
                onClick={() => {
                  if (activeTab === 'orders') setShowOrderModal(true);
                  else if (activeTab === 'customers') setShowCustomerModal(true);
                  else if (activeTab === 'invoices') setShowInvoiceModal(true);
                }}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                ➕ New {activeTab.slice(0, -1)}
              </button>
            </div>
          </div>

          {/* Sales Orders Table */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Delivery</th>
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
                      <td className="py-3 px-4 text-sm text-primaryClr">{order.customer}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{order.product}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.quantity}L</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${order.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{order.deliveryDate}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewItemDetails('order', order)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="View Order"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, order.status === 'pending' ? 'confirmed' : order.status === 'confirmed' ? 'shipped' : 'delivered')}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="Update Status"
                          >
                            📦
                          </button>
                          <button 
                            onClick={() => deleteItem('order', order.id)}
                            className="text-dangerClr hover:text-dangerClrLight"
                            title="Delete Order"
                          >
                            🗑️
                          </button>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
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
                      <td className="py-3 px-4">{getStatusBadge(customer.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewItemDetails('customer', customer)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="View Customer"
                          >
                            👁️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Edit Customer">
                            ✏️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Send Email">
                            📧
                          </button>
                          <button 
                            onClick={() => deleteItem('customer', customer.id)}
                            className="text-dangerClr hover:text-dangerClrLight"
                            title="Delete Customer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Invoices Table */}
          {activeTab === 'invoices' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Invoice ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Issue Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{invoice.id}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{invoice.customer}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${invoice.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-place">{invoice.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{invoice.dueDate}</td>
                      <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewItemDetails('invoice', invoice)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="View Invoice"
                          >
                            👁️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Edit Invoice">
                            ✏️
                          </button>
                          <button 
                            onClick={() => updateInvoiceStatus(invoice.id, invoice.status === 'pending' ? 'paid' : 'pending')}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="Mark as Paid"
                          >
                            💳
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Send Invoice">
                            📧
                          </button>
                          <button 
                            onClick={() => deleteItem('invoice', invoice.id)}
                            className="text-dangerClr hover:text-dangerClrLight"
                            title="Delete Invoice"
                          >
                            🗑️
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

      {/* Add Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Add New Order</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Customer *</label>
                <input
                  type="text"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
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
                <label className="block text-sm font-medium text-primaryClr mb-1">Quantity (L) *</label>
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
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Add New Customer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Name *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Phone *</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Create New Invoice</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Customer *</label>
                <input
                  type="text"
                  value={newInvoice.customer}
                  onChange={(e) => setNewInvoice({...newInvoice, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Amount ($) *</label>
                <input
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Due Date *</label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInvoice}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">
              {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Details
            </h2>
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
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
