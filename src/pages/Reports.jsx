import React, { useState } from 'react';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('month');

  const reportCategories = [
    {
      id: 1,
      name: 'Sales Reports',
      icon: '💰',
      description: 'Revenue, orders, and customer analytics',
      reports: ['Monthly Sales', 'Product Performance', 'Customer Analysis', 'Sales Forecast']
    },
    {
      id: 2,
      name: 'Inventory Reports',
      icon: '📦',
      description: 'Stock levels, movements, and valuations',
      reports: ['Stock Summary', 'Inventory Turnover', 'Low Stock Alert', 'Stock Valuation']
    },
    {
      id: 3,
      name: 'Financial Reports',
      icon: '📈',
      description: 'P&L, cash flow, and balance sheets',
      reports: ['Profit & Loss', 'Cash Flow Statement', 'Balance Sheet', 'Expense Analysis']
    },
    {
      id: 4,
      name: 'Production Reports',
      icon: '🏭',
      description: 'Manufacturing efficiency and quality metrics',
      reports: ['Production Efficiency', 'Quality Control Summary', 'BOM Cost Analysis', 'Capacity Utilization']
    },
    {
      id: 5,
      name: 'HR Reports',
      icon: '👥',
      description: 'Employee performance and payroll analytics',
      reports: ['Employee Performance', 'Payroll Summary', 'Attendance Report', 'Training Records']
    },
    {
      id: 6,
      name: 'Logistics Reports',
      icon: '🚚',
      description: 'Delivery performance and vehicle utilization',
      reports: ['Delivery Performance', 'Vehicle Utilization', 'Driver Performance', 'Route Optimization']
    }
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Sales Report', type: 'Sales', generated: '2026-03-28 09:30', status: 'completed' },
    { id: 2, name: 'Inventory Summary', type: 'Inventory', generated: '2026-03-28 08:15', status: 'completed' },
    { id: 3, name: 'Profit & Loss Q1', type: 'Financial', generated: '2026-03-27 16:45', status: 'completed' },
    { id: 4, name: 'Production Efficiency', type: 'Manufacturing', generated: '2026-03-27 14:20', status: 'processing' },
    { id: 5, name: 'Customer Analysis', type: 'Sales', generated: '2026-03-26 11:00', status: 'completed' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-accentClr text-white',
      'processing': 'bg-primaryClr text-primaryClrText',
      'failed': 'bg-dangerClr text-white',
      'scheduled': 'bg-logoGold text-primaryClr'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const kpiData = [
    { label: 'Total Revenue', value: '$45,678', change: '+12.5%', trend: 'up' },
    { label: 'Total Orders', value: '156', change: '+8.2%', trend: 'up' },
    { label: 'Inventory Value', value: '$125,450', change: '-2.1%', trend: 'down' },
    { label: 'Production Efficiency', value: '87.3%', change: '+5.4%', trend: 'up' },
    { label: 'On-Time Delivery', value: '94.2%', change: '+1.8%', trend: 'up' },
    { label: 'Customer Satisfaction', value: '4.6/5', change: '+0.2', trend: 'up' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Reports & Analytics</h1>
        <p className="text-place">Generate comprehensive business reports and insights</p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-4">
            <p className="text-xs text-place mb-1">{kpi.label}</p>
            <p className="text-lg font-bold text-primaryClr mb-1">{kpi.value}</p>
            <div className="flex items-center">
              <span className={`text-xs font-medium ${
                kpi.trend === 'up' ? 'text-accentClr' : 'text-dangerClr'
              }`}>
                {kpi.change}
              </span>
              <span className="text-xs ml-1">
                {kpi.trend === 'up' ? '📈' : '📉'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Date Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === range
                  ? 'bg-primaryClr text-primaryClrText'
                  : 'bg-secondaryClr text-primaryClr hover:bg-primaryClrLight'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
        <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors">
          📊 Generate Custom Report
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Report Library
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduled'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Scheduled Reports
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'custom'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              Custom Builder
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sales Chart */}
                <div className="bg-white rounded-lg border border-secondaryClr p-6">
                  <h3 className="text-lg font-medium text-primaryClr mb-4">Sales Trend</h3>
                  <div className="h-64 flex items-center justify-center bg-secondaryClr rounded">
                    <span className="text-4xl">📈</span>
                  </div>
                </div>
                
                {/* Inventory Chart */}
                <div className="bg-white rounded-lg border border-secondaryClr p-6">
                  <h3 className="text-lg font-medium text-primaryClr mb-4">Inventory Levels</h3>
                  <div className="h-64 flex items-center justify-center bg-secondaryClr rounded">
                    <span className="text-4xl">📦</span>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div>
                <h3 className="text-lg font-medium text-primaryClr mb-4">Recent Reports</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondaryClr">
                        <th className="text-left py-3 px-1 text-sm font-medium text-primaryClr">Report Name</th>
                        <th className="text-left py-3 px-1 text-sm font-medium text-primaryClr">Type</th>
                        <th className="text-left py-3 px-1 text-sm font-medium text-primaryClr">Generated</th>
                        <th className="text-left py-3 px-1 text-sm font-medium text-primaryClr">Status</th>
                        <th className="text-left py-3 px-1 text-sm font-medium text-primaryClr">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report) => (
                        <tr key={report.id} className="border-b border-secondaryClr hover:bg-secondaryClr">
                          <td className="py-3 px-1">
                            <span className="font-medium text-primaryClr">{report.name}</span>
                          </td>
                          <td className="py-3 px-1 text-sm text-place">{report.type}</td>
                          <td className="py-3 px-1 text-sm text-place">{report.generated}</td>
                          <td className="py-3 px-1">{getStatusBadge(report.status)}</td>
                          <td className="py-3 px-1">
                            <div className="flex space-x-2">
                              <button className="text-primaryClr hover:text-primaryClrLight">👁️</button>
                              <button className="text-primaryClr hover:text-primaryClrLight">📥</button>
                              <button className="text-primaryClr hover:text-primaryClrLight">📧</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Report Library Tab */}
          {activeTab === 'reports' && (
            <div>
              <h3 className="text-lg font-medium text-primaryClr mb-6">Report Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCategories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg border border-secondaryClr p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{category.icon}</span>
                      <h4 className="text-lg font-medium text-primaryClr">{category.name}</h4>
                    </div>
                    <p className="text-sm text-place mb-4">{category.description}</p>
                    <div className="space-y-2">
                      {category.reports.slice(0, 3).map((report, index) => (
                        <button key={index} className="w-full text-left text-sm text-primaryClr hover:text-primaryClrLight bg-secondaryClr hover:bg-primaryClrLight px-3 py-2 rounded transition-colors">
                          📄 {report}
                        </button>
                      ))}
                      {category.reports.length > 3 && (
                        <button className="w-full text-left text-sm text-place hover:text-primaryClr">
                          +{category.reports.length - 3} more...
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Reports Tab */}
          {activeTab === 'scheduled' && (
            <div className="text-center py-12">
              <span className="text-4xl">⏰</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Scheduled Reports</h3>
              <p className="mt-2 text-place">Automated report generation and distribution</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors">
                  ➕ New Schedule
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors">
                  📋 View All Schedules
                </button>
              </div>
            </div>
          )}

          {/* Custom Builder Tab */}
          {activeTab === 'custom' && (
            <div className="text-center py-12">
              <span className="text-4xl">🛠️</span>
              <h3 className="mt-4 text-lg font-medium text-primaryClr">Custom Report Builder</h3>
              <p className="mt-2 text-place">Create custom reports with drag-and-drop interface</p>
              <div className="flex justify-center space-x-3 mt-4">
                <button className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-6 py-2 rounded-lg transition-colors">
                  🎨 Start Building
                </button>
                <button className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-6 py-2 rounded-lg transition-colors">
                  📚 View Templates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
