const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Controllers
const authCtrl = require('../controllers/authController');
const productCtrl = require('../controllers/productController');
const orderCtrl = require('../controllers/orderController');
const cartCtrl = require('../controllers/cartController');
const vendorCtrl = require('../controllers/vendorController');
const adminCtrl = require('../controllers/adminController');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// =================== AUTH ROUTES ===================
router.post('/auth/register', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/)
], authCtrl.register);

router.post('/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], authCtrl.login);

router.post('/auth/forgot-password/request-otp', [
  body('email').isEmail().normalizeEmail(),
], authCtrl.requestPasswordResetOtp);

router.post('/auth/forgot-password/reset', [
  body('email').isEmail().normalizeEmail(),
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[A-Za-z])(?=.*\d)/),
], authCtrl.resetPasswordWithOtp);

router.post('/auth/refresh', authCtrl.refreshToken);
router.post('/auth/logout', authCtrl.logout);
router.get('/auth/me', authenticate, authCtrl.getMe);
router.put('/auth/change-password', authenticate, authCtrl.changePassword);

// =================== PUBLIC PRODUCT ROUTES ===================
router.get('/products', productCtrl.getProducts);
router.get('/products/:slug', productCtrl.getProduct);

// Categories (public)
router.get('/categories', adminCtrl.getCategories);

// Banners (public)
router.get('/banners', adminCtrl.getBanners);

// Coupon validation
router.post('/coupons/validate', authenticate, cartCtrl.validateCoupon);

// =================== CART & WISHLIST ===================
router.get('/cart', authenticate, cartCtrl.getCart);
router.post('/cart', authenticate, cartCtrl.addToCart);
router.put('/cart/:id', authenticate, cartCtrl.updateCart);
router.delete('/cart/:id', authenticate, cartCtrl.removeFromCart);
router.delete('/cart', authenticate, cartCtrl.clearCart);

router.get('/wishlist', authenticate, cartCtrl.getWishlist);
router.post('/wishlist', authenticate, cartCtrl.toggleWishlist);

// =================== ADDRESS ROUTES ===================
const db = require('../config/db');

router.get('/addresses', authenticate, async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [req.user.id]);
  res.json({ success: true, data: rows });
});

router.post('/addresses', authenticate, async (req, res) => {
  const { name, phone, address_line1, address_line2, city, state, pincode, country, is_default, address_type } = req.body;
  if (is_default) await db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
  const [result] = await db.execute(
    'INSERT INTO addresses (user_id, name, phone, address_line1, address_line2, city, state, pincode, country, is_default, address_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, name, phone, address_line1, address_line2 || null, city, state, pincode, country || 'India', is_default || 0, address_type || 'home']
  );
  res.status(201).json({ success: true, message: 'Address added.', data: { id: result.insertId } });
});

router.put('/addresses/:id', authenticate, async (req, res) => {
  const { name, phone, address_line1, address_line2, city, state, pincode, country, is_default, address_type } = req.body;
  if (is_default) await db.execute('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
  await db.execute(
    'UPDATE addresses SET name = ?, phone = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, pincode = ?, country = ?, is_default = ?, address_type = ? WHERE id = ? AND user_id = ?',
    [name, phone, address_line1, address_line2, city, state, pincode, country, is_default || 0, address_type, req.params.id, req.user.id]
  );
  res.json({ success: true, message: 'Address updated.' });
});

router.delete('/addresses/:id', authenticate, async (req, res) => {
  await db.execute('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true, message: 'Address deleted.' });
});

// =================== ORDER ROUTES ===================
router.post('/orders', authenticate, authorize('user', 'vendor'), orderCtrl.placeOrder);
router.get('/orders', authenticate, orderCtrl.getUserOrders);
router.get('/orders/:id', authenticate, orderCtrl.getOrder);

// =================== REVIEW ROUTES ===================
router.post('/reviews', authenticate, async (req, res) => {
  const { product_id, rating, title, comment, order_id } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO reviews (product_id, user_id, order_id, rating, title, comment, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_id, req.user.id, order_id || null, rating, title || null, comment || null, order_id ? 1 : 0]
    );
    // Update product rating
    await db.execute(
      'UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ? AND is_approved = 1), total_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = ? AND is_approved = 1) WHERE id = ?',
      [product_id, product_id, product_id]
    );
    res.status(201).json({ success: true, message: 'Review submitted.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// =================== NOTIFICATION ROUTES ===================
router.get('/notifications', authenticate, async (req, res) => {
  const [notifs] = await db.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]);
  res.json({ success: true, data: notifs });
});
router.put('/notifications/:id/read', authenticate, async (req, res) => {
  await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});
router.put('/notifications/read-all', authenticate, async (req, res) => {
  await db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
  res.json({ success: true });
});

// =================== FILE UPLOAD ===================
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});
router.post('/upload/multiple', authenticate, upload.array('images', 10), (req, res) => {
  if (!req.files || !req.files.length) return res.status(400).json({ success: false, message: 'No files uploaded.' });
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ success: true, urls });
});

// Product images
router.post('/vendor/products/:id/images', authenticate, authorize('vendor'), upload.array('images', 10), async (req, res) => {
  const { id } = req.params;
  const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
  const [products] = await db.execute('SELECT id FROM products WHERE id = ? AND vendor_id = ?', [id, vp[0]?.id]);
  if (!products.length) return res.status(404).json({ success: false, message: 'Product not found.' });

  const { isPrimary } = req.body;
  for (let i = 0; i < req.files.length; i++) {
    await db.execute(
      'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
      [id, `/uploads/${req.files[i].filename}`, i === 0 && isPrimary ? 1 : 0, i]
    );
  }
  res.json({ success: true, message: 'Images uploaded.' });
});

// =================== VENDOR ROUTES ===================
router.get('/vendor/dashboard', authenticate, authorize('vendor'), vendorCtrl.getDashboard);
router.get('/vendor/profile', authenticate, authorize('vendor'), vendorCtrl.getProfile);
router.put('/vendor/profile', authenticate, authorize('vendor'), vendorCtrl.updateProfile);
router.get('/vendor/products', authenticate, authorize('vendor'), productCtrl.getVendorProducts);
router.post('/vendor/products', authenticate, authorize('vendor'), productCtrl.createProduct);
router.put('/vendor/products/:id', authenticate, authorize('vendor'), productCtrl.updateProduct);
router.delete('/vendor/products/:id', authenticate, authorize('vendor'), productCtrl.deleteProduct);
router.get('/vendor/orders', authenticate, authorize('vendor'), orderCtrl.getVendorOrders);
router.put('/vendor/orders/:id/status', authenticate, authorize('vendor'), orderCtrl.updateVendorOrderStatus);
router.post('/vendor/payout-request', authenticate, authorize('vendor'), vendorCtrl.requestPayout);
router.get('/vendor/analytics', authenticate, authorize('vendor'), vendorCtrl.getAnalytics);
router.get('/vendor/coupons', authenticate, authorize('vendor'), vendorCtrl.getCoupons);
router.post('/vendor/coupons', authenticate, authorize('vendor'), vendorCtrl.createCoupon);

// =================== ADMIN ROUTES ===================
router.get('/admin/dashboard', authenticate, authorize('admin'), adminCtrl.getDashboardStats);
router.get('/admin/users', authenticate, authorize('admin'), adminCtrl.getUsers);
router.put('/admin/users/:id/status', authenticate, authorize('admin'), adminCtrl.updateUserStatus);
router.get('/admin/vendors', authenticate, authorize('admin'), adminCtrl.getVendors);
router.put('/admin/vendors/:id/approve', authenticate, authorize('admin'), adminCtrl.approveVendor);
router.get('/admin/products', authenticate, authorize('admin'), productCtrl.adminGetProducts);
router.put('/admin/products/:id/status', authenticate, authorize('admin'), productCtrl.updateProductStatus);
router.get('/admin/orders', authenticate, authorize('admin'), orderCtrl.adminGetOrders);
router.put('/admin/orders/:id/status', authenticate, authorize('admin'), orderCtrl.adminUpdateOrderStatus);
router.get('/admin/categories', authenticate, authorize('admin'), adminCtrl.getCategories);
router.post('/admin/categories', authenticate, authorize('admin'), adminCtrl.createCategory);
router.put('/admin/categories/:id', authenticate, authorize('admin'), adminCtrl.updateCategory);
router.get('/admin/settings', authenticate, authorize('admin'), adminCtrl.getSettings);
router.put('/admin/settings', authenticate, authorize('admin'), adminCtrl.updateSettings);
router.get('/admin/banners', authenticate, authorize('admin'), adminCtrl.getBanners);
router.post('/admin/banners', authenticate, authorize('admin'), adminCtrl.createBanner);
router.delete('/admin/banners/:id', authenticate, authorize('admin'), adminCtrl.deleteBanner);
router.get('/admin/payouts', authenticate, authorize('admin'), adminCtrl.getPayouts);
router.put('/admin/payouts/:id', authenticate, authorize('admin'), adminCtrl.updatePayout);

// Admin coupons management
router.get('/admin/coupons', authenticate, authorize('admin'), async (req, res) => {
  const [coupons] = await db.execute(
    `SELECT c.*, vp.shop_name FROM coupons c LEFT JOIN vendor_profiles vp ON c.vendor_id = vp.id ORDER BY c.created_at DESC`
  );
  res.json({ success: true, data: coupons });
});
router.put('/admin/coupons/:id', authenticate, authorize('admin'), async (req, res) => {
  const { is_active } = req.body;
  await db.execute('UPDATE coupons SET is_active = ? WHERE id = ?', [is_active, req.params.id]);
  res.json({ success: true });
});
router.delete('/admin/coupons/:id', authenticate, authorize('admin'), async (req, res) => {
  await db.execute('DELETE FROM coupons WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Coupon deleted.' });
});

// Admin reviews moderation
router.get('/admin/reviews', authenticate, authorize('admin'), async (req, res) => {
  const [reviews] = await db.execute(
    `SELECT r.*, u.name as reviewer, p.name as product_name FROM reviews r
     JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id
     ORDER BY r.created_at DESC LIMIT 50`
  );
  res.json({ success: true, data: reviews });
});
router.put('/admin/reviews/:id', authenticate, authorize('admin'), async (req, res) => {
  const { is_approved } = req.body;
  await db.execute('UPDATE reviews SET is_approved = ? WHERE id = ?', [is_approved, req.params.id]);
  res.json({ success: true });
});

module.exports = router;
