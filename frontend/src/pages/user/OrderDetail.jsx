import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api, { formatCurrency, formatDate, getImageUrl } from '../../utils/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-boho-cream flex items-center justify-center"><div className="w-8 h-8 border-4 border-boho-terra border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="min-h-screen bg-boho-cream flex items-center justify-center"><p>Order not found</p></div>;

  const addr = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/orders" className="flex items-center gap-2 text-sm text-boho-terra hover:underline mb-5"><ArrowLeft size={16} /> Back to Orders</Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl">{order.order_number}</h1>
            <p className="text-sm text-gray-500 font-body">{formatDate(order.created_at)}</p>
          </div>
          <span className={`badge text-sm px-3 py-1 capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            {/* Items */}
            <div className="card p-5">
              <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Package size={18} className="text-boho-terra" />Items Ordered</h3>
              <div className="space-y-4">
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={getImageUrl(item.product_image)} alt={item.product_name} className="w-16 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                      {item.variant_name && <p className="text-xs text-gray-400">{item.variant_name}</p>}
                      <p className="text-xs text-boho-terra">{item.shop_name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                      {item.tracking_number && <p className="text-xs text-green-600 mt-1">Tracking: {item.tracking_number}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-boho-terra">{formatCurrency(item.total_price)}</p>
                      <span className={`badge text-xs capitalize mt-1 ${statusColors[item.vendor_status] || 'bg-gray-100 text-gray-600'}`}>{item.vendor_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {addr && (
              <div className="card p-5">
                <h3 className="font-display text-lg mb-3 flex items-center gap-2"><MapPin size={18} className="text-boho-terra" />Delivery Address</h3>
                <p className="text-sm text-gray-700 font-medium">{addr.name} · {addr.phone}</p>
                <p className="text-sm text-gray-500">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="card p-5">
              <h3 className="font-display text-lg mb-4 flex items-center gap-2"><CreditCard size={18} className="text-boho-terra" />Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                {order.discount_amount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discount_amount)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping_amount > 0 ? formatCurrency(order.shipping_amount) : 'FREE'}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatCurrency(order.tax_amount)}</span></div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-boho-terra">{formatCurrency(order.total_amount)}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Payment Method</p>
                <p className="text-sm font-medium capitalize">{order.payment_method?.replace('_', ' ')}</p>
                <p className="text-xs text-gray-500 mt-2">Payment Status</p>
                <span className={`badge text-xs capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.payment_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
