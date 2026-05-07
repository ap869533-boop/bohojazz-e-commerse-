import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, User, BarChart2, Percent, Menu, X, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/vendor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/vendor/products', label: 'My Products', icon: Package },
  { path: '/vendor/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/vendor/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/vendor/coupons', label: 'Coupons', icon: Percent },
  { path: '/vendor/profile', label: 'Shop Profile', icon: User },
];

const VendorLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-4 border-b border-gray-100">
          <Link to="/" className="block">
            <div className="font-display text-xl font-bold text-boho-terra">Boho<span className="text-boho-dark">Jazz</span></div>
            <div className="text-xs text-gray-400 font-body">Vendor Panel</div>
          </Link>
        </div>

        {/* Vendor info */}
        <div className="px-4 py-3 bg-primary-50 border-b border-primary-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-boho-terra text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.vendorProfile?.shop_name || user?.name + "'s Shop"}</p>
              <span className={`text-xs ${user?.vendorProfile?.is_approved ? 'text-green-500' : 'text-amber-500'}`}>
                {user?.vendorProfile?.is_approved ? '✓ Approved' : '⏳ Pending Approval'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon, exact }) => (
            <Link key={path} to={path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link mb-0.5 ${isActive(path, exact) ? 'active' : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <Link to="/" className="sidebar-link mb-1 text-xs text-gray-500">View Store</Link>
          <button onClick={logout}
            className="w-full flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"><Bell size={18} /></button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
