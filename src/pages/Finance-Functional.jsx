import React, { useState } from 'react';

export const Finance = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');

  const [transactions, setTransactions] = useState([
    { 
      id: 'TRX-001', 
      type: 'income', 
      category: 'Sales Revenue', 
      description: 'Payment from ABC Construction', 
      amount: 1250.00, 
      date: '2026-03-28',
      status: 'completed'
    },
    { 
      id: 'TRX-002', 
      type: 'expense', 
      category: 'Materials', 
      description: 'Payment to ChemCo Supplies', 
      amount: -3500.00, 
      date: '2026-03-28',
      status: 'completed'
    },
    { 
      id: 'TRX-003', 
      type: 'income', 
      category: 'Sales Revenue', 
      description: 'Payment from XYZ Homes', 
      amount: 890.50, 
      date: '2026-03-27',
      status: 'completed'
    },
    { 
      id: 'TRX-004', 
      type: 'expense', 
      category: 'Utilities', 
      description: 'Electricity Bill', 
      amount: -450.00, 
      date: '2026-03-27',
      status: 'pending'
    },
  ]);

  const [accounts, setAccounts] = useState([
    { 
      id: 1, 
      name: 'Main Operating Account', 
      type: 'checking', 
      balance: 15420.00, 
      bank: 'National Bank',
      accountNumber: '****1234'
    },
    { 
      id: 2, 
      name: 'Savings Account', 
      type: 'savings', 
      balance: 8950.00, 
      bank: 'National Bank',
      accountNumber: '****5678'
    },
    { 
      id: 3, 
      name: 'Petty Cash', 
      type: 'cash', 
      balance: 500.00, 
      bank: 'On-site',
      accountNumber: 'N/A'
    },
  ]);

  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-001', 
      customer: 'ABC Construction', 
      amount: 1250.00, 
      dueDate: '2026-04-15',
      status: 'paid',
      date: '2026-03-28'
    },
    { 
      id: 'INV-002', 
      customer: 'XYZ Homes', 
      amount: 890.50, 
      dueDate: '2026-04-20',
      status: 'pending',
      date: '2026-03-28'
    },
    { 
      id: 'INV-003', 
      customer: 'BuildRight Inc', 
      amount: 2100.00, 
      dueDate: '2026-04-10',
      status: 'overdue',
      date: '2026-03-20'
    },
  ]);

  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking',
    balance: '',
    bank: '',
    accountNumber: ''
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

  // Add new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const transactionToAdd = {
      id: `TRX-${String(transactions.length + 1).padStart(3, '0')}`,
      ...newTransaction,
      amount: newTransaction.type === 'expense' ? -Math.abs(newTransaction.amount) : Math.abs(newTransaction.amount),
      status: 'completed'
    };

    setTransactions([...transactions, transactionToAdd]);
    
    // Update account balance
    const mainAccount = accounts.find(acc => acc.id === 1);
    if (mainAccount) {
      setAccounts(accounts.map(acc => 
        acc.id === 1 
          ? { ...acc, balance: acc.balance + transactionToAdd.amount }
          : acc
      ));
    }

    setNewTransaction({
      type: 'income',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowTransactionModal(false);
    showNotification('Transaction added successfully', 'success');
  };

  // Add new account
  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.balance || !newAccount.bank) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const accountToAdd = {
      id: accounts.length + 1,
      ...newAccount,
      balance: parseFloat(newAccount.balance)
    };

    setAccounts([...accounts, accountToAdd]);
    setNewAccount({
      name: '',
      type: 'checking',
      balance: '',
      bank: '',
      accountNumber: ''
    });
    setShowAccountModal(false);
    showNotification('Account added successfully', 'success');
  };

  // Update transaction status
  const updateTransactionStatus = (transactionId, newStatus) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === transactionId 
        ? { ...transaction, status: newStatus }
        : transaction
    ));
    showNotification('Transaction status updated', 'success');
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
      if (type === 'transaction') {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
      } else if (type === 'account') {
        setAccounts(accounts.filter(account => account.id !== id));
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
      'completed': 'bg-accentClr text-white',
      'pending': 'bg-logoGold text-primaryClr',
      'overdue': 'bg-dangerClr text-white',
      'paid': 'bg-accentClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getTransactionType = (type) => {
    const styles = {
      'income': 'bg-accentClr text-white',
      'expense': 'bg-dangerClr text-white'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[type]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `$${formatted}` : `-$${formatted}`;
  };

  // Calculate totals
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0));
  const pendingInvoices = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Finance Management</h1>
        <p className="text-place">Manage accounts, transactions, and financial reporting</p>
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
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Balance</p>
              <p className="text-2xl font-bold text-primaryClr">${totalBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Monthly Income</p>
              <p className="text-2xl font-bold text-primaryClr">${monthlyIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">📉</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Monthly Expenses</p>
              <p className="text-2xl font-bold text-primaryClr">${monthlyExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">🧾</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending Invoices</p>
              <p className="text-2xl font-bold text-primaryClr">${pendingInvoices.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'accounts'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Accounts
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
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Reports
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
                📊 Generate Report
              </button>
              <button 
                onClick={() => {
                  if (activeTab === 'transactions') setShowTransactionModal(true);
                  else if (activeTab === 'accounts') setShowAccountModal(true);
                }}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                ➕ New {activeTab.slice(0, -1)}
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <span className="font-medium text-primaryClr">{transaction.id}</span>
                      </td>
                      <td className="py-3 px-4">{getTransactionType(transaction.type)}</td>
                      <td className="py-3 px-4 text-sm text-place">{transaction.category}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{transaction.description}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          transaction.amount >= 0 ? 'text-accentClr' : 'text-dangerClr'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{transaction.date}</td>
                      <td className="py-3 px-4">{getStatusBadge(transaction.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewItemDetails('transaction', transaction)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="View Transaction"
                          >
                            👁️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Edit Transaction">
                            ✏️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Print Receipt">
                            🖨️
                          </button>
                          <button 
                            onClick={() => deleteItem('transaction', transaction.id)}
                            className="text-dangerClr hover:text-dangerClrLight"
                            title="Delete Transaction"
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

          {/* Accounts */}
          {activeTab === 'accounts' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Account Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Bank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Account Number</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Balance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {account.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-primaryClr">{account.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place capitalize">{account.type}</td>
                      <td className="py-3 px-4 text-sm text-place">{account.bank}</td>
                      <td className="py-3 px-4 text-sm text-place">{account.accountNumber}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${account.balance.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewItemDetails('account', account)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="View Account"
                          >
                            👁️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="Edit Account">
                            ✏️
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight" title="View Statement">
                            📊
                          </button>
                          <button 
                            onClick={() => deleteItem('account', account.id)}
                            className="text-dangerClr hover:text-dangerClrLight"
                            title="Delete Account"
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

          {/* Invoices */}
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

          {/* Reports */}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <span className="text-4xl">📊</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Financial Reports</h3>
              <p className="mt-2 text-place">Generate comprehensive financial reports and analytics</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr p-4 rounded-lg transition-colors">
                  <span className="text-2xl block mb-2">📈</span>
                  <span className="text-sm">Profit & Loss</span>
                </button>
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr p-4 rounded-lg transition-colors">
                  <span className="text-2xl block mb-2">💰</span>
                  <span className="text-sm">Cash Flow</span>
                </button>
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr p-4 rounded-lg transition-colors">
                  <span className="text-2xl block mb-2">📊</span>
                  <span className="text-sm">Balance Sheet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Add New Transaction</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Category *</label>
                <input
                  type="text"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Description *</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Amount ($) *</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Add New Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Account Name *</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Account Type</label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Initial Balance ($) *</label>
                <input
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Bank *</label>
                <input
                  type="text"
                  value={newAccount.bank}
                  onChange={(e) => setNewAccount({...newAccount, bank: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Account Number</label>
                <input
                  type="text"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAccountModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Add Account
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
                  <p className="font-medium text-primaryClr">
                    {key === 'amount' && typeof value === 'number' ? formatCurrency(value) : value}
                  </p>
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
