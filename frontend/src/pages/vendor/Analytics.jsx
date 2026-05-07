import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api, { formatCurrency } from '../../utils/api';

const COLORS = ['#c4622d', '#e29e4d', '#2d5a3d', '#c9a84c', '#9b3d1a'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    setLoading(true);
    api.get(`/vendor/analytics?period=${period}`)
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Analytics</h1>
        <div className="flex gap-2">
          {[
            { value: '7', label: '7 Days' },
            { value: '30', label: '30 Days' },
            { value: '90', label: '90 Days' },
          ].map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p.value ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
        </div>
      ) : !data ? (
        <div className="card p-10 text-center"><p className="text-gray-400">No analytics data available</p></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Sales by Day */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-display text-lg mb-4">Daily Earnings</h3>
            {data.salesByDay?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.salesByDay.map(d => ({ date: d.date?.slice(5), earnings: parseFloat(d.earnings) || 0, orders: parseInt(d.orders) || 0 }))}>
                  <defs>
                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c4622d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c4622d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => formatCurrency(v)} />
                  <Area type="monotone" dataKey="earnings" stroke="#c4622d" strokeWidth={2} fill="url(#colorDaily)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No sales data for this period</div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Sales by Category</h3>
            {data.categoryBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.categoryBreakdown} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={e => e.category}>
                    {data.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No category data</div>
            )}
          </div>

          {/* Top by Category Table */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Category Revenue</h3>
            {data.categoryBreakdown?.length > 0 ? (
              <div className="space-y-3">
                {data.categoryBreakdown.map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-gray-700 flex-1">{cat.category}</span>
                    <span className="text-sm font-semibold text-boho-terra">{formatCurrency(cat.revenue)}</span>
                    <span className="text-xs text-gray-400">{cat.items_sold} sold</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
