import React, { useState } from 'react';

export const HR = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@rehamerpaint.com', 
      position: 'Production Manager', 
      department: 'Manufacturing',
      status: 'active',
      hireDate: '2023-01-15',
      salary: 65000
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@rehamerpaint.com', 
      position: 'Sales Representative', 
      department: 'Sales',
      status: 'active',
      hireDate: '2023-03-20',
      salary: 48000
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      email: 'michael.chen@rehamerpaint.com', 
      position: 'Accountant', 
      department: 'Finance',
      status: 'active',
      hireDate: '2022-11-10',
      salary: 55000
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      email: 'emily.davis@rehamerpaint.com', 
      position: 'Quality Control Specialist', 
      department: 'Manufacturing',
      status: 'on-leave',
      hireDate: '2023-06-01',
      salary: 42000
    },
  ];

  const departments = [
    { 
      id: 1, 
      name: 'Manufacturing', 
      head: 'John Smith', 
      employees: 8, 
      budget: 450000
    },
    { 
      id: 2, 
      name: 'Sales', 
      head: 'Sarah Johnson', 
      employees: 4, 
      budget: 200000
    },
    { 
      id: 3, 
      name: 'Finance', 
      head: 'Michael Chen', 
      employees: 3, 
      budget: 180000
    },
    { 
      id: 4, 
      name: 'Logistics', 
      head: 'David Wilson', 
      employees: 5, 
      budget: 250000
    },
  ];

  const attendance = [
    { 
      id: 1, 
      employee: 'John Smith', 
      date: '2026-03-28', 
      checkIn: '08:45', 
      checkOut: '17:30',
      status: 'present',
      hours: 8.75
    },
    { 
      id: 2, 
      employee: 'Sarah Johnson', 
      date: '2026-03-28', 
      checkIn: '09:00', 
      checkOut: '17:15',
      status: 'present',
      hours: 8.25
    },
    { 
      id: 3, 
      employee: 'Michael Chen', 
      date: '2026-03-28', 
      checkIn: '-', 
      checkOut: '-',
      status: 'absent',
      hours: 0
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'active': 'bg-accentClr text-white',
      'on-leave': 'bg-logoGold text-primaryClr',
      'terminated': 'bg-dangerClr text-white',
      'present': 'bg-accentClr text-white',
      'absent': 'bg-dangerClr text-white',
      'late': 'bg-logoGold text-primaryClr'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">HR Management</h1>
        <p className="text-place">Manage employees, departments, payroll, and attendance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Employees</p>
              <p className="text-2xl font-bold text-primaryClr">20</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Departments</p>
              <p className="text-2xl font-bold text-primaryClr">4</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Present Today</p>
              <p className="text-2xl font-bold text-primaryClr">18</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Monthly Payroll</p>
              <p className="text-2xl font-bold text-primaryClr">$85k</p>
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'departments'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attendance'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payroll'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Payroll
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              />
            </div>
            <div className="flex space-x-3">
              <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors">
                📊 Reports
              </button>
              <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors">
                ➕ Add Employee
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Position</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Hire Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-primaryClr">{employee.name}</p>
                            <p className="text-xs text-place">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{employee.position}</td>
                      <td className="py-3 px-4 text-sm text-place">{employee.department}</td>
                      <td className="py-3 px-4 text-sm text-place">{employee.hireDate}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${employee.salary.toLocaleString()}</td>
                      <td className="py-3 px-4">{getStatusBadge(employee.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📄</button>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Department Head</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Employees</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Budget</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primaryClrLight flex items-center justify-center mr-3">
                            <span className="text-primaryClrText text-sm font-medium">
                              {dept.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-primaryClr">{dept.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-primaryClr">{dept.head}</td>
                      <td className="py-3 px-4 text-sm text-place">{dept.employees}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">${dept.budget.toLocaleString()}</td>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Hours</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primaryClr">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                      <td className="py-3 px-4 text-sm text-primaryClr">{record.employee}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.date}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.checkIn}</td>
                      <td className="py-3 px-4 text-sm text-place">{record.checkOut}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primaryClr">{record.hours}</td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-primaryClr hover:text-primaryClrLight">✏️</button>
                          <button className="text-primaryClr hover:text-primaryClrLight">📝</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payroll */}
          {activeTab === 'payroll' && (
            <div className="text-center py-12">
              <span className="text-4xl">💰</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Payroll Management</h3>
              <p className="mt-2 text-place">Process salaries, bonuses, and deductions</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors">
                  Generate Payroll
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors">
                  View History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
