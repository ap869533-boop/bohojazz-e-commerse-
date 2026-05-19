import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, RefreshCw, Shield } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import LoginModal from '../../components/auth/LoginModal';
import { useAuth } from '../../context/AuthContext';
import api, { getImageUrl } from '../../utils/api';

const LOGIN_MODAL_RUNTIME_KEY = '__bohojazzLoginModalShown';

const Home = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [fp, na, cats, bans] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?sort=newest&limit=8'),
          api.get('/categories'),
          api.get('/banners'),
        ]);
        setFeaturedProducts(fp.data.data || []);
        setNewArrivals(na.data.data || []);
        setCategories((cats.data.data || []).filter(c => !c.parent_id).slice(0, 6));
        setBanners(bans.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const t = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 5000);
      return () => clearInterval(t);
    }
  }, [banners]);

  useEffect(() => {
    if (authLoading || isAuthenticated() || window[LOGIN_MODAL_RUNTIME_KEY]) return undefined;

    const timer = window.setTimeout(() => {
      window[LOGIN_MODAL_RUNTIME_KEY] = true;
      setShowLoginModal(true);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [authLoading, isAuthenticated]);

  const handleCloseLoginModal = () => {
    window[LOGIN_MODAL_RUNTIME_KEY] = true;
    setShowLoginModal(false);
  };

  const categoryColors = [
    'from-rose-100 to-pink-200', 'from-amber-100 to-yellow-200',
    'from-emerald-100 to-green-200', 'from-sky-100 to-blue-200',
    'from-violet-100 to-purple-200', 'from-orange-100 to-red-200',
  ];

  return (
    <div className="min-h-screen bg-boho-cream">
      <LoginModal open={showLoginModal} onClose={handleCloseLoginModal} />
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[420px] md:h-[580px] overflow-hidden bg-gradient-to-br from-boho-terra via-amber-800 to-boho-dark">
        {banners.length > 0 ? (
          <div className="relative w-full h-full">
            {banners.map((banner, i) => (
              <div key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`}>
                <img src={getImageUrl(banner.image)} alt={banner.title}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-8 w-full">
                    <div className="max-w-lg">
                      {banner.subtitle && <p className="text-boho-gold text-sm font-body tracking-widest uppercase mb-3">{banner.subtitle}</p>}
                      {banner.title && <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{banner.title}</h1>}
                      {banner.button_text && (
                        <Link to={banner.link_url || '/shop'}
                          className="inline-flex items-center gap-2 bg-boho-terra text-white px-7 py-3 rounded-full font-body font-medium hover:bg-boho-rust transition-all hover:shadow-xl hover:gap-3">
                          {banner.button_text} <ArrowRight size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setCurrentBanner(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentBanner ? 'w-6 bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-lg">
                <p className="text-boho-gold text-sm font-body tracking-widest uppercase mb-3">New Collection</p>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-5 leading-tight">
                  Where Style<br />Meets Soul
                </h1>
                <p className="text-gray-200 font-body mb-7 text-lg">
                  Classic · Contemporary · Fusion — fashion that tells your story.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link to="/shop" className="inline-flex items-center gap-2 bg-boho-terra text-white px-7 py-3.5 rounded-full font-body font-medium hover:bg-boho-rust transition-all hover:shadow-xl">
                    Shop Now <ArrowRight size={18} />
                  </Link>
                  <Link to="/shop?featured=true" className="inline-flex items-center gap-2 border-2 border-white text-white px-7 py-3.5 rounded-full font-body font-medium hover:bg-white hover:text-boho-terra transition-all">
                    Featured
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹999' },
              { icon: RefreshCw, label: 'Easy Returns', sub: '7-day return policy' },
              { icon: Shield, label: 'Secure Payment', sub: '100% safe checkout' },
              { icon: Sparkles, label: 'Quality Assured', sub: 'Curated collections' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-boho-terra" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 font-body">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-500 font-body">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link key={cat.id} to={`/shop/${cat.slug}`}
                className={`group relative h-32 rounded-2xl bg-gradient-to-br ${categoryColors[i % categoryColors.length]} flex flex-col items-center justify-center overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1`}>
                {cat.image && (
                  <img src={getImageUrl(cat.image)} alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                )}
                <div className="relative z-10 text-center px-2">
                  <p className="font-display font-semibold text-sm text-gray-800 leading-tight">{cat.name}</p>
                  {cat.product_count > 0 && <p className="text-xs text-gray-500 mt-0.5">{cat.product_count} items</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl text-gray-900 mb-1">Featured Collection</h2>
              <p className="text-gray-500 font-body text-sm">Hand-picked styles just for you</p>
            </div>
            <Link to="/shop?featured=true" className="flex items-center gap-1 text-sm text-boho-terra font-medium hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-boho-dark to-stone-900 py-14 text-center px-4">
        <p className="text-boho-gold text-sm font-body tracking-widest uppercase mb-3">Limited Time Offer</p>
        <h2 className="font-display text-4xl text-white mb-3">End of Season Sale</h2>
        <p className="text-gray-300 font-body mb-6">Up to 50% off on selected styles</p>
        <Link to="/shop/sale" className="inline-flex items-center gap-2 bg-boho-gold text-white px-8 py-3.5 rounded-full font-body font-medium hover:brightness-95 transition-all">
          Shop Sale <ArrowRight size={18} />
        </Link>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl text-gray-900 mb-1">New Arrivals</h2>
              <p className="text-gray-500 font-body text-sm">Fresh styles, just in</p>
            </div>
            <Link to="/shop?sort=newest" className="flex items-center gap-1 text-sm text-boho-terra font-medium hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Vendor CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-primary-50 to-boho-sand rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl text-gray-900 mb-3">Are You a Fashion Designer?</h2>
          <p className="text-gray-600 font-body mb-6 max-w-lg mx-auto">
            Join BohoJazz as a vendor and reach thousands of fashion-forward customers across India.
          </p>
          <Link to="/register?role=vendor" className="btn-primary inline-flex items-center gap-2">
            Start Selling Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
