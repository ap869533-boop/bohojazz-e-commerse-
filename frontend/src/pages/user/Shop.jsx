import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import api from '../../utils/api';

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
    page: parseInt(searchParams.get('page') || '1'),
  });

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data?.filter(c => !c.parent_id) || [])).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('limit', '20');
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ sort: 'newest', min_price: '', max_price: '', search: '', featured: '', page: 1 });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  const currentCategory = categories.find(c => c.slug === category);

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-primary-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-2xl text-gray-900">
            {filters.search ? `Search: "${filters.search}"` : currentCategory?.name || 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-body">
            {loading ? 'Loading...' : `${pagination.total || 0} products found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-boho-terra hover:underline">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Categories</h4>
                <div className="space-y-1.5">
                  <button onClick={() => window.location.href = '/shop'}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!category ? 'bg-primary-100 text-boho-terra font-medium' : 'text-gray-600 hover:bg-primary-50'}`}>
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => window.location.href = `/shop/${cat.slug}`}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${category === cat.slug ? 'bg-primary-100 text-boho-terra font-medium' : 'text-gray-600 hover:bg-primary-50'}`}>
                      {cat.name} {cat.product_count > 0 && <span className="text-xs text-gray-400">({cat.product_count})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.min_price}
                    onChange={e => updateFilter('min_price', e.target.value)}
                    className="input-field text-xs py-2" />
                  <input type="number" placeholder="Max" value={filters.max_price}
                    onChange={e => updateFilter('max_price', e.target.value)}
                    className="input-field text-xs py-2" />
                </div>
                {[500, 1000, 2000, 5000].map(price => (
                  <button key={price} onClick={() => updateFilter('max_price', price)}
                    className="text-xs text-boho-terra hover:underline mr-3 mt-2">Under ₹{price}</button>
                ))}
              </div>

              {/* Featured */}
              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.featured === 'true'}
                    onChange={e => updateFilter('featured', e.target.checked ? 'true' : '')}
                    className="w-4 h-4 accent-boho-terra" />
                  <span className="text-sm text-gray-700">Featured Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <button onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-boho-terra hover:text-boho-terra transition-colors">
                <SlidersHorizontal size={16} /> Filters
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-gray-500 hidden sm:block">Sort by:</label>
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-boho-terra">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="font-display text-xl text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button disabled={filters.page === 1} onClick={() => updateFilter('page', filters.page - 1)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:border-boho-terra hover:text-boho-terra transition-colors">
                      Previous
                    </button>
                    {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => updateFilter('page', p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === filters.page ? 'bg-boho-terra text-white' : 'border border-gray-200 hover:border-boho-terra hover:text-boho-terra'}`}>
                        {p}
                      </button>
                    ))}
                    <button disabled={filters.page === pagination.pages} onClick={() => updateFilter('page', filters.page + 1)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:border-boho-terra hover:text-boho-terra transition-colors">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
