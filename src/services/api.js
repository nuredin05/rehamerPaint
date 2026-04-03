// API Service for connecting to backend database

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/** Origin only (e.g. http://localhost:3000) — health lives at /health, not under /api/v1 */
function getBackendOrigin() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  return String(base).replace(/\/api\/v1\/?$/, '') || 'http://localhost:3000';
}

/**
 * Parse JSON body from the backend standard envelope:
 * success responses: { success, message, data?, ... }
 * errors: { success: false, error: { message, ... } }
 */
function parseJsonBody(text) {
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const rawText = await response.text();
      const body = parseJsonBody(rawText);

      const method = String(config.method || 'GET').toUpperCase();
      const pathOnly = endpoint.split('?')[0];
      const isLoginAttempt = method === 'POST' && pathOnly.endsWith('/auth/login');

      // Failed login also returns 401 — do not clear session or hard-redirect
      if (response.status === 401 && isLoginAttempt) {
        const msg =
          body?.error?.message ||
          body?.message ||
          'Invalid credentials';
        throw new Error(msg);
      }

      // Authenticated requests: expired/invalid token
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const msg =
          body?.error?.message ||
          body?.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(msg);
      }

      if (body && body.success === false) {
        throw new Error(body.error?.message || body.message || 'Request failed');
      }

      if (body && Object.prototype.hasOwnProperty.call(body, 'data')) {
        return body.data;
      }

      return body ?? {};
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST请求
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT请求
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE请求
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // ==================== ADMIN MODULE ====================
  
  // User Management
  async getUsers(params = {}) {
    return this.get('/admin/users', params);
  }

  async createUser(userData) {
    return this.post('/admin/users', userData);
  }

  async updateUser(userId, userData) {
    return this.put(`/admin/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    return this.delete(`/admin/users/${userId}`);
  }

  async toggleUserStatus(userId) {
    return this.put(`/admin/users/${userId}/toggle-status`);
  }

  // System Settings
  async getSettings() {
    return this.get('/admin/settings');
  }

  async updateSetting(settingId, settingData) {
    return this.put(`/admin/settings/${settingId}`, settingData);
  }

  // Audit Logs
  async getAuditLogs(params = {}) {
    return this.get('/admin/audit-logs', params);
  }

  async addAuditLog(logData) {
    return this.post('/admin/audit-logs', logData);
  }

  // System Statistics
  async getSystemStats() {
    return this.get('/admin/stats');
  }

  // ==================== SALES MODULE ====================
  
  // Orders
  async getOrders(params = {}) {
    return this.get('/sales/sales-orders', params);
  }

  async createOrder(orderData) {
    return this.post('/sales/sales-orders', orderData);
  }

  async updateOrder(orderId, orderData) {
    return this.put(`/sales/sales-orders/${orderId}`, orderData);
  }

  async updateOrderStatus(orderId, status) {
    return this.put(`/sales/sales-orders/${orderId}/status`, { status });
  }

  async deleteOrder(orderId) {
    return this.delete(`/sales/sales-orders/${orderId}`);
  }

  // Customers
  async getCustomers(params = {}) {
    return this.get('/sales/customers', params);
  }

  async createCustomer(customerData) {
    return this.post('/sales/customers', customerData);
  }

  async updateCustomer(customerId, customerData) {
    return this.put(`/sales/customers/${customerId}`, customerData);
  }

  async deleteCustomer(customerId) {
    return this.delete(`/sales/customers/${customerId}`);
  }

  // Invoices
  async getInvoices(params = {}) {
    return this.get('/sales/invoices', params);
  }

  async createInvoice(invoiceData) {
    return this.post('/sales/invoices', invoiceData);
  }

  async updateInvoice(invoiceId, invoiceData) {
    return this.put(`/sales/invoices/${invoiceId}`, invoiceData);
  }

  async updateInvoiceStatus(invoiceId, status) {
    return this.put(`/sales/invoices/${invoiceId}/status`, { status });
  }

  async deleteInvoice(invoiceId) {
    return this.delete(`/sales/invoices/${invoiceId}`);
  }

  // Sales Analytics
  async getSalesAnalytics(params = {}) {
    return this.get('/sales/analytics', params);
  }

  // ==================== FINANCE MODULE ====================
  
  // Transactions
  async getTransactions(params = {}) {
    return this.get('/finance/transactions', params);
  }

  async createTransaction(transactionData) {
    return this.post('/finance/transactions', transactionData);
  }

  async updateTransaction(transactionId, transactionData) {
    return this.put(`/finance/transactions/${transactionId}`, transactionData);
  }

  async updateTransactionStatus(transactionId, status) {
    return this.put(`/finance/transactions/${transactionId}/status`, { status });
  }

  async deleteTransaction(transactionId) {
    return this.delete(`/finance/transactions/${transactionId}`);
  }

  // Accounts
  async getAccounts(params = {}) {
    return this.get('/finance/accounts', params);
  }

  async createAccount(accountData) {
    return this.post('/finance/accounts', accountData);
  }

  async updateAccount(accountId, accountData) {
    return this.put(`/finance/accounts/${accountId}`, accountData);
  }

  async deleteAccount(accountId) {
    return this.delete(`/finance/accounts/${accountId}`);
  }

  // Finance Invoices
  async getFinanceInvoices(params = {}) {
    return this.get('/finance/invoices', params);
  }

  // Financial Reports
  async getFinancialReports(params = {}) {
    return this.get('/finance/reports', params);
  }

  // ==================== HR MODULE ====================
  
  // Employees
  async getEmployees(params = {}) {
    return this.get('/hr/employees', params);
  }

  async createEmployee(employeeData) {
    return this.post('/hr/employees', employeeData);
  }

  async updateEmployee(employeeId, employeeData) {
    return this.put(`/hr/employees/${employeeId}`, employeeData);
  }

  async deleteEmployee(employeeId) {
    return this.delete(`/hr/employees/${employeeId}`);
  }

  async updateEmployeeStatus(employeeId, status) {
    return this.put(`/hr/employees/${employeeId}/status`, { status });
  }

  // Departments
  async getDepartments(params = {}) {
    return this.get('/hr/departments', params);
  }

  async createDepartment(departmentData) {
    return this.post('/hr/departments', departmentData);
  }

  async updateDepartment(departmentId, departmentData) {
    return this.put(`/hr/departments/${departmentId}`, departmentData);
  }

  async deleteDepartment(departmentId) {
    return this.delete(`/hr/departments/${departmentId}`);
  }

  // Attendance
  async getAttendance(params = {}) {
    return this.get('/hr/attendance', params);
  }

  async createAttendance(attendanceData) {
    return this.post('/hr/attendance', attendanceData);
  }

  async updateAttendance(attendanceId, attendanceData) {
    return this.put(`/hr/attendance/${attendanceId}`, attendanceData);
  }

  async deleteAttendance(attendanceId) {
    return this.delete(`/hr/attendance/${attendanceId}`);
  }

  // Payroll
  async getPayroll(params = {}) {
    return this.get('/hr/payroll', params);
  }

  async createPayroll(payrollData) {
    return this.post('/hr/payroll', payrollData);
  }

  async updatePayroll(payrollId, payrollData) {
    return this.put(`/hr/payroll/${payrollId}`, payrollData);
  }

  async updatePayrollStatus(payrollId, status) {
    return this.put(`/hr/payroll/${payrollId}/status`, { status });
  }

  async deletePayroll(payrollId) {
    return this.delete(`/hr/payroll/${payrollId}`);
  }

  // HR Analytics
  async getHRAnalytics(params = {}) {
    return this.get('/hr/analytics', params);
  }

  // ==================== INVENTORY MODULE ====================
  
  async getProducts(params = {}) {
    return this.get('/inventory/products', params);
  }

  async createProduct(productData) {
    return this.post('/inventory/products', productData);
  }

  async updateProduct(productId, productData) {
    return this.put(`/inventory/products/${productId}`, productData);
  }

  async deleteProduct(productId) {
    return this.delete(`/inventory/products/${productId}`);
  }

  async getInventoryTransactions(params = {}) {
    return this.get('/inventory/transactions', params);
  }

  async createInventoryTransaction(transactionData) {
    return this.post('/inventory/transactions', transactionData);
  }

  // ==================== PROCUREMENT MODULE ====================
  
  async getPurchaseOrders(params = {}) {
    return this.get('/procurement/purchase-orders', params);
  }

  async createPurchaseOrder(orderData) {
    return this.post('/procurement/purchase-orders', orderData);
  }

  async updatePurchaseOrder(orderId, orderData) {
    return this.put(`/procurement/purchase-orders/${orderId}`, orderData);
  }

  async deletePurchaseOrder(orderId) {
    return this.delete(`/procurement/purchase-orders/${orderId}`);
  }

  async getSuppliers(params = {}) {
    return this.get('/procurement/suppliers', params);
  }

  async createSupplier(supplierData) {
    return this.post('/procurement/suppliers', supplierData);
  }

  async updateSupplier(supplierId, supplierData) {
    return this.put(`/procurement/suppliers/${supplierId}`, supplierData);
  }

  async deleteSupplier(supplierId) {
    return this.delete(`/procurement/suppliers/${supplierId}`);
  }

  // ==================== MANUFACTURING MODULE ====================
  
  async getProductionOrders(params = {}) {
    return this.get('/manufacturing/production-orders', params);
  }

  async createProductionOrder(orderData) {
    return this.post('/manufacturing/production-orders', orderData);
  }

  async updateProductionOrder(orderId, orderData) {
    return this.put(`/manufacturing/production-orders/${orderId}`, orderData);
  }

  async deleteProductionOrder(orderId) {
    return this.delete(`/manufacturing/production-orders/${orderId}`);
  }

  async getBillOfMaterials(params = {}) {
    return this.get('/manufacturing/bom', params);
  }

  async createBillOfMaterials(bomData) {
    return this.post('/manufacturing/bom', bomData);
  }

  async getQualityChecks(params = {}) {
    return this.get('/manufacturing/quality-checks', params);
  }

  async createQualityCheck(checkData) {
    return this.post('/manufacturing/quality-checks', checkData);
  }

  // ==================== LOGISTICS MODULE ====================
  
  async getDeliveries(params = {}) {
    return this.get('/logistics/delivery-orders', params);
  }

  async createDelivery(deliveryData) {
    return this.post('/logistics/delivery-orders', deliveryData);
  }

  async updateDelivery(deliveryId, deliveryData) {
    return this.put(`/logistics/delivery-orders/${deliveryId}`, deliveryData);
  }

  async deleteDelivery(deliveryId) {
    return this.delete(`/logistics/delivery-orders/${deliveryId}`);
  }

  async getVehicles(params = {}) {
    return this.get('/logistics/vehicles', params);
  }

  async createVehicle(vehicleData) {
    return this.post('/logistics/vehicles', vehicleData);
  }

  async updateVehicle(vehicleId, vehicleData) {
    return this.put(`/logistics/vehicles/${vehicleId}`, vehicleData);
  }

  async deleteVehicle(vehicleId) {
    return this.delete(`/logistics/vehicles/${vehicleId}`);
  }

  async getDrivers(params = {}) {
    return this.get('/logistics/drivers', params);
  }

  async createDriver(driverData) {
    return this.post('/logistics/drivers', driverData);
  }

  async updateDriver(driverId, driverData) {
    return this.put(`/logistics/drivers/${driverId}`, driverData);
  }

  async deleteDriver(driverId) {
    return this.delete(`/logistics/drivers/${driverId}`);
  }

  // ==================== REPORTS MODULE ====================
  
  async getReportData(reportType, params = {}) {
    return this.get(`/reports/${reportType}`, params);
  }

  async generateReport(reportConfig) {
    return this.post('/reports/generate', reportConfig);
  }

  async getSavedReports(params = {}) {
    return this.get('/reports/saved', params);
  }

  async saveReport(reportData) {
    return this.post('/reports/saved', reportData);
  }

  // ==================== AUTHENTICATION ====================
  
  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async refreshToken() {
    return this.post('/auth/refresh');
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.put('/auth/profile', profileData);
  }

  async changePassword(passwordData) {
    return this.post('/auth/change-password', passwordData);
  }

  // ==================== UTILITY METHODS ====================
  
  // Health check
  async healthCheck() {
    const response = await fetch(`${getBackendOrigin()}/health`);
    const rawText = await response.text();
    const body = parseJsonBody(rawText);
    if (!response.ok) {
      throw new Error(body?.error?.message || body?.message || `Health check failed: ${response.status}`);
    }
    return body ?? {};
  }

  /** Swagger UI is mounted at server root (not under /api/v1). */
  getApiDocsUrl() {
    return `${getBackendOrigin()}/api-docs`;
  }

  // Upload file (for features like import/export)
  async uploadFile(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: token ? `Bearer ${token}` : '',
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers,
      });

      const t = await response.text();
      if (!response.ok) {
        const err = parseJsonBody(t);
        throw new Error(err?.error?.message || err?.message || `Upload failed: ${response.statusText}`);
      }

      const json = parseJsonBody(t);
      if (json && Object.prototype.hasOwnProperty.call(json, 'data')) {
        return json.data;
      }
      return json ?? {};
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Export data
  async exportData(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: token ? `Bearer ${token}` : '',
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const t = await response.text();
        const err = parseJsonBody(t);
        throw new Error(err?.error?.message || err?.message || `Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Data export failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
