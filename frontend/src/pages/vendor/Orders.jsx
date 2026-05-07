import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import api, { formatCurrency, formatDate, handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/vendor/orders?${params}`);
      setOrders(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const updateStatus = async (orderId, status) => {
    const trackingNumber = status === 'shipped' ? prompt('Enter tracking number (optional):') : null;
    try {
      setUpdating(orderId);
      await api.put(`/vendor/orders/${orderId}/status`, { status, tracking_number: trackingNumber });
      toast.success('Order status updated.');
      fetchOrders();
    } catch (err) { handleApiError(err); }
    finally { setUpdating(null); }
  };

  const statusFlow = { pending: ['confirmed', 'cancelled'], confirmed: ['shipped', 'cancelled'], shipped: ['delivered'] };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">My Orders</h1>
        <span className="text-sm text-gray-500">{pagination.total || 0} orders</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Order #', 'Customer', 'Earnings', 'Payment', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <tr key={i}><td colSpan={7}><div className="h-12 bg-gray-50 animate-pulse m-2 rounded" /></td></tr>)
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400 text-sm">No orders found</td></tr>
              ) : orders.map(order => {
                const statuses = order.item_statuses?.split(',') || [];
                const mainStatus = statuses[0] || 'pending';
                const nextSteps = statusFlow[mainStatus] || [];

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="table-td font-mono text-xs text-boho-terra">{order.order_number}</td>
                    <td className="table-td">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="table-td font-semibold text-boho-terra">{formatCurrency(order.vendor_earnings)}</td>
                    <td className="table-td">
                      <span className={`badge text-xs ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`badge capitalize text-xs ${statusColors[mainStatus] || 'bg-gray-100 text-gray-600'}`}>{mainStatus}</span>
                    </td>
                    <td className="table-td text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                    <td className="table-td">
                      {nextSteps.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {nextSteps.map(next => (
                            <button key={next} onClick={() => updateStatus(order.id, next)}
                              disabled={updating === order.id}
                              className="text-xs bg-boho-terra text-white px-2.5 py-1 rounded-lg hover:bg-boho-rust transition-colors capitalize disabled:opacity-50">
                              {updating === order.id ? '...' : next}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Prev</button>
              <button disabled={page===pagination.pages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
