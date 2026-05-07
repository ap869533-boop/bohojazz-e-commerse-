import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CreditCard, Wallet, Banknote } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import api, { formatCurrency, handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', address_line1: '', city: '', state: '', pincode: '', country: 'India', is_default: false });

  useEffect(() => {
    api.get('/addresses').then(r => {
      const addrs = r.data.data || [];
      setAddresses(addrs);
      const def = addrs.find(a => a.is_default) || addrs[0];
      if (def) setSelectedAddress(def.id);
    }).catch(() => {});
  }, []);

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, order_amount: cart.subtotal });
      setCoupon(data.data);
      toast.success(`Coupon applied! You save ${formatCurrency(data.data.discount_amount)}`);
    } catch (err) { handleApiError(err, 'Invalid coupon'); }
  };

  const addAddress = async () => {
    try {
      const { data } = await api.post('/addresses', newAddress);
      const refreshed = await api.get('/addresses');
      setAddresses(refreshed.data.data || []);
      setSelectedAddress(data.data.id);
      setShowAddAddress(false);
      toast.success('Address added.');
    } catch (err) { handleApiError(err); }
  };

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address.'); return; }
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        address_id: selectedAddress,
        payment_method: paymentMethod,
        coupon_code: coupon ? couponCode : null,
      });
      await fetchCart();
      navigate(`/order-success/${data.data.order_id}`);
    } catch (err) { handleApiError(err); }
    finally { setPlacing(false); }
  };

  const discount = coupon?.discount_amount || 0;
  const subtotal = cart.subtotal;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-6">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Addresses */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg flex items-center gap-2"><MapPin size={18} className="text-boho-terra" />Delivery Address</h3>
                <button onClick={() => setShowAddAddress(!showAddAddress)} className="flex items-center gap-1 text-sm text-boho-terra hover:underline">
                  <Plus size={15} /> Add New
                </button>
              </div>
              {showAddAddress && (
                <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-primary-50 rounded-xl">
                  {[
                    { key: 'name', placeholder: 'Full Name', col: 1 },
                    { key: 'phone', placeholder: 'Phone', col: 1 },
                    { key: 'address_line1', placeholder: 'Address', col: 2 },
                    { key: 'city', placeholder: 'City', col: 1 },
                    { key: 'state', placeholder: 'State', col: 1 },
                    { key: 'pincode', placeholder: 'Pincode', col: 1 },
                  ].map(f => (
                    <input key={f.key} placeholder={f.placeholder} value={newAddress[f.key]}
                      onChange={e => setNewAddress(p => ({ ...p, [f.key]: e.target.value }))}
                      className={`input-field text-sm ${f.col === 2 ? 'col-span-2' : ''}`} />
                  ))}
                  <button onClick={addAddress} className="btn-primary col-span-2">Save Address</button>
                </div>
              )}
              <div className="space-y-3">
                {addresses.map(addr => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-boho-terra bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-boho-terra" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">{addr.name} · {addr.phone}</p>
                      <p className="text-gray-500">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                      <p className="text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                      {addr.is_default && <span className="text-xs text-boho-terra font-medium">Default</span>}
                    </div>
                  </label>
                ))}
                {addresses.length === 0 && !showAddAddress && (
                  <p className="text-sm text-gray-500 text-center py-4">No addresses saved. <button onClick={() => setShowAddAddress(true)} className="text-boho-terra hover:underline">Add one now</button></p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="card p-5">
              <h3 className="font-display text-lg mb-4 flex items-center gap-2"><CreditCard size={18} className="text-boho-terra" />Payment Method</h3>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: Banknote },
                  { value: 'upi', label: 'UPI Payment', sub: 'Google Pay, PhonePe, Paytm', icon: Wallet },
                  { value: 'card', label: 'Credit/Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
                ].map(({ value, label, sub, icon: Icon }) => (
                  <label key={value} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === value ? 'border-boho-terra bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={value} checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)} className="accent-boho-terra" />
                    <Icon size={20} className="text-boho-terra flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-display text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-700">{formatCurrency(item.item_total)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Coupon code" value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="input-field text-xs flex-1" />
                <button onClick={applyCoupon} className="px-3 py-2 bg-boho-terra text-white text-xs rounded-lg hover:bg-boho-rust transition-colors">Apply</button>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (18%)</span><span>{formatCurrency(tax)}</span></div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-boho-terra">{formatCurrency(total)}</span></div>
              </div>

              <button onClick={placeOrder} disabled={placing}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {placing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {placing ? 'Placing Order...' : `Place Order · ${formatCurrency(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
