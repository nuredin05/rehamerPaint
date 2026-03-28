import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Calendar,
  DollarSign,
  Building,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Printer,
  X,
  Check,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Activity,
  Clock,
  UserCheck,
  UserMinus,
  FileText,
  TrendingUp,
  PieChart,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Wallet
} from 'lucide-react';

export const HR = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@rehamerpaint.com',
      department: 'Manufacturing',
      position: 'Production Manager',
      salary: 55000,
      hireDate: '2023-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@rehamerpaint.com',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 42000,
      hireDate: '2023-03-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@rehamerpaint.com',
      department: 'Finance',
      position: 'Accountant',
      salary: 48000,
      hireDate: '2022-11-10',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@rehamerpaint.com',
      department: 'HR',
      position: 'HR Specialist',
      salary: 45000,
      hireDate: '2024-02-01',
      status: 'on-leave'
    },
  ]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Manufacturing',
      manager: 'John Smith',
      employees: 8,
      budget: 450000,
      description: 'Production and quality control'
    },
    {
      id: 2,
      name: 'Sales',
      manager: 'Sarah Johnson',
      employees: 4,
      budget: 120000,
      description: 'Customer relations and sales'
    },
    {
      id: 3,
      name: 'Finance',
      manager: 'Mike Chen',
      employees: 3,
      budget: 180000,
      description: 'Financial management and accounting'
    },
    {
      id: 4,
      name: 'HR',
      manager: 'Emily Davis',
      employees: 2,
      budget: 95000,
      description: 'Human resources and administration'
    },
  ]);

  const [attendance, setAttendance] = useState([
    {
      id: 1,
      employee: 'John Smith',
      date: '2026-03-28',
      checkIn: '08:30',
      checkOut: '17:45',
      status: 'present',
      department: 'Manufacturing'
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      date: '2026-03-28',
      checkIn: '08:45',
      checkOut: '17:30',
      status: 'present',
      department: 'Sales'
    },
    {
      id: 3,
      employee: 'Mike Chen',
      date: '2026-03-28',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      department: 'Finance'
    },
    {
      id: 4,
      employee: 'Emily Davis',
      date: '2026-03-28',
      checkIn: '09:15',
      checkOut: '17:00',
      status: 'late',
      department: 'HR'
    },
  ]);

  const [payroll, setPayroll] = useState([
    {
      id: 1,
      employee: 'John Smith',
      month: 'March 2026',
      basicSalary: 55000,
      allowance: 5000,
      deduction: 5500,
      netSalary: 54500,
      status: 'paid'
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      month: 'March 2026',
      basicSalary: 42000,
      allowance: 3000,
      deduction: 4200,
      netSalary: 40800,
      status: 'paid'
    },
    {
      id: 3,
      employee: 'Mike Chen',
      month: 'March 2026',
      basicSalary: 48000,
      allowance: 4000,
      deduction: 4800,
      netSalary: 47200,
      status: 'pending'
    },
    {
      id: 4,
      employee: 'Emily Davis',
      month: 'March 2026',
      basicSalary: 45000,
      allowance: 3500,
      deduction: 4500,
      netSalary: 44000,
      status: 'pending'
    },
  ]);

  // Modal states
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    hireDate: '',
    status: 'active'
  });

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    budget: '',
    description: ''
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

  // Add new employee
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.position || !newEmployee.salary) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const employeeToAdd = {
      id: employees.length + 1,
      ...newEmployee,
      salary: parseFloat(newEmployee.salary),
      hireDate: newEmployee.hireDate || new Date().toISOString().split('T')[0]
    };

    setEmployees([...employees, employeeToAdd]);

    // Update department employee count
    const dept = departments.find(d => d.name === newEmployee.department);
    if (dept) {
      setDepartments(departments.map(d =>
        d.name === newEmployee.department
          ? { ...d, employees: d.employees + 1 }
          : d
      ));
    }

    setNewEmployee({
      name: '',
      email: '',
      department: '',
      position: '',
      salary: '',
      hireDate: '',
      status: 'active'
    });
    setShowEmployeeModal(false);
    showNotification('Employee added successfully', 'success');
  };

  // Add new department
  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager || !newDepartment.budget) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const departmentToAdd = {
      id: departments.length + 1,
      ...newDepartment,
      employees: 0,
      budget: parseFloat(newDepartment.budget)
    };

    setDepartments([...departments, departmentToAdd]);
    setNewDepartment({
      name: '',
      manager: '',
      budget: '',
      description: ''
    });
    setShowDepartmentModal(false);
    showNotification('Department added successfully', 'success');
  };

  // Update employee status
  const updateEmployeeStatus = (employeeId, newStatus) => {
    setEmployees(employees.map(employee =>
      employee.id === employeeId
        ? { ...employee, status: newStatus }
        : employee
    ));
    showNotification('Employee status updated', 'success');
  };

  // Update payroll status
  const updatePayrollStatus = (payrollId, newStatus) => {
    setPayroll(payroll.map(item =>
      item.id === payrollId
        ? { ...item, status: newStatus }
        : item
    ));
    showNotification('Payroll status updated', 'success');
  };

  // Delete item
  const deleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'employee') {
        const employee = employees.find(e => e.id === id);
        setEmployees(employees.filter(employee => employee.id !== id));

        // Update department employee count
        const dept = departments.find(d => d.name === employee.department);
        if (dept) {
          setDepartments(departments.map(d =>
            d.name === employee.department
              ? { ...d, employees: d.employees - 1 }
              : d
          ));
        }
      } else if (type === 'department') {
        setDepartments(departments.filter(department => department.id !== id));
      } else if (type === 'attendance') {
        setAttendance(attendance.filter(record => record.id !== id));
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
      'active': 'bg-accentClr text-white',
      'inactive': 'bg-dangerClr text-white',
      'on-leave': 'bg-logoGold text-primaryClr',
      'present': 'bg-accentClr text-white',
      'absent': 'bg-dangerClr text-white',
      'late': 'bg-logoGold text-primaryClr',
      'paid': 'bg-accentClr text-white',
      'pending': 'bg-logoGold text-primaryClr'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  // Calculate totals
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalPayroll = payroll.reduce((sum, p) => sum + p.netSalary, 0);
  const presentToday = attendance.filter(a => a.status === 'present').length;

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendance = attendance.filter(record =>
    record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayroll = payroll.filter(record =>
    record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">HR Management</h1>
        <p className="text-place">Manage employees, departments, attendance, and payroll</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <Users size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Employees</p>
              <p className="text-2xl font-bold text-primaryClr">{totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <UserCheck size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Active Employees</p>
              <p className="text-2xl font-bold text-primaryClr">{activeEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <Calendar size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Present Today</p>
              <p className="text-2xl font-bold text-primaryClr">{presentToday}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Monthly Payroll</p>
              <p className="text-2xl font-bold text-primaryClr">${totalPayroll.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'employees'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Users size={16} />
              <span>Employees</span>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'departments'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Building size={16} />
              <span>Departments</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'attendance'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Calendar size={16} />
              <span>Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'payroll'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <DollarSign size={16} />
              <span>Payroll</span>
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
                <span>HR Reports</span>
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'employees') setShowEmployeeModal(true);
                  else if (activeTab === 'departments') setShowDepartmentModal(true);
                }}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add {activeTab.slice(0, -1)}</span>
              </button>
            </div>
          </div>

          {/* Employees Table */}
          {activeTab === 'employees' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Position</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Hire Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <Users size={16} className="text-primaryClrText" />
                          </div>
                          <div>
                            <span className="font-medium text-primaryClr">{employee.name}</span>
                            <p className="text-xs text-place">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-place">{employee.department}</td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{employee.position}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${employee.salary.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-place">{employee.hireDate}</td>
                      <td className="py-3 px-4">{getStatusBadge(employee.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('employee', employee)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Employee"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Employee">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => updateEmployeeStatus(employee.id, employee.status === 'active' ? 'on-leave' : 'active')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Toggle Status"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('employee', employee.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Employee"
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

          {/* Departments Table */}
          {activeTab === 'departments' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Manager</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Employees</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Budget</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((department) => (
                    <tr key={department.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <Building size={16} className="text-primaryClrText" />
                          </div>
                          <span className="font-medium text-primaryClr">{department.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{department.manager}</td>
                      <td className="py-3 px-4 text-sm text-place">{department.employees}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${department.budget.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-place">{department.description}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('department', department)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Department"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Department">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('department', department.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Department"
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

          {/* Attendance Table */}
          {activeTab === 'attendance' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Check In</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Check Out</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4 text-sm text-primaryClr">{record.employee}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.checkIn}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.checkOut}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.department}</td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('attendance', record)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Record"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Record">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem('attendance', record.id)}
                            className="text-dangerClr hover:text-dangerClrLight p-1"
                            title="Delete Record"
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

          {/* Payroll Table */}
          {activeTab === 'payroll' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondaryClr">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Month</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Basic Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Allowance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Deduction</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Net Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((record) => (
                    <tr key={record.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4 text-sm text-primaryClr">{record.employee}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.month}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${record.basicSalary.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-accentClr">+${record.allowance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-dangerClr">-${record.deduction.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm font-bold text-primaryClr">${record.netSalary.toLocaleString()}</td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItemDetails('payroll', record)}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="View Payroll"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Edit Payroll">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => updatePayrollStatus(record.id, record.status === 'pending' ? 'paid' : 'pending')}
                            className="text-primaryClr hover:text-primaryClrLight p-1"
                            title="Mark as Paid"
                          >
                            <CreditCard size={16} />
                          </button>
                          <button className="text-primaryClr hover:text-primaryClrLight p-1" title="Print Payslip">
                            <Printer size={16} />
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

      {/* Add Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Users size={20} />
                <span>Add New Employee</span>
              </h2>
              <button
                onClick={() => setShowEmployeeModal(false)}
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
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Email *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Department *</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Position *</label>
                <input
                  type="text"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Salary ($) *</label>
                <input
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Hire Date</label>
                <input
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddEmployee}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-primaryClr flex items-center space-x-2">
                <Building size={20} />
                <span>Add New Department</span>
              </h2>
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="text-place hover:text-primaryClr"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Department Name *</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Manager *</label>
                <input
                  type="text"
                  value={newDepartment.manager}
                  onChange={(e) => setNewDepartment({...newDepartment, manager: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Budget ($) *</label>
                <input
                  type="number"
                  value={newDepartment.budget}
                  onChange={(e) => setNewDepartment({...newDepartment, budget: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryClr mb-1">Description</label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleAddDepartment}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Add Department</span>
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
                    {typeof value === 'number' && key.includes('Salary') || key.includes('Budget') || key.includes('Net') || key.includes('Basic') || key.includes('Allowance') || key.includes('Deduction')
                      ? `$${value.toLocaleString()}`
                      : value}
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

export default HR;
