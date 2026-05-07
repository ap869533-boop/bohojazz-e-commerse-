// Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getImageUrl } from '../../utils/api';

const Cart = () => {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 font-body mb-6">Discover our beautiful collection</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-6">Shopping Cart ({cart.item_count} items)</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4">
                <img src={getImageUrl(item.image)} alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.slug}`} className="font-body font-medium text-gray-800 hover:text-boho-terra line-clamp-2 text-sm">{item.name}</Link>
                  {item.variant_name && <p className="text-xs text-gray-400 mt-0.5">{item.variant_name}: {item.variant_value}</p>}
                  <p className="text-xs text-boho-terra mt-0.5">{item.shop_name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                      <span className="px-3 py-1.5 text-sm border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-semibold text-boho-terra">{formatCurrency(item.item_total)}</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-display text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(cart.subtotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={cart.subtotal >= 999 ? 'text-green-500' : ''}>{cart.subtotal >= 999 ? 'FREE' : formatCurrency(99)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (18%)</span><span>{formatCurrency(cart.subtotal * 0.18)}</span></div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span className="text-boho-terra">{formatCurrency(cart.subtotal + (cart.subtotal >= 999 ? 0 : 99) + cart.subtotal * 0.18)}</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary w-full text-center">Proceed to Checkout</button>
              <Link to="/shop" className="block text-center text-sm text-boho-terra hover:underline mt-3">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
