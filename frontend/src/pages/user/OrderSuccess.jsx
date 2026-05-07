// OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api, { formatCurrency, formatDate } from '../../utils/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.data)).catch(() => {});
  }, [id]);

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 font-body mb-2">Thank you for shopping with BohoJazz</p>
        {order && (
          <div className="card p-6 mt-6 text-left">
            <p className="text-sm text-gray-500 mb-1 font-body">Order Number</p>
            <p className="font-display text-xl text-boho-terra mb-4">{order.order_number}</p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><p className="text-gray-400">Total Amount</p><p className="font-semibold">{formatCurrency(order.total_amount)}</p></div>
              <div><p className="text-gray-400">Payment Method</p><p className="font-semibold capitalize">{order.payment_method?.replace('_', ' ')}</p></div>
              <div><p className="text-gray-400">Order Date</p><p className="font-semibold">{formatDate(order.created_at)}</p></div>
              <div><p className="text-gray-400">Status</p><p className="font-semibold capitalize text-amber-600">{order.status}</p></div>
            </div>
          </div>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/orders" className="btn-outline">View My Orders</Link>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
