import React, { useState, useEffect } from 'react';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
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
  ]);

  const [systemSettings, setSystemSettings] = useState([
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
  ]);

  const [auditLogs, setAuditLogs] = useState([
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
  ]);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    status: 'active'
  });

  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    status: 'active'
  });

  const [settingValue, setSettingValue] = useState('');

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const userToAdd = {
      id: users.length + 1,
      ...newUser,
      lastLogin: 'Never'
    };

    setUsers([...users, userToAdd]);
    setNewUser({ name: '', email: '', role: 'user', department: '', status: 'active' });
    setShowUserModal(false);
    showNotification('User added successfully', 'success');

    // Add audit log
    const newLog = {
      id: auditLogs.length + 1,
      user: 'Admin User',
      action: 'Create User',
      module: 'Administration',
      timestamp: new Date().toLocaleString(),
      ip: '192.168.1.100',
      status: 'success'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Edit user
  const handleEditUser = () => {
    if (!editUser.name || !editUser.email || !editUser.department) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...editUser }
        : user
    ));
    setShowEditUserModal(false);
    setSelectedUser(null);
    showNotification('User updated successfully', 'success');

    // Add audit log
    const newLog = {
      id: auditLogs.length + 1,
      user: 'Admin User',
      action: 'Update User',
      module: 'Administration',
      timestamp: new Date().toLocaleString(),
      ip: '192.168.1.100',
      status: 'success'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      showNotification('User deleted successfully', 'success');

      // Add audit log
      const newLog = {
        id: auditLogs.length + 1,
        user: 'Admin User',
        action: 'Delete User',
        module: 'Administration',
        timestamp: new Date().toLocaleString(),
        ip: '192.168.1.100',
        status: 'success'
      };
      setAuditLogs([newLog, ...auditLogs]);
    }
  };

  // Toggle user status
  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    showNotification('User status updated', 'success');
  };

  // Update setting
  const handleUpdateSetting = () => {
    setSystemSettings(systemSettings.map(category => ({
      ...category,
      settings: category.settings.map(setting =>
        setting.name === selectedSetting.name
          ? { ...setting, value: settingValue }
          : setting
      )
    })));
    setShowSettingModal(false);
    setSelectedSetting(null);
    setSettingValue('');
    showNotification('Setting updated successfully', 'success');
  };

  // Open edit user modal
  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setShowEditUserModal(true);
  };

  // Open view user modal
  const openViewUserModal = (user) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  // Open setting modal
  const openSettingModal = (setting) => {
    setSelectedSetting(setting);
    setSettingValue(setting.value);
    setShowSettingModal(true);
  };

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
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">System Administration</h1>
        <p className="text-place">Manage users, settings, and system configuration</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-accentClr text-white' : 'bg-dangerClr text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Users</p>
              <p className="text-2xl font-bold text-primaryClr">{users.length}</p>
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              System Settings
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                className="w-full px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors">
                📊 System Report
              </button>
              <button 
                onClick={() => setShowUserModal(true)}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Last Login</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-primaryClr">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{user.email}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.role)}</td>
                      <td className="py-3 px-4 text-sm text-place">{user.department}</td>
                      <td className="py-3 px-4 text-sm text-place">{user.lastLogin}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openViewUserModal(user)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="View User"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => openEditUserModal(user)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="Edit User"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-primaryClr hover:text-primaryClrLight"
                            title="Toggle Status"
                          >
                            🔒
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-dangerClr hover:text-dangerClrLight"
                            title="Delete User"
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
                        <button 
                          onClick={() => openSettingModal(setting)}
                          className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded transition-colors"
                        >
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Module</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">IP Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4 text-sm text-primaryClr">{log.user}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{log.action}</td>
                      <td className="py-3 px-4 text-sm text-place">{log.module}</td>
                      <td className="py-3 px-4 text-sm text-place">{log.timestamp}</td>
                      <td className="py-3 px-4 text-sm text-place">{log.ip}</td>
                      <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
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
                <button 
                  onClick={() => showNotification('Backup initiated successfully', 'success')}
                  className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors"
                >
                  💾 Create Backup
                </button>
                <button 
                  onClick={() => showNotification('Restore feature coming soon', 'success')}
                  className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors"
                >
                  📂 Restore Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Department *</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">User Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-place">Name:</span>
                <p className="font-medium text-primaryClr">{selectedUser.name}</p>
              </div>
              <div>
                <span className="text-sm text-place">Email:</span>
                <p className="font-medium text-primaryClr">{selectedUser.email}</p>
              </div>
              <div>
                <span className="text-sm text-place">Role:</span>
                <div className="mt-1">{getStatusBadge(selectedUser.role)}</div>
              </div>
              <div>
                <span className="text-sm text-place">Department:</span>
                <p className="font-medium text-primaryClr">{selectedUser.department}</p>
              </div>
              <div>
                <span className="text-sm text-place">Status:</span>
                <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
              </div>
              <div>
                <span className="text-sm text-place">Last Login:</span>
                <p className="font-medium text-primaryClr">{selectedUser.lastLogin}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewUserModal(false)}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Name *</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Department *</label>
                <input
                  type="text"
                  value={editUser.department}
                  onChange={(e) => setEditUser({...editUser, department: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Status</label>
                <select
                  value={editUser.status}
                  onChange={(e) => setEditUser({...editUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditUserModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setting Modal */}
      {showSettingModal && selectedSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-primaryClr mb-4">Edit Setting: {selectedSetting.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Current Value</label>
                <p className="text-sm text-place mb-2">{selectedSetting.value}</p>
                <label className="block text-sm font-medium text-primaryClr mb-1">New Value</label>
                {selectedSetting.type === 'toggle' ? (
                  <select
                    value={settingValue}
                    onChange={(e) => setSettingValue(e.target.value)}
                    className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                ) : selectedSetting.type === 'select' ? (
                  <select
                    value={settingValue}
                    onChange={(e) => setSettingValue(e.target.value)}
                    className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                  >
                    {selectedSetting.name === 'Time Zone' && (
                      <>
                        <option value="UTC+03:00">UTC+03:00</option>
                        <option value="UTC+00:00">UTC+00:00</option>
                        <option value="UTC-05:00">UTC-05:00</option>
                      </>
                    )}
                    {selectedSetting.name === 'Date Format' && (
                      <>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </>
                    )}
                    {selectedSetting.name === 'Currency' && (
                      <>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </>
                    )}
                    {selectedSetting.name === 'Password Policy' && (
                      <>
                        <option value="Weak">Weak</option>
                        <option value="Medium">Medium</option>
                        <option value="Strong">Strong</option>
                      </>
                    )}
                    {selectedSetting.name === 'Session Timeout' && (
                      <>
                        <option value="15 minutes">15 minutes</option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="60 minutes">60 minutes</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type={selectedSetting.type}
                    value={settingValue}
                    onChange={(e) => setSettingValue(e.target.value)}
                    className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettingModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSetting}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors"
              >
                Update Setting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
