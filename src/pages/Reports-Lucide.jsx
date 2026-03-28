import React, { useState } from 'react';
import {
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Clock,
  BarChart,
  LineChart,
  Activity,
  MoreHorizontal,
  FileSpreadsheet,
  FileBarChart,
  FilePieChart
} from 'lucide-react';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('month');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const salesReports = [
    { id: 1, name: 'Monthly Sales Summary', type: 'sales', date: '2026-03-01', status: 'generated', size: '245 KB' },
    { id: 2, name: 'Quarterly Revenue Report', type: 'revenue', date: '2026-03-01', status: 'generated', size: '512 KB' },
    { id: 3, name: 'Customer Analysis', type: 'customers', date: '2026-03-01', status: 'pending', size: '-' },
    { id: 4, name: 'Product Performance', type: 'products', date: '2026-03-01', status: 'generated', size: '189 KB' },
  ];

  const inventoryReports = [
    { id: 1, name: 'Stock Level Report', type: 'inventory', date: '2026-03-01', status: 'generated', size: '156 KB' },
    { id: 2, name: 'Inventory Movement', type: 'transactions', date: '2026-03-01', status: 'generated', size: '234 KB' },
    { id: 3, name: 'Low Stock Alert', type: 'alerts', date: '2026-03-01', status: 'pending', size: '-' },
  ];

  const financialReports = [
    { id: 1, name: 'Profit & Loss Statement', type: 'financial', date: '2026-03-01', status: 'generated', size: '445 KB' },
    { id: 2, name: 'Cash Flow Analysis', type: 'financial', date: '2026-03-01', status: 'generated', size: '312 KB' },
    { id: 3, name: 'Balance Sheet', type: 'financial', date: '2026-03-01', status: 'pending', size: '-' },
  ];

  const operationalReports = [
    { id: 1, name: 'Production Efficiency', type: 'manufacturing', date: '2026-03-01', status: 'generated', size: '278 KB' },
    { id: 2, name: 'Delivery Performance', type: 'logistics', date: '2026-03-01', status: 'generated', size: '198 KB' },
    { id: 3, name: 'Employee Performance', type: 'hr', date: '2026-03-01', status: 'pending', size: '-' },
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const generateReport = (reportName) => {
    showNotification(`Generating ${reportName}...`, 'success');
  };

  const downloadReport = (reportName) => {
    showNotification(`Downloading ${reportName}...`, 'success');
  };

  const getStatusBadge = (status) => {
    const styles = {
      'generated': 'bg-accentClr text-white',
      'pending': 'bg-logoGold text-primaryClr',
      'error': 'bg-dangerClr text-white'
    };
    const icons = {
      'generated': CheckCircle,
      'pending': Clock,
      'error': AlertCircle
    };
    const IconComponent = icons[status] || Clock;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${styles[status]}`}>
        <IconComponent size={12} />
        <span>{status.toUpperCase()}</span>
      </span>
    );
  };

  const getReportIcon = (type) => {
    const icons = {
      'sales': ShoppingCart,
      'revenue': DollarSign,
      'customers': Users,
      'products': Package,
      'inventory': Package,
      'transactions': Activity,
      'alerts': AlertCircle,
      'financial': DollarSign,
      'manufacturing': BarChart3,
      'logistics': TrendingUp,
      'hr': Users
    };
    const IconComponent = icons[type] || FileText;
    return <IconComponent size={20} className="text-primaryClr" />;
  };

  // Stats
  const totalReports = salesReports.length + inventoryReports.length + financialReports.length + operationalReports.length;
  const generatedReports = [...salesReports, ...inventoryReports, ...financialReports, ...operationalReports].filter(r => r.status === 'generated').length;
  const pendingReports = [...salesReports, ...inventoryReports, ...financialReports, ...operationalReports].filter(r => r.status === 'pending').length;

  const getFilteredReports = () => {
    switch(activeTab) {
      case 'sales': return salesReports;
      case 'inventory': return inventoryReports;
      case 'financial': return financialReports;
      case 'operational': return operationalReports;
      default: return salesReports;
    }
  };

  const filteredReports = getFilteredReports().filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Reports & Analytics</h1>
        <p className="text-place">Generate and view comprehensive business reports</p>
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
              <FileText size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Total Reports</p>
              <p className="text-2xl font-bold text-primaryClr">{totalReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Generated</p>
              <p className="text-2xl font-bold text-primaryClr">{generatedReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <Clock size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Pending</p>
              <p className="text-2xl font-bold text-primaryClr">{pendingReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <Download size={24} className="text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm text-place">Downloads</p>
              <p className="text-2xl font-bold text-primaryClr">{generatedReports}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
        <div className="border-b border-secondaryClr">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'sales'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <ShoppingCart size={16} />
              <span>Sales</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'inventory'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Package size={16} />
              <span>Inventory</span>
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'financial'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <DollarSign size={16} />
              <span>Financial</span>
            </button>
            <button
              onClick={() => setActiveTab('operational')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'operational'
                  ? 'border-primaryClr text-primaryClr'
                  : 'border-transparent text-place hover:text-primaryClr'
              }`}
            >
              <Activity size={16} />
              <span>Operational</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-place" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr bg-bgLight"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button
                onClick={() => generateReport(activeTab + ' summary')}
                className="bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <BarChart3 size={16} />
                <span>Generate All</span>
              </button>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondaryClr hover:bg-secondaryClr transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
                    {getReportIcon(report.type)}
                  </div>
                  <div>
                    <p className="font-medium text-primaryClr">{report.name}</p>
                    <p className="text-sm text-place">Generated: {report.date} | Size: {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div>{getStatusBadge(report.status)}</div>
                  <div className="flex space-x-2">
                    {report.status === 'generated' ? (
                      <>
                        <button
                          onClick={() => downloadReport(report.name)}
                          className="text-primaryClr hover:text-primaryClrLight p-2 rounded-lg hover:bg-secondaryClr"
                          title="Download Report"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => showNotification(`Printing ${report.name}...`, 'success')}
                          className="text-primaryClr hover:text-primaryClrLight p-2 rounded-lg hover:bg-secondaryClr"
                          title="Print Report"
                        >
                          <Printer size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => generateReport(report.name)}
                        className="bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <BarChart3 size={16} />
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Charts Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondaryClr rounded-lg p-6 text-center">
              <BarChart3 size={48} className="mx-auto text-primaryClr mb-4" />
              <h3 className="text-lg font-medium text-primaryClr">Bar Charts</h3>
              <p className="text-sm text-place mt-2">Compare data across categories</p>
              <button className="mt-4 bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors text-sm">
                Create Bar Chart
              </button>
            </div>
            <div className="bg-secondaryClr rounded-lg p-6 text-center">
              <PieChart size={48} className="mx-auto text-primaryClr mb-4" />
              <h3 className="text-lg font-medium text-primaryClr">Pie Charts</h3>
              <p className="text-sm text-place mt-2">Show proportional data</p>
              <button className="mt-4 bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors text-sm">
                Create Pie Chart
              </button>
            </div>
            <div className="bg-secondaryClr rounded-lg p-6 text-center">
              <TrendingUp size={48} className="mx-auto text-primaryClr mb-4" />
              <h3 className="text-lg font-medium text-primaryClr">Trend Analysis</h3>
              <p className="text-sm text-place mt-2">Track changes over time</p>
              <button className="mt-4 bg-primaryClr hover:bg-primaryClrDark text-primaryClrText px-4 py-2 rounded-lg transition-colors text-sm">
                Create Trend Chart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
