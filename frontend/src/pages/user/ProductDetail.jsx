import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Truck, RefreshCw, Shield, ChevronLeft, Minus, Plus } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api, { formatCurrency, getImageUrl, handleApiError } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then(r => {
        setProduct(r.data.data);
        const primaryIdx = r.data.data.images?.findIndex(i => i.is_primary) || 0;
        setSelectedImage(primaryIdx >= 0 ? primaryIdx : 0);
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    await addToCart(product.id, selectedVariant?.id || null, quantity);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    await addToCart(product.id, selectedVariant?.id || null, quantity);
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      const { data } = await api.post('/wishlist', { product_id: product.id });
      setWishlisted(data.in_wishlist);
      toast.success(data.in_wishlist ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) { handleApiError(err); }
  };

  const currentPrice = selectedVariant
    ? (product?.sale_price || product?.price) + (selectedVariant.price_modifier || 0)
    : (product?.sale_price || product?.price);

  if (loading) return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;
  const variantNames = [...new Set(product.variants?.map(v => v.name) || [])];

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-body">
          <Link to="/" className="hover:text-boho-terra">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-boho-terra">Shop</Link>
          {product.category_name && (
            <>
              <span>/</span>
              <Link to={`/shop/${product.category_slug}`} className="hover:text-boho-terra">{product.category_name}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-600 truncate max-w-40">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3">
              <img
                src={getImageUrl(product.images?.[selectedImage]?.image_url || product.images?.[0]?.image_url)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={img.id} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-boho-terra' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={getImageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-boho-terra text-sm font-medium mb-1 font-body">
              <Link to={`/shop?vendor=${product.shop_slug}`} className="hover:underline">{product.shop_name}</Link>
            </p>
            <h1 className="font-display text-3xl text-gray-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating || 0) ? '#f59e0b' : 'none'} className="text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-body">
                {Number(product.rating || 0).toFixed(1)} ({product.total_reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-4xl font-bold text-boho-terra">{formatCurrency(currentPrice)}</span>
              {product.sale_price && (
                <>
                  <span className="text-lg text-gray-400 line-through font-body">{formatCurrency(product.price)}</span>
                  <span className="badge bg-red-500 text-white">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-green-600 text-sm font-body mb-5">
              {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : <span className="text-red-500">Out of Stock</span>}
            </p>

            {/* Short description */}
            {product.short_description && (
              <p className="text-gray-600 font-body text-sm mb-5 leading-relaxed">{product.short_description}</p>
            )}

            {/* Variants */}
            {variantNames.map(varName => (
              <div key={varName} className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2 font-body">{varName}:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.filter(v => v.name === varName).map(v => (
                    <button key={v.id}
                      onClick={() => setSelectedVariant(selectedVariant?.id === v.id ? null : v)}
                      className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${selectedVariant?.id === v.id ? 'border-boho-terra bg-primary-50 text-boho-terra' : 'border-gray-200 text-gray-700 hover:border-gray-400'} ${v.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                      disabled={v.stock_quantity === 0}>
                      {v.value}
                      {v.price_modifier > 0 && <span className="text-xs ml-1">(+{formatCurrency(v.price_modifier)})</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 font-body">Quantity:</p>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"><Minus size={16} /></button>
                <span className="px-4 py-2 text-sm font-medium border-x border-gray-200 min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={cartLoading || product.stock_quantity === 0}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-boho-terra text-boho-terra py-3.5 rounded-xl font-body font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50">
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock_quantity === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-boho-terra text-white py-3.5 rounded-xl font-body font-semibold hover:bg-boho-rust transition-colors disabled:opacity-50">
                Buy Now
              </button>
              <button onClick={handleWishlist}
                className={`p-3.5 border-2 rounded-xl transition-all ${wishlisted ? 'border-red-400 text-red-400 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400'}`}>
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-primary-50 rounded-xl">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders above ₹999' },
                { icon: RefreshCw, label: '7-Day Returns', sub: 'Hassle free' },
                { icon: Shield, label: 'Secure Payment', sub: '100% safe' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon size={18} className="text-boho-terra mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 mb-6 gap-4">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Product Details' },
              { id: 'reviews', label: `Reviews (${product.total_reviews})` },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium font-body border-b-2 transition-colors -mb-px ${activeTab === tab.id ? 'border-boho-terra text-boho-terra' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 font-body text-sm leading-relaxed">
              <p>{product.description || 'No description available.'}</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Fabric', value: product.fabric },
                { label: 'Brand', value: product.brand },
                { label: 'SKU', value: product.sku },
                { label: 'Care Instructions', value: product.care_instructions },
              ].filter(d => d.value).map(d => (
                <div key={d.label} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <span className="font-semibold text-gray-700 w-32 flex-shrink-0">{d.label}:</span>
                  <span className="text-gray-600">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {product.reviews?.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-body">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {product.reviews?.map(review => (
                    <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-boho-terra text-white flex items-center justify-center text-sm font-bold">
                            {review.reviewer_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{review.reviewer_name}</p>
                            {review.is_verified && <span className="text-xs text-green-500">✓ Verified Purchase</span>}
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={14} fill={s <= review.rating ? '#f59e0b' : 'none'} className="text-amber-400" />
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="font-medium text-gray-800 mb-1 text-sm">{review.title}</p>}
                      <p className="text-sm text-gray-600 font-body">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
