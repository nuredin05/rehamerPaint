import React, { useState } from 'react';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@rehamerpaint.com', 
      role: 'admin', 
      status: 'active',
      lastLogin: '2026-03-28 08:30',
      department: 'System'
    },
    { 
      id: 2, 
      name: 'John Smith', 
      email: 'john.smith@rehamerpaint.com', 
      role: 'manager', 
      status: 'active',
      lastLogin: '2026-03-28 07:45',
      department: 'Manufacturing'
    },
    { 
      id: 3, 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@rehamerpaint.com', 
      role: 'user', 
      status: 'active',
      lastLogin: '2026-03-27 16:20',
      department: 'Sales'
    },
    { 
      id: 4, 
      name: 'Mike Chen', 
      email: 'mike.chen@rehamerpaint.com', 
      role: 'user', 
      status: 'inactive',
      lastLogin: '2026-03-20 14:15',
      department: 'Finance'
    },
  ];

  const systemSettings = [
    { 
      category: 'General',
      settings: [
        { name: 'Company Name', value: 'RehamerPaint ERP', type: 'text' },
        { name: 'Time Zone', value: 'UTC+03:00', type: 'select' },
        { name: 'Date Format', value: 'DD/MM/YYYY', type: 'select' },
        { name: 'Currency', value: 'USD', type: 'select' }
      ]
    },
    { 
      category: 'Security',
      settings: [
        { name: 'Password Policy', value: 'Strong', type: 'select' },
        { name: 'Session Timeout', value: '30 minutes', type: 'select' },
        { name: 'Two-Factor Auth', value: 'Enabled', type: 'toggle' },
        { name: 'Login Attempts', value: '5', type: 'number' }
      ]
    },
    { 
      category: 'Notifications',
      settings: [
        { name: 'Email Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'Low Stock Alerts', value: 'Enabled', type: 'toggle' },
        { name: 'Order Notifications', value: 'Enabled', type: 'toggle' },
        { name: 'System Updates', value: 'Enabled', type: 'toggle' }
      ]
    }
  ];

  const auditLogs = [
    { 
      id: 1, 
      user: 'Admin User', 
      action: 'Login', 
      module: 'Authentication', 
      timestamp: '2026-03-28 08:30:15',
      ip: '192.168.1.100',
      status: 'success'
    },
    { 
      id: 2, 
      user: 'John Smith', 
      action: 'Create Production Order', 
      module: 'Manufacturing', 
      timestamp: '2026-03-28 07:45:22',
      ip: '192.168.1.101',
      status: 'success'
    },
    { 
      id: 3, 
      user: 'Sarah Johnson', 
      action: 'Update Customer', 
      module: 'Sales', 
      timestamp: '2026-03-27 16:20:45',
      ip: '192.168.1.102',
      status: 'success'
    },
    { 
      id: 4, 
      user: 'Unknown', 
      action: 'Failed Login', 
      module: 'Authentication', 
      timestamp: '2026-03-27 15:30:12',
      ip: '192.168.1.200',
      status: 'failed'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'active': 'bg-accentClr text-white',
      'inactive': 'bg-dangerClr text-white',
      'success': 'bg-accentClr text-white',
      'failed': 'bg-dangerClr text-white',
      'admin': 'bg-primaryClr text-primaryClrText',
      'manager': 'bg-logoGold text-primaryClr',
      'user': 'bg-secondaryClr text-primaryClr'
    };
    return (
      <span className={`px soda-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">System Administration</h1>
        <p className="text-place">Manage users, settings, and system configuration</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Users</p>
              <p className="text-2xl font-bold text-primaryClr">4</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">System Status</p>
              <p className="text-2xl font-bold text-primaryClr">Online</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">💾</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Database</p>
              <p className="text-2xl font-bold text-primaryClr">Healthy</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">CPU Usage</p>
              <p className="text-2xl font-bold text-primaryClr">23%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 soda-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 soda-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              System Settings
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 soda-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-4 soda-1 border-b-2 font-medium text-sm ${
                activeTab === 'backup'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Backup & Restore
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sodaormal border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr soda-1 soda-2 rounded-lg transition-colors">
                📊 System Report
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText soda-1 soda-2 rounded-lg transition-colors">
                ➕ Add User
              </button>
            </div>
          </div>

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">User</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Email</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Role</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Department</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Last Login</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="soda-3 soda-1">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-primaryClr">{user.name}</span>
                        </div>
                      </td>
                      <td className="soda-3 soda-1 text-sm text-place">{user.email}</td>
                      <td className="soda-3 soda-1">{getStatusBadge(user.role)}</td>
                      <td className="soda-3 soda-1 text-sm text-place">{user.department}</td>
                      <td className="soda-3 soda-1 text-sm text-place">{user.lastLogin}</td>
                      <td className="soda-3 soda-1">{getStatusBadge(user.status)}</td>
                      <td className="soda-3 soda-1">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">🔒</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'settings' && (
            <div>
              {systemSettings.map((category, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-medium text-primaryClr mb-4">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.settings.map((setting, settingIndex) => (
                      <div key={settingIndex} className="flex justify-between items-center p-4 bg-white rounded-lg border border-secondaryClr">
                        <div>
                          <p className="font-medium text-primaryClr">{setting.name}</p>
                          <p className="text-sm text-place">Current: {setting.value}</p>
                        </div>
                        <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr soda-1 soda-2 rounded transition-colors">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audit Logs */}
          {activeTab === 'audit' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">User</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Action</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Module</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Timestamp</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">IP Address</th>
                    <th className="text-left soda-3 soda-1 text-sm font-medium text-primaryClr">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="soda-3 soda-1 text-sm text-primaryClr">{log.user}</td>
                      <td className="soda-3 soda-1 text-sm text-primaryClr">{log.action}</td>
                      <td className="soda-3 soda-1 text-sm text-place">{log.module}</td>
                      <td className="soda-3 soda-1 text-sm text-place">{log.timestamp}</td>
                      <td className="soda-3 soda-1 text-sm text-place">{log.ip}</td>
                      <td className="soda-3 soda-1">{getStatusBadge(log.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="text-center py-12">
              <span className="text-4xl">💾</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Backup & Restore</h3>
              <p className="mt-2 text-place">System backup and recovery management</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors">
                  💾 Create Backup
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors">
                  📂 Restore Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
