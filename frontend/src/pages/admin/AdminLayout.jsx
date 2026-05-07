import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, Package, ShoppingBag,
  Tag, Image, Settings, Menu, X, LogOut, Bell, ChevronRight,
  Wallet, Percent
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/vendors', label: 'Vendors', icon: Store },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/banners', label: 'Banners', icon: Image },
  { path: '/admin/coupons', label: 'Coupons', icon: Percent },
  { path: '/admin/payouts', label: 'Payouts', icon: Wallet },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Link to="/" className="block">
            <div className="font-display text-xl font-bold text-boho-terra">Boho<span className="text-boho-dark">Jazz</span></div>
            <div className="text-xs text-gray-400 font-body">Admin Panel</div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          {navItems.map(({ path, label, icon: Icon, exact }) => (
            <Link key={path} to={path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link mb-0.5 ${isActive(path, exact) ? 'active' : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-boho-terra text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center text-sm text-gray-400 gap-1 font-body">
              <Link to="/admin" className="hover:text-boho-terra">Admin</Link>
              {location.pathname !== '/admin' && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-gray-600 capitalize">{location.pathname.split('/').pop()}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="hidden sm:block text-xs text-boho-terra border border-boho-terra px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors font-body">
              View Store
            </Link>
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
