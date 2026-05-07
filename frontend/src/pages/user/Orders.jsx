import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api, { formatCurrency, formatDate } from '../../utils/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('');

  const fetchOrders = async (status = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders${status ? `?status=${status}` : ''}`);
      setOrders(data.data || []);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(activeStatus); }, [activeStatus]);

  const tabs = ['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-6">My Orders</h1>

        {/* Status tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(s => (
            <button key={s} onClick={() => setActiveStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeStatus === s ? 'bg-boho-terra text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-boho-terra hover:text-boho-terra'}`}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Orders'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-display text-xl text-gray-600 mb-2">No orders yet</h3>
            <Link to="/shop" className="btn-primary mt-2">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`}
                className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <Package size={18} className="text-boho-terra" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 font-body text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)} · {order.item_count} item(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-display font-semibold text-boho-terra">{formatCurrency(order.total_amount)}</p>
                    <span className={`badge text-xs ${statusColors[order.status] || 'bg-gray-100 text-gray-600'} capitalize`}>{order.status}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-boho-terra transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
