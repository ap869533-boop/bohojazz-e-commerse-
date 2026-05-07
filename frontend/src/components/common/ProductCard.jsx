import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api, { handleApiError, formatCurrency, getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onWishlistChange }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }
    await addToCart(product.product_id || product.id);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      const { data } = await api.post('/wishlist', { product_id: product.product_id || product.id });
      setWishlisted(data.in_wishlist);
      toast.success(data.in_wishlist ? 'Added to wishlist' : 'Removed from wishlist');
      onWishlistChange?.();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="product-card group relative bg-white rounded-xl overflow-hidden shadow-sm border border-primary-100 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={imgError ? '/placeholder.jpg' : getImageUrl(product.primary_image || product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white text-xs px-2 py-0.5">{discount}% OFF</span>
          )}
          {product.stock_quantity === 0 && (
            <span className="badge bg-gray-800 text-white text-xs px-2 py-0.5">Out of Stock</span>
          )}
        </div>

        {/* Overlay actions */}
        <div className="product-overlay absolute inset-0 bg-black/20 opacity-0 flex items-end justify-center pb-4 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock_quantity === 0}
            className="bg-white text-boho-dark px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-boho-terra hover:text-white transition-colors shadow-md disabled:opacity-50"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <Link to={`/product/${product.slug}`}
            className="bg-white text-boho-dark w-9 h-9 rounded-full flex items-center justify-center hover:bg-boho-terra hover:text-white transition-colors shadow-md">
            <Eye size={14} />
          </Link>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
      >
        <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-boho-terra font-medium mb-1 truncate">{product.shop_name || product.category_name}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-body font-medium text-sm text-gray-800 leading-snug mb-1.5 line-clamp-2 hover:text-boho-terra transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} fill="#f59e0b" className="text-amber-400" />
          <span className="text-xs text-gray-500">{Number(product.rating || 0).toFixed(1)}</span>
          {product.total_reviews > 0 && <span className="text-xs text-gray-400">({product.total_reviews})</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-boho-terra">
            {formatCurrency(product.sale_price || product.price)}
          </span>
          {product.sale_price && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
