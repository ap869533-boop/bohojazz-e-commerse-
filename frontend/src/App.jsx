import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy loaded pages
const Home = lazy(() => import('./pages/user/Home'));
const Shop = lazy(() => import('./pages/user/Shop'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const OrderSuccess = lazy(() => import('./pages/user/OrderSuccess'));
const Account = lazy(() => import('./pages/user/Account'));
const Orders = lazy(() => import('./pages/user/Orders'));
const OrderDetail = lazy(() => import('./pages/user/OrderDetail'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminVendors = lazy(() => import('./pages/admin/Vendors'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminBanners = lazy(() => import('./pages/admin/Banners'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminPayouts = lazy(() => import('./pages/admin/Payouts'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));

// Vendor pages
const VendorLayout = lazy(() => import('./pages/vendor/VendorLayout'));
const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard'));
const VendorProducts = lazy(() => import('./pages/vendor/Products'));
const VendorAddProduct = lazy(() => import('./pages/vendor/AddProduct'));
const VendorOrders = lazy(() => import('./pages/vendor/Orders'));
const VendorProfile = lazy(() => import('./pages/vendor/Profile'));
const VendorAnalytics = lazy(() => import('./pages/vendor/Analytics'));
const VendorCoupons = lazy(() => import('./pages/vendor/Coupons'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-boho-cream">
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-boho-terra border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { fontFamily: 'Lato, sans-serif', fontSize: '14px' },
                success: { iconTheme: { primary: '#c4622d', secondary: '#fff' } },
              }}
            />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public / User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected User Routes */}
                <Route path="/cart" element={<ProtectedRoute roles={['user', 'vendor']}><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute roles={['user', 'vendor']}><Checkout /></ProtectedRoute>} />
                <Route path="/order-success/:id" element={<ProtectedRoute roles={['user', 'vendor']}><OrderSuccess /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute roles={['user']}><Account /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute roles={['user']}><Orders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute roles={['user']}><OrderDetail /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute roles={['user']}><Wishlist /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="vendors" element={<AdminVendors />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="payouts" element={<AdminPayouts />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Vendor Routes */}
                <Route path="/vendor" element={<ProtectedRoute roles={['vendor']}><VendorLayout /></ProtectedRoute>}>
                  <Route index element={<VendorDashboard />} />
                  <Route path="products" element={<VendorProducts />} />
                  <Route path="products/add" element={<VendorAddProduct />} />
                  <Route path="products/edit/:id" element={<VendorAddProduct />} />
                  <Route path="orders" element={<VendorOrders />} />
                  <Route path="profile" element={<VendorProfile />} />
                  <Route path="analytics" element={<VendorAnalytics />} />
                  <Route path="coupons" element={<VendorCoupons />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
