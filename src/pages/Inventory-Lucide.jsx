import React, { useState, useMemo } from 'react';
import apiService from '../services/api';
import { useApiData, useNotification } from '../hooks/useApiData';
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Check,
  FileText,
  TrendingUp,
  TrendingDown,
  Box,
  Layers,
  ClipboardList
} from 'lucide-react';

export const Inventory = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [productFormMode, setProductFormMode] = useState('add'); // 'add' | 'edit'
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { notification, showNotification } = useNotification();
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState('in'); // 'in' | 'out'
  const [stockProduct, setStockProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState('');

  const { data: productsRaw, loading: productsLoading, refetch: refetchProducts } = useApiData(
    () => apiService.getProducts(),
    []
  );

  const { data: transactionsRaw, loading: txLoading, refetch: refetchTransactions } = useApiData(
    () => apiService.getInventoryTransactions(),
    []
  );

  const products = Array.isArray(productsRaw) ? productsRaw : [];
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : [];

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    stock: '',
    price: '',
    status: 'in-stock'
  });

  const getStatusBadge = (status) => {
    const styles = {
      'in-stock': 'bg-accentClr text-white',
      'low-stock': 'bg-logoGold text-primaryClr',
      'out-of-stock': 'bg-dangerClr text-white'
    };
    const icons = {
      'in-stock': CheckCircle,
      'low-stock': AlertTriangle,
      'out-of-stock': XCircle
    };
    const IconComponent = icons[status] || AlertTriangle;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${styles[status]}`}>
        <IconComponent size={12} />
        <span>{status.replace('-', ' ').toUpperCase()}</span>
      </span>
    );
  };

  const getTransactionType = (type) => {
    const styles = {
      'in': 'bg-accentClr text-white',
      'out': 'bg-dangerClr text-white'
    };
    const IconComponent = type === 'in' ? ArrowDownLeft : ArrowUpRight;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center space-x-1 ${styles[type]}`}>
        <IconComponent size={12} />
        <span>{type.toUpperCase()}</span>
      </span>
    );
  };

  const resetProductForm = () => {
    setProductFormMode('add');
    setEditingProductId(null);
    setNewProduct({ name: '', sku: '', stock: '', price: '', status: 'in-stock' });
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.sku || newProduct.stock === '' || newProduct.price === '') {
        showNotification('Please fill Product Name, SKU, Stock, and Price.', 'error');
        return;
      }

      const payload = {
        name: newProduct.name,
        sku: newProduct.sku,
        stock: parseFloat(newProduct.stock),
        price: parseFloat(newProduct.price),
      };

      if (productFormMode === 'edit') {
        await apiService.updateProduct(editingProductId, payload);
        showNotification('Product updated successfully', 'success');
      } else {
        await apiService.createProduct(payload);
        showNotification('Product added successfully', 'success');
      }

      setShowAddModal(false);
      resetProductForm();
      refetchProducts();
      refetchTransactions();
    } catch (e) {
      showNotification(e?.message || 'Failed to save product', 'error');
    }
  };

  const deleteProduct = async (productId) => {
    if (!productId) return;
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiService.deleteProduct(productId);
      showNotification('Product deleted successfully', 'success');
      refetchProducts();
      refetchTransactions();
    } catch (e) {
      showNotification(e?.message || 'Failed to delete product', 'error');
    }
  };

  const openEditProduct = (product) => {
    setProductFormMode('edit');
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name || '',
      sku: product.sku || '',
      stock: String(product.stock ?? 0),
      price: String(product.price ?? 0),
      status: product.status || 'in-stock',
    });
    setShowAddModal(true);
  };

  const openStockModal = (product, action) => {
    setStockProduct(product);
    setStockAction(action);
    setStockQuantity('');
    setShowStockModal(true);
  };

  const submitStockAction = async () => {
    if (!stockProduct) return;
    const qty = parseFloat(stockQuantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      showNotification('Enter a valid quantity (> 0).', 'error');
      return;
    }

    const transactionType = stockAction === 'in' ? 'purchase' : 'sale';
    try {
      await apiService.createInventoryTransaction({
        productId: stockProduct.id,
        transactionType,
        quantity: qty,
        referenceType: 'adjustment',
        referenceId: 0,
      });
      showNotification(`Stock ${stockAction === 'in' ? 'in' : 'out'} recorded successfully`, 'success');
      setShowStockModal(false);
      setStockProduct(null);
      setStockQuantity('');
      refetchProducts();
      refetchTransactions();
    } catch (e) {
      showNotification(e?.message || 'Failed to record stock movement', 'error');
    }
  };

  const viewItemDetails = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.status === 'in-stock').length;
  const lowStockProducts = products.filter(p => p.status === 'low-stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock').length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        (transaction.product || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [transactions, searchTerm]
  );

  if (productsLoading || txLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-primaryClr">
        Loading inventory…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Inventory Management</h1>
        <p className="text-place">Manage your products, stock levels, and inventory transactions</p>
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
              <p className="text-sm text-place">Total Products</p>
              <p className="text-2xl font-bold text-primaryClr">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">In Stock</p>
              <p className="text-2xl font-bold text-primaryClr">{inStockProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <AlertTriangle size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Low Stock</p>
              <p className="text-2xl font-bold text-primaryClr">{lowStockProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <XCircle size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Out of Stock</p>
              <p className="text-2xl font-bold text-primaryClr">{outOfStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'products'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Package size={16} />
              <span>Products</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'transactions'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <ClipboardList size={16} />
              <span>Transactions</span>
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
                <span>Inventory Report</span>
              </button>
              {activeTab === 'products' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Product</span>
                </button>
              )}
            </div>
          </div>

          {/* Products Table */}
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">SKU</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <Package size={16} className="text-primaryClrText" />
                          </div>
                          <span className="font-medium text-primaryClr">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{product.sku}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">{product.stock}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">{getStatusBadge(product.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails(product)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Product"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEditProduct(product)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openStockModal(product, 'in')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Stock In"
                          >
                            <ArrowDownLeft size={16} />
                          </button>
                          <button
                            onClick={() => openStockModal(product, 'out')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Stock Out"
                          >
                            <ArrowUpRight size={16} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Product"
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

          {/* Transactions Table */}
          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">User</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">{getTransactionType(transaction.type)}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{transaction.product}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">{transaction.quantity}</td>
                      <td className="py-3 px-4 text-sm text-place">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{transaction.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Plus size={20} />
                <span>{productFormMode === 'edit' ? 'Edit Product' : 'Add New Product'}</span>
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetProductForm();
                }}
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
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">SKU *</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Initial Stock *</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Price ($) *</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetProductForm();
                }}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>{productFormMode === 'edit' ? 'Update Product' : 'Add Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock In/Out Modal */}
      {showStockModal && stockProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Package size={20} />
                <span>Stock {stockAction === 'in' ? 'In' : 'Out'}</span>
              </h2>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setStockProduct(null);
                  setStockQuantity('');
                }}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Product</label>
                <div className="px-3 py-2 border border-secondaryClr rounded-lg bg-bgLight">
                  {stockProduct.name} ({stockProduct.sku})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Quantity *</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setStockProduct(null);
                  setStockQuantity('');
                }}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={submitStockAction}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Eye size={20} />
                <span>Product Details</span>
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-place">Name:</span>
                <p className="font-medium text-primaryClr">{selectedItem.name}</p>
              </div>
              <div>
                <span className="text-sm text-place">SKU:</span>
                <p className="font-medium text-primaryClr">{selectedItem.sku}</p>
              </div>
              <div>
                <span className="text-sm text-place">Stock:</span>
                <p className="font-medium text-primaryClr">{selectedItem.stock}</p>
              </div>
              <div>
                <span className="text-sm text-place">Price:</span>
                <p className="font-medium text-primaryClr">${selectedItem.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-place">Status:</span>
                <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
              </div>
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

export default Inventory;
