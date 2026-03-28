import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useApiData, useCrudOperations, useNotification, useSearchFilter, useModal, useForm } from '../hooks/useApiData';
import { 
  Users, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Database, 
  Wifi,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Lock,
  X,
  Save,
  AlertCircle,
  HelpCircle,
  FileText,
  HardDrive
} from 'lucide-react';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  // Custom hooks
  const { showNotification, notification } = useNotification();
  const { searchTerm, setSearchTerm, filteredData: filteredUsers } = useSearchFilter([], ['name', 'email', 'department']);
  const { isOpen: showUserModal, selectedItem: selectedUser, openModal: openUserModal, closeModal: closeUserModal } = useModal();
  const { isOpen: showViewModal, selectedItem: viewItem, openModal: openViewModal, closeModal: closeViewModal } = useModal();
  const { isOpen: showEditModal, selectedItem: editItem, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: showSettingModal, selectedItem: selectedSetting, openModal: openSettingModal, closeModal: closeSettingModal } = useModal();

  // Form hooks
  const newUserForm = useForm({
    name: '',
    email: '',
    role: 'user',
    department: '',
    status: 'active'
  });

  const editUserForm = useForm({
    name: '',
    email: '',
    role: 'user',
    department: '',
    status: 'active'
  });

  // API data hooks
  const { data: users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useApiData(
    () => apiService.getUsers(),
    []
  );

  const { data: auditLogs, loading: auditLoading, refetch: refetchAuditLogs } = useApiData(
    () => apiService.getAuditLogs(),
    []
  );

  const { data: systemSettings, loading: settingsLoading } = useApiData(
    () => apiService.getSettings(),
    []
  );

  // CRUD operations
  const userCrud = useCrudOperations({
    create: apiService.createUser,
    update: (id, data) => apiService.updateUser(id, data),
    delete: apiService.deleteUser,
    updateStatus: apiService.toggleUserStatus
  });

  // Update filtered users when users data changes
  useEffect(() => {
    if (users.length > 0) {
      filteredUsers.splice(0, filteredUsers.length, ...users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [users, searchTerm]);

  // Handle add user
  const handleAddUser = async () => {
    const validationRules = {
      name: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      department: { required: true }
    };

    if (!newUserForm.validate(validationRules)) {
      showNotification('Please fill all required fields correctly', 'error');
      return;
    }

    const result = await userCrud.create(newUserForm.values);
    if (result.success) {
      showNotification('User added successfully', 'success');
      newUserForm.reset();
      closeUserModal();
      refetchUsers();
      
      // Add audit log
      try {
        await apiService.addAuditLog({
          user: 'Admin User',
          action: 'Create User',
          module: 'Administration',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
          status: 'success'
        });
        refetchAuditLogs();
      } catch (err) {
        console.error('Failed to add audit log:', err);
      }
    } else {
      showNotification(result.error, 'error');
    }
  };

  // Handle edit user
  const handleEditUser = async () => {
    if (!editItem) return;

    const validationRules = {
      name: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      department: { required: true }
    };

    if (!editUserForm.validate(validationRules)) {
      showNotification('Please fill all required fields correctly', 'error');
      return;
    }

    const result = await userCrud.update(editItem.id, editUserForm.values);
    if (result.success) {
      showNotification('User updated successfully', 'success');
      closeEditModal();
      refetchUsers();
      
      // Add audit log
      try {
        await apiService.addAuditLog({
          user: 'Admin User',
          action: 'Update User',
          module: 'Administration',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
          status: 'success'
        });
        refetchAuditLogs();
      } catch (err) {
        console.error('Failed to add audit log:', err);
      }
    } else {
      showNotification(result.error, 'error');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await userCrud.remove(userId);
      if (result.success) {
        showNotification('User deleted successfully', 'success');
        refetchUsers();
        
        // Add audit log
        try {
          await apiService.addAuditLog({
            user: 'Admin User',
            action: 'Delete User',
            module: 'Administration',
            timestamp: new Date().toISOString(),
            ip: '192.168.1.100',
            status: 'success'
          });
          refetchAuditLogs();
        } catch (err) {
          console.error('Failed to add audit log:', err);
        }
      } else {
        showNotification(result.error, 'error');
      }
    }
  };

  // Handle toggle user status
  const handleToggleUserStatus = async (userId) => {
    const result = await userCrud.updateStatus(userId);
    if (result.success) {
      showNotification('User status updated', 'success');
      refetchUsers();
    } else {
      showNotification(result.error, 'error');
    }
  };

  // Handle update setting
  const handleUpdateSetting = async () => {
    if (!selectedSetting) return;

    try {
      await apiService.updateSetting(selectedSetting.name, selectedSetting.value);
      showNotification('Setting updated successfully', 'success');
      closeSettingModal();
    } catch (err) {
      showNotification('Failed to update setting', 'error');
    }
  };

  // Open edit modal with user data
  const openEditUserModal = (user) => {
    openEditModal(user);
    editUserForm.setValuesBatch({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
  };

  // Open setting modal
  const openSettingModalHandler = (setting) => {
    openSettingModal(setting);
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

  // Loading states
  if (usersLoading || auditLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-primaryClr">
          <Settings className="animate-spin" size={24} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Error states
  if (usersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-dangerClr">
          <AlertCircle size={24} />
          <span>Error loading users: {usersError}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">System Administration</h1>
        <p className="text-place">Manage users, settings, and system configuration</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-accentClr text-white' : 'bg-dangerClr text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <Users size={24} className="text-white" />
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
              <CheckCircle size={24} className="text-primaryClr" />
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
              <Database size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Database</p>
              <p className="text-2xl font-bold text-primaryClr">Connected</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <Wifi size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">API Status</p>
              <p className="text-2xl font-bold text-primaryClr">Active</p>
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
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Users size={16} />
              <span>User Management</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Settings size={16} />
              <span>System Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'audit'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <FileText size={16} />
              <span>Audit Logs</span>
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'backup'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <HardDrive size={16} />
              <span>Backup & Restore</span>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <FileText size={16} />
                <span>System Report</span>
              </button>
              <button 
                onClick={() => openUserModal()}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                disabled={userCrud.loading}
              >
                <Plus size={16} />
                <span>{userCrud.loading ? 'Adding...' : 'Add User'}</span>
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
                            <Users size={16} className="text-primaryClrText" />
                          </div>
                          <span className="font-medium text-primaryClr">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{user.email}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.role)}</td>
                      <td className="py-3 px-4 text-sm text-place">{user.department}</td>
                      <td className="py-3 px-4 text-sm text-place">{user.lastLogin || 'Never'}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openViewModal(user)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View User"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => openEditUserModal(user)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Toggle Status"
                          >
                            <Lock size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete User"
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
                          onClick={() => openSettingModalHandler(setting)}
                          className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px4 py-2 rounded transition-colors flex items-center space-x-2"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
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
                      <td className="py-3 px-4 text-sm text-place">{new Date(log.timestamp).toLocaleString()}</td>
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
              <HardDrive size={48} className="mx-auto text-primaryClr mb-4" />
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Backup & Restore</h3>
              <p className="mt-2 text-place">System backup and recovery management</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button 
                  onClick={() => showNotification('Backup initiated successfully', 'success')}
                  className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Database size={16} />
                  <span>Create Backup</span>
                </button>
                <button 
                  onClick={() => showNotification('Restore feature coming soon', 'success')}
                  className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <HardDrive size={16} />
                  <span>Restore Backup</span>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Plus size={20} />
                <span>Add New User</span>
              </h2>
              <button
                onClick={closeUserModal}
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
                  value={newUserForm.values.name}
                  onChange={(e) => newUserForm.setValue('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr ${
                    newUserForm.errors.name ? 'border-dangerClr' : 'border-secondaryClr'
                  }`}
                />
                {newUserForm.errors.name && (
                  <p className="text-dangerClr text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{newUserForm.errors.name}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={newUserForm.values.email}
                  onChange={(e) => newUserForm.setValue('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr ${
                    newUserForm.errors.email ? 'border-dangerClr' : 'border-secondaryClr'
                  }`}
                />
                {newUserForm.errors.email && (
                  <p className="text-dangerClr text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{newUserForm.errors.email}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Role</label>
                <select
                  value={newUserForm.values.role}
                  onChange={(e) => newUserForm.setValue('role', e.target.value)}
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
                  value={newUserForm.values.department}
                  onChange={(e) => newUserForm.setValue('department', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr ${
                    newUserForm.errors.department ? 'border-dangerClr' : 'border-secondaryClr'
                  }`}
                />
                {newUserForm.errors.department && (
                  <p className="text-dangerClr text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{newUserForm.errors.department}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeUserModal}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddUser}
                disabled={userCrud.loading}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {userCrud.loading ? (
                  <Settings className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                <span>{userCrud.loading ? 'Adding...' : 'Add User'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && viewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Eye size={20} />
                <span>User Details</span>
              </h2>
              <button
                onClick={closeViewModal}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-place">Name:</span>
                <p className="font-medium text-primaryClr">{viewItem.name}</p>
              </div>
              <div>
                <span className="text-sm text-place">Email:</span>
                <p className="font-medium text-primaryClr">{viewItem.email}</p>
              </div>
              <div>
                <span className="text-sm text-place">Role:</span>
                <div className="mt-1">{getStatusBadge(viewItem.role)}</div>
              </div>
              <div>
                <span className="text-sm text-place">Department:</span>
                <p className="font-medium text-primaryClr">{viewItem.department}</p>
              </div>
              <div>
                <span className="text-sm text-place">Status:</span>
                <div className="mt-1">{getStatusBadge(viewItem.status)}</div>
              </div>
              <div>
                <span className="text-sm text-place">Last Login:</span>
                <p className="font-medium text-primaryClr">{viewItem.lastLogin || 'Never'}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeViewModal}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Edit size={20} />
                <span>Edit User</span>
              </h2>
              <button
                onClick={closeEditModal}
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
                  value={editUserForm.values.name}
                  onChange={(e) => editUserForm.setValue('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr ${
                    editUserForm.errors.name ? 'border-dangerClr' : 'border-secondaryClr'
                  }`}
                />
                {editUserForm.errors.name && (
                  <p className="text-dangerClr text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{editUserForm.errors.name}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={editUserForm.values.email}
                  onChange={(e) => editUserForm.setValue('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr ${
                    editUserForm.errors.email ? 'border-dangerClr' : 'border-secondaryClr'
                  }`}
                />
                {editUserForm.errors.email && (
                  <p className="text-dangerClr text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{editUserForm.errors.email}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Role</label>
                <select
                  value={editUserForm.values.role}
                  onChange={(e) => editUserForm.setValue('role', e.target.value)}
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
                  value={editUserForm.values.department}
                  onChange={(e) => editUserForm.setValue('department', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr ${
                    editUserForm.errors.department ? 'border-dangerClr' : 'border-secondaryClr'
                  }`}
                />
                {editUserForm.errors.department && (
                  <p className="text-dangerClr text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{editUserForm.errors.department}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Status</label>
                <select
                  value={editUserForm.values.status}
                  onChange={(e) => editUserForm.setValue('status', e.target.value)}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={closeEditModal}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-4"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleEditUser}
                disabled={userCrud.loading}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-4"
              >
                {userCrud.loading ? (
                  <Settings className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                <span>{userCrud.loading ? 'Updating...' : 'Update User'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setting Modal */}
      {showSettingModal && selectedSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-4">
                <Settings size={20} />
                <span>Edit Setting: {selectedSetting.name}</span>
              </h2>
              <button
                onClick={closeSettingModal}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Current Value</label>
                <p className="text-4- text-place mb-4-">{selectedSetting.value}</p>
                <label className="block text-sm font-medium text-primaryClr mb-1">New Value</label>
                <input
                  type="text"
                  value={selectedSetting.value}
                  onChange={(e) => selectedSetting.value = e.target.value}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={closeSettingModal}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-4"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleUpdateSetting}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-4"
              >
                <Save size={16} />
                <span>Update Setting</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
