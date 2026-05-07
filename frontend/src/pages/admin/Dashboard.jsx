import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Store, Package, ShoppingBag, TrendingUp, Clock, IndianRupee, Eye
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api, { formatCurrency, formatDate } from '../../utils/api';

const StatCard = ({ title, value, icon: Icon, color, sub, link }) => (
  <div className="card p-5 flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500 font-body mb-1">{title}</p>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      {link && <Link to={link} className="text-xs text-boho-terra hover:underline mt-1 inline-block">View all →</Link>}
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
  </div>
);

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="card h-28 animate-pulse bg-gray-100" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {[1,2].map(i => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
      </div>
    </div>
  );

  if (!data) return null;
  const { stats, recentOrders, monthlySales, topProducts } = data;

  const chartData = monthlySales.map(m => ({
    month: m.month?.slice(5) || m.month,
    revenue: parseFloat(m.total) || 0,
    orders: parseInt(m.orders) || 0,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 font-body">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.total_revenue)} icon={IndianRupee} color="bg-boho-terra" sub={`Today: ${formatCurrency(stats.today_revenue)}`} />
        <StatCard title="Total Orders" value={stats.total_orders} icon={ShoppingBag} color="bg-blue-500" sub={`Today: ${stats.today_orders}`} link="/admin/orders" />
        <StatCard title="Total Users" value={stats.total_users} icon={Users} color="bg-purple-500" link="/admin/users" />
        <StatCard title="Active Vendors" value={stats.total_vendors} icon={Store} color="bg-green-500" sub={`Pending: ${stats.pending_vendors}`} link="/admin/vendors" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Published Products" value={stats.total_products} icon={Package} color="bg-orange-500" sub={`Pending: ${stats.pending_products}`} link="/admin/products" />
        <StatCard title="Today Revenue" value={formatCurrency(stats.today_revenue)} icon={TrendingUp} color="bg-cyan-500" />
        <StatCard title="Pending Vendors" value={stats.pending_vendors} icon={Clock} color="bg-red-500" sub="Need approval" link="/admin/vendors" />
        <StatCard title="Pending Products" value={stats.pending_products} icon={Eye} color="bg-amber-500" sub="Need review" link="/admin/products" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Revenue (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c4622d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c4622d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#c4622d" strokeWidth={2} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Orders (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#c4622d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-boho-terra hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-th pl-0">Order</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.slice(0, 6).map(order => (
                  <tr key={order.order_number} className="hover:bg-gray-50">
                    <td className="table-td pl-0 font-mono text-xs text-boho-terra">{order.order_number}</td>
                    <td className="table-td truncate max-w-[100px]">{order.customer_name}</td>
                    <td className="table-td font-medium">{formatCurrency(order.total_amount)}</td>
                    <td className="table-td">
                      <span className={`badge capitalize text-xs ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-boho-terra hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((prod, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {prod.image && <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{prod.name}</p>
                  <p className="text-xs text-gray-400">{prod.shop_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-700">{prod.total_sold} sold</p>
                  <p className="text-xs text-amber-500">★ {Number(prod.rating || 0).toFixed(1)}</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
