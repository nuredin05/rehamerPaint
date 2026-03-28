import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primaryClr">Dashboard</h1>
        <p className="text-place">Welcome to RehamerPaint ERP System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primaryClrLight rounded-lg p-3">
              <div className="text-2xl">📦</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Total Products</dt>
                <dd className="text-lg font-medium text-primaryClr">1,234</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <div className="text-2xl">💰</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Total Sales</dt>
                <dd className="text-lg font-medium text-primaryClr">$45,678</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <div className="text-2xl">👥</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Customers</dt>
                <dd className="text-lg font-medium text-primaryClr">892</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <div className="text-2xl">📊</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Orders</dt>
                <dd className="text-lg font-medium text-primaryClr">156</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
          <div className="p-6 border-b border-secondaryClr">
            <h2 className="text-lg font-medium text-primaryClr">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200">
                📦 Add New Product
              </button>
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200">
                🛒 Create Sales Order
              </button>
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200">
                📦 Receive Inventory
              </button>
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200">
                👥 Add Customer
              </button>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr">
          <div className="p-6 border-b border-secondaryClr">
            <h2 className="text-lg font-medium text-primaryClr">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-2 w-2 bg-accentClr rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-primaryClr">New sales order #1234 created</p>
                  <p className="text-xs text-place">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-2 w-2 bg-primaryClr rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-primaryClr">Inventory updated for Product #567</p>
                  <p className="text-xs text-place">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-2 w-2 bg-logoGold rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-primaryClr">Purchase order #890 received</p>
                  <p className="text-xs text-place">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
