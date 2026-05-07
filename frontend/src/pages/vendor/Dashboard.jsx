import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, IndianRupee, Clock, TrendingUp, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api, { formatCurrency, formatDate } from '../../utils/api';

const StatCard = ({ title, value, icon: Icon, color, sub, link }) => (
  <div className="card p-5 flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500 font-body mb-1">{title}</p>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      {link && <Link to={link} className="text-xs text-boho-terra hover:underline mt-1 block">View all →</Link>}
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vendor/dashboard').then(r => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="card h-24 animate-pulse bg-gray-100" />)}
      </div>
    </div>
  );

  if (!data) return null;
  const { stats, recentOrders, monthlySales, topProducts } = data;

  const chartData = monthlySales.map(m => ({
    month: m.month?.slice(5),
    earnings: parseFloat(m.earnings) || 0,
    orders: parseInt(m.orders) || 0,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-gray-900">Vendor Dashboard</h1>
          <p className="text-sm text-gray-500 font-body">Manage your store and track performance</p>
        </div>
        <Link to="/vendor/products/add" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Earnings" value={formatCurrency(stats.total_earnings)} icon={IndianRupee} color="bg-boho-terra" sub={`Pending: ${formatCurrency(stats.pending_payout)}`} />
        <StatCard title="Total Orders" value={stats.total_orders} icon={ShoppingBag} color="bg-blue-500" sub={`Pending: ${stats.pending_orders}`} link="/vendor/orders" />
        <StatCard title="My Products" value={stats.total_products} icon={Package} color="bg-green-500" sub={`Pending review: ${stats.pending_products}`} link="/vendor/products" />
        <StatCard title="Pending Orders" value={stats.pending_orders} icon={Clock} color="bg-amber-500" link="/vendor/orders" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Monthly Earnings</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c4622d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c4622d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => formatCurrency(v)} />
                <Area type="monotone" dataKey="earnings" stroke="#c4622d" strokeWidth={2} fill="url(#colorEarn)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={36} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No sales data yet</p>
              </div>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center">
              <Package size={36} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400 mb-3">No products yet</p>
              <Link to="/vendor/products/add" className="btn-primary text-sm">Add Your First Product</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">Stock: {p.stock_quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{p.total_sold} sold</p>
                    <p className="text-xs text-amber-500">★ {Number(p.rating||0).toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Recent Orders</h3>
          <Link to="/vendor/orders" className="text-xs text-boho-terra hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-th pl-0">Order</th>
                  <th className="table-th">Product</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.slice(0,6).map((o, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-td pl-0 font-mono text-xs text-boho-terra">{o.order_number}</td>
                    <td className="table-td truncate max-w-[120px]">{o.product_name}</td>
                    <td className="table-td text-gray-500">{o.customer_name}</td>
                    <td className="table-td font-medium">{formatCurrency(o.total_price)}</td>
                    <td className="table-td">
                      <span className={`badge capitalize text-xs ${statusColors[o.vendor_status] || 'bg-gray-100 text-gray-600'}`}>{o.vendor_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
