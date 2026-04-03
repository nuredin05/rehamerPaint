import React, { useMemo } from 'react';
import {
  Package,
  DollarSign,
  Users,
  BarChart3,
  Plus,
  ShoppingCart,
  ArrowDownLeft,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import apiService from '../services/api';
import { useApiData } from '../hooks/useApiData';

export const Dashboard = () => {
  const { data: productsRaw, loading: productsLoading } = useApiData(
    () => apiService.getProducts({ limit: 200 }),
    []
  );
  const { data: customersRaw, loading: customersLoading } = useApiData(
    () => apiService.getCustomers({ limit: 200 }),
    []
  );
  const { data: ordersRaw, loading: ordersLoading } = useApiData(
    () => apiService.getOrders({ limit: 50 }),
    []
  );
  const { data: transactionsRaw, loading: txLoading } = useApiData(
    () => apiService.getInventoryTransactions({ limit: 20 }),
    []
  );

  const products = Array.isArray(productsRaw) ? productsRaw : [];
  const customers = Array.isArray(customersRaw) ? customersRaw : [];
  const orders = Array.isArray(ordersRaw) ? ordersRaw : [];
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : [];

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

    return { totalProducts, totalCustomers, totalOrders, totalSales };
  }, [products, customers, orders]);

  const formatShortDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d).slice(0, 10);
    return date.toISOString().slice(0, 10);
  };

  const recentActivity = useMemo(() => {
    const items = [];

    orders.slice(0, 3).forEach((o) => {
      items.push({
        type: 'order',
        text: `New sales order ${o.id} created`,
        meta: o.date ? `Date: ${formatShortDate(o.date)}` : '—',
      });
    });

    transactions.slice(0, 3).forEach((t) => {
      items.push({
        type: 'inventory',
        text: `Inventory updated for ${t.product}`,
        meta: t.date ? `Date: ${formatShortDate(t.date)}` : '—',
      });
    });

    // Prefer orders first, then inventory. UI only needs a few items.
    return items.slice(0, 3);
  }, [orders, transactions]);

  const isLoading = productsLoading || customersLoading || ordersLoading || txLoading;

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
              <Package size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <d>
                <dt className="text-sm font-medium text-place truncate">Total Products</dt>
                <dd className="text-lg font-medium text-primaryClr">
                  {isLoading ? '—' : stats.totalProducts}
                </dd>
              </d>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accentClr rounded-lg p-3">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Total Sales</dt>
                <dd className="text-lg font-medium text-primaryClr">
                  {isLoading ? '—' : `$${stats.totalSales.toFixed(2)}`}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-logoGold rounded-lg p-3">
              <Users size={24} className="text-primaryClr" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Customers</dt>
                <dd className="text-lg font-medium text-primaryClr">
                  {isLoading ? '—' : stats.totalCustomers}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-dangerClr rounded-lg p-3">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-place truncate">Orders</dt>
                <dd className="text-lg font-medium text-primaryClr">
                  {isLoading ? '—' : stats.totalOrders}
                </dd>
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
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                <Package size={18} />
                <span>Add New Product</span>
              </button>
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                <ShoppingCart size={18} />
                <span>Create Sales Order</span>
              </button>
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                <ArrowDownLeft size={18} />
                <span>Receive Inventory</span>
              </button>
              <button className="w-full text-left bg-secondaryClr hover:bg-primaryClrLight text-primaryClr px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3">
                <Users size={18} />
                <span>Add Customer</span>
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
              {recentActivity.map((a, idx) => (
                <div key={`${a.type}-${idx}`} className="flex items-center space-x-3">
                  <div
                    className={`flex-shrink-0 h-2 w-2 rounded-full ${
                      a.type === 'order' ? 'bg-accentClr' : 'bg-primaryClrLight'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-primaryClr">{a.text}</p>
                    <p className="text-xs text-place">{a.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
