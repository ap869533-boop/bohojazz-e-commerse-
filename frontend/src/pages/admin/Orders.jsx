import React, { useState, useEffect } from 'react';
import api, { formatCurrency, formatDate, handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700', shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/admin/orders?${params}`);
      setOrders(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const updateStatus = async (id, status, paymentStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status, payment_status: paymentStatus });
      toast.success('Order updated.');
      fetchOrders();
      setSelected(null);
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Orders Management</h1>
        <span className="text-sm text-gray-500">{pagination.total || 0} orders</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
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
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={8}><div className="h-10 bg-gray-50 animate-pulse m-2 rounded" /></td></tr>
                ))
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="table-td font-mono text-xs text-boho-terra">{order.order_number}</td>
                  <td className="table-td">
                    <div>
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="table-td text-center">{order.item_count}</td>
                  <td className="table-td font-semibold text-boho-terra">{formatCurrency(order.total_amount)}</td>
                  <td className="table-td">
                    <span className={`badge text-xs capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge text-xs capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  </td>
                  <td className="table-td text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                  <td className="table-td">
                    <button onClick={() => setSelected(order)}
                      className="text-xs text-boho-terra hover:underline font-medium">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Prev</button>
              <button disabled={page===pagination.pages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-display text-lg mb-1">Update Order</h3>
            <p className="text-sm text-gray-500 mb-4">{selected.order_number}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Order Status</label>
                <select defaultValue={selected.status}
                  onChange={e => setSelected(p => ({ ...p, newStatus: e.target.value }))}
                  className="input-field text-sm">
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Payment Status</label>
                <select defaultValue={selected.payment_status}
                  onChange={e => setSelected(p => ({ ...p, newPaymentStatus: e.target.value }))}
                  className="input-field text-sm">
                  {['pending','paid','failed','refunded'].map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setSelected(null)} className="btn-outline flex-1 text-sm">Cancel</button>
              <button onClick={() => updateStatus(selected.id, selected.newStatus || selected.status, selected.newPaymentStatus || selected.payment_status)}
                className="btn-primary flex-1 text-sm">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
