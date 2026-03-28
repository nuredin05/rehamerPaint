// API Service for connecting to backend database

const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your backend URL

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET请求
  async get(endpoint) {
    return this.request(endpoint);
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
  async getUsers() {
    return this.get('/admin/users');
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

  async updateSetting(settingName, value) {
    return this.put('/admin/settings', { name: settingName, value });
  }

  // Audit Logs
  async getAuditLogs() {
    return this.get('/admin/audit-logs');
  }

  async addAuditLog(logData) {
    return this.post('/admin/audit-logs', logData);
  }

  // ==================== SALES MODULE ====================
  
  // Orders
  async getOrders() {
    return this.get('/sales/orders');
  }

  async createOrder(orderData) {
    return this.post('/sales/orders', orderData);
  }

  async updateOrderStatus(orderId, status) {
    return this.put(`/sales/orders/${orderId}/status`, { status });
  }

  async deleteOrder(orderId) {
    return this.delete(`/sales/orders/${orderId}`);
  }

  // Customers
  async getCustomers() {
    return this.get('/sales/customers');
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
  async getInvoices() {
    return this.get('/sales/invoices');
  }

  async createInvoice(invoiceData) {
    return this.post('/sales/invoices', invoiceData);
  }

  async updateInvoiceStatus(invoiceId, status) {
    return this.put(`/sales/invoices/${invoiceId}/status`, { status });
  }

  async deleteInvoice(invoiceId) {
    return this.delete(`/sales/invoices/${invoiceId}`);
  }

  // ==================== FINANCE MODULE ====================
  
  // Transactions
  async getTransactions() {
    return this.get('/finance/transactions');
  }

  async createTransaction(transactionData) {
    return this.post('/finance/transactions', transactionData);
  }

  async updateTransactionStatus(transactionId, status) {
    return this.put(`/finance/transactions/${transactionId}/status`, { status });
  }

  async deleteTransaction(transactionId) {
    return this.delete(`/finance/transactions/${transactionId}`);
  }

  // Accounts
  async getAccounts() {
    return this.get('/finance/accounts');
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
  async getFinanceInvoices() {
    return this.get('/finance/invoices');
  }

  // ==================== HR MODULE ====================
  
  // Employees
  async getEmployees() {
    return this.get('/hr/employees');
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
  async getDepartments() {
    return this.get('/hr/departments');
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
  async getAttendance() {
    return this.get('/hr/attendance');
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
  async getPayroll() {
    return this.get('/hr/payroll');
  }

  async createPayroll(payrollData) {
    return this.post('/hr/payroll', payrollData);
  }

  async updatePayrollStatus(payrollId, status) {
    return this.put(`/hr/payroll/${payrollId}/status`, { status });
  }

  // ==================== INVENTORY MODULE ====================
  
  async getProducts() {
    return this.get('/inventory/products');
  }

  async getInventoryTransactions() {
    return this.get('/inventory/transactions');
  }

  async createInventoryTransaction(transactionData) {
    return this.post('/inventory/transactions', transactionData);
  }

  // ==================== PROCUREMENT MODULE ====================
  
  async getPurchaseOrders() {
    return this.get('/procurement/purchase-orders');
  }

  async createPurchaseOrder(orderData) {
    return this.post('/procurement/purchase-orders', orderData);
  }

  async getSuppliers() {
    return this.get('/procurement/suppliers');
  }

  async createSupplier(supplierData) {
    return this.post('/procurement/suppliers', supplierData);
  }

  // ==================== MANUFACTURING MODULE ====================
  
  async getProductionOrders() {
    return this.get('/manufacturing/production-orders');
  }

  async createProductionOrder(orderData) {
    return this.post('/manufacturing/production-orders', orderData);
  }

  async getBillOfMaterials() {
    return this.get('/manufacturing/bill-of-materials');
  }

  async getQualityChecks() {
    return this.get('/manufacturing/quality-checks');
  }

  // ==================== LOGISTICS MODULE ====================
  
  async getDeliveries() {
    return this.get('/logistics/deliveries');
  }

  async createDelivery(deliveryData) {
    return this.post('/logistics/deliveries', deliveryData);
  }

  async getVehicles() {
    return this.get('/logistics/vehicles');
  }

  async getDrivers() {
    return this.get('/logistics/drivers');
  }

  // ==================== REPORTS MODULE ====================
  
  async getReportData(reportType) {
    return this.get(`/reports/${reportType}`);
  }

  async generateReport(reportConfig) {
    return this.post('/reports/generate', reportConfig);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
