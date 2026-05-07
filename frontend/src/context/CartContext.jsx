import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { handleApiError } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated()) return;
    try {
      const { data } = await api.get('/cart');
      setCart(data.data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) fetchCart();
    else setCart({ items: [], subtotal: 0, item_count: 0 });
  }, [isAuthenticated()]);

  const addToCart = async (product_id, variant_id = null, quantity = 1) => {
    try {
      setLoading(true);
      await api.post('/cart', { product_id, variant_id, quantity });
      await fetchCart();
      toast.success('Added to cart!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      handleApiError(err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      await fetchCart();
      toast.success('Item removed.');
    } catch (err) {
      handleApiError(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [], subtotal: 0, item_count: 0 });
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
