import React, { useState } from 'react';

export const Finance = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
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
  ];

  const accounts = [
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
  ];

  const invoices = [
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
  ];

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Finance Management</h1>
        <p className="text-place">Manage accounts, transactions, and financial reporting</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Balance</p>
              <p className="text-2xl font-bold text-primaryClr">$24,870</p>
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
              <p className="text-2xl font-bold text-primaryClr">$8,450</p>
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
              <p className="text-2xl font-bold text-primaryClr">$3,950</p>
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
              <p className="text-2xl font-bold text-primaryClr">$2,990</p>
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
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors">
                📊 Generate Report
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors">
                ➕ New Transaction
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
                  {transactions.map((transaction) => (
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
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">🖨️</button>
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
                  {accounts.map((account) => (
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
                  {invoices.map((invoice) => (
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
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📧</button>
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
    </div>
  );
};
