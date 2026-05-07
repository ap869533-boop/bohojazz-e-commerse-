import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import api from '../../utils/api';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setItems(data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, []);

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-6">My Wishlist ({items.length})</h1>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={56} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-display text-xl text-gray-600 mb-2">Your wishlist is empty</h3>
            <Link to="/shop" className="btn-primary mt-2">Explore Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map(item => (
              <ProductCard key={item.id} product={{ ...item, id: item.product_id }} onWishlistChange={fetchWishlist} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
