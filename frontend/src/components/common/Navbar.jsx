import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'New Arrivals', path: '/shop?sort=newest' },
    { label: 'Kurtas & Suits', path: '/shop/kurtas-suits' },
    { label: 'Dresses', path: '/shop/dresses' },
    { label: 'Co-ords & Sets', path: '/shop/co-ords-sets' },
    { label: 'Accessories', path: '/shop/accessories' },
    { label: 'Sale', path: '/shop/sale', className: 'text-red-600 font-semibold' },
  ];

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'vendor') return '/vendor';
    return '/account';
  };

  return (
    <>
      {/* Top banner */}
      <div className="bg-boho-dark text-boho-cream text-xs text-center py-2 px-4 font-body tracking-wide">
        Free shipping on orders above ₹999 | Use code <span className="font-bold text-boho-gold">WELCOME10</span> for 10% off
      </div>

      <header className="bg-white border-b border-primary-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="min-w-0 flex-shrink">
              <div className="font-display text-xl font-bold text-boho-terra tracking-wide sm:text-2xl">
                Boho<span className="text-boho-dark">Jazz</span>
              </div>
              <div className="text-[8px] font-body tracking-[0.16em] text-gray-400 uppercase -mt-1 truncate sm:text-[9px] sm:tracking-[0.2em]">
                Classic · Contemporary · Fusion
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-body font-medium text-gray-700 hover:text-boho-terra transition-colors ${link.className || ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex flex-shrink-0 items-center gap-0.5 sm:gap-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-primary-50 hover:text-boho-terra">
                <Search size={18} className="sm:h-5 sm:w-5" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-primary-50 hover:text-boho-terra">
                <ShoppingBag size={18} className="sm:h-5 sm:w-5" />
                {cart.item_count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-boho-terra text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.item_count > 9 ? '9+' : cart.item_count}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              {isAuthenticated() && (
                <Link to="/wishlist" className="p-2 rounded-full hover:bg-primary-50 transition-colors text-gray-600 hover:text-boho-terra hidden sm:block">
                  <Heart size={20} />
                </Link>
              )}

              {/* User */}
              {isAuthenticated() ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-1.5 p-2 rounded-full hover:bg-primary-50 transition-colors text-gray-600 hover:text-boho-terra"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-boho-terra text-white flex items-center justify-center text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <ChevronDown size={14} className={`transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {userDropdown && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-xs bg-primary-100 text-boho-terra px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-boho-terra transition-colors">
                        <User size={15} /> Dashboard
                      </Link>
                      {user?.role === 'user' && (
                        <>
                          <Link to="/orders" onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-boho-terra transition-colors">
                            <ShoppingBag size={15} /> My Orders
                          </Link>
                          <Link to="/wishlist" onClick={() => setUserDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-boho-terra transition-colors">
                            <Heart size={15} /> Wishlist
                          </Link>
                        </>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <X size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="text-sm font-body font-medium text-gray-700 hover:text-boho-terra px-3 py-1.5 transition-colors">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Register</Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-primary-50 lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 animate-slide-down">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for dresses, kurtas, sets..."
                className="input-field flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary px-5">Search</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                  className={`py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-primary-50 hover:text-boho-terra transition-colors ${link.className || 'text-gray-700'}`}>
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {!isAuthenticated() ? (
                <div className="flex flex-col gap-2 mt-1">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center">Register</Link>
                </div>
              ) : (
                <button onClick={logout} className="py-2.5 px-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left">
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
