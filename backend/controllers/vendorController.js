const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @GET /api/vendor/dashboard
const getDashboard = async (req, res) => {
  try {
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    const vendorId = vp[0].id;

    const [[totalProducts]] = await db.execute('SELECT COUNT(*) as total FROM products WHERE vendor_id = ? AND status = "published"', [vendorId]);
    const [[pendingProducts]] = await db.execute('SELECT COUNT(*) as total FROM products WHERE vendor_id = ? AND status = "pending"', [vendorId]);
    const [[totalOrders]] = await db.execute('SELECT COUNT(DISTINCT order_id) as total FROM order_items WHERE vendor_id = ?', [vendorId]);
    const [[pendingOrders]] = await db.execute('SELECT COUNT(DISTINCT order_id) as total FROM order_items WHERE vendor_id = ? AND vendor_status = "pending"', [vendorId]);
    const [[totalEarnings]] = await db.execute('SELECT COALESCE(SUM(vendor_earnings),0) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.vendor_id = ? AND o.payment_status = "paid"', [vendorId]);
    const [[pendingPayout]] = await db.execute('SELECT COALESCE(SUM(amount),0) as total FROM vendor_payouts WHERE vendor_id = ? AND status = "pending"', [vendorId]);

    const [recentOrders] = await db.execute(
      `SELECT o.order_number, o.created_at, oi.product_name, oi.quantity, oi.total_price, oi.vendor_status,
              u.name as customer_name
       FROM order_items oi JOIN orders o ON oi.order_id = o.id JOIN users u ON o.user_id = u.id
       WHERE oi.vendor_id = ? ORDER BY o.created_at DESC LIMIT 10`,
      [vendorId]
    );

    const [monthlySales] = await db.execute(
      `SELECT DATE_FORMAT(o.created_at, '%Y-%m') as month, 
              SUM(oi.vendor_earnings) as earnings, COUNT(DISTINCT o.id) as orders
       FROM order_items oi JOIN orders o ON oi.order_id = o.id
       WHERE oi.vendor_id = ? AND o.payment_status = "paid" AND o.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month ASC`,
      [vendorId]
    );

    const [topProducts] = await db.execute(
      `SELECT p.name, p.total_sold, p.rating, p.stock_quantity,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
       FROM products p WHERE p.vendor_id = ? ORDER BY p.total_sold DESC LIMIT 5`,
      [vendorId]
    );

    res.json({
      success: true,
      data: {
        stats: {
          total_products: totalProducts.total, pending_products: pendingProducts.total,
          total_orders: totalOrders.total, pending_orders: pendingOrders.total,
          total_earnings: totalEarnings.total, pending_payout: pendingPayout.total
        },
        recentOrders, monthlySales, topProducts
      }
    });
  } catch (err) {
    console.error('Vendor dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/vendor/profile
const getProfile = async (req, res) => {
  try {
    const [vp] = await db.execute('SELECT * FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(404).json({ success: false, message: 'Profile not found.' });
    const [user] = await db.execute('SELECT id, name, email, phone, avatar FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, data: { ...vp[0], user: user[0] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/vendor/profile
const updateProfile = async (req, res) => {
  try {
    const {
      shop_name, shop_description, business_email, business_phone,
      address, city, state, pincode, gst_number, pan_number,
      bank_account, bank_name, ifsc_code, name, phone
    } = req.body;

    await db.execute(
      `UPDATE vendor_profiles SET shop_name = ?, shop_description = ?, business_email = ?,
       business_phone = ?, address = ?, city = ?, state = ?, pincode = ?, gst_number = ?,
       pan_number = ?, bank_account = ?, bank_name = ?, ifsc_code = ? WHERE user_id = ?`,
      [shop_name, shop_description, business_email, business_phone, address, city, state,
       pincode, gst_number, pan_number, bank_account, bank_name, ifsc_code, req.user.id]
    );

    if (name || phone) {
      await db.execute('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?', [name || null, phone || null, req.user.id]);
    }

    res.json({ success: true, message: 'Profile updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/vendor/payout-request
const requestPayout = async (req, res) => {
  try {
    const [vp] = await db.execute('SELECT id, bank_account, bank_name, ifsc_code FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(404).json({ success: false, message: 'Vendor not found.' });
    if (!vp[0].bank_account) return res.status(400).json({ success: false, message: 'Please add bank details first.' });

    const { amount } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ success: false, message: 'Minimum payout amount is ₹100.' });

    // Check pending payout
    const [[pending]] = await db.execute('SELECT COUNT(*) as cnt FROM vendor_payouts WHERE vendor_id = ? AND status = "pending"', [vp[0].id]);
    if (pending.cnt > 0) return res.status(400).json({ success: false, message: 'You already have a pending payout request.' });

    await db.execute(
      'INSERT INTO vendor_payouts (vendor_id, amount, payment_method, notes) VALUES (?, ?, ?, ?)',
      [vp[0].id, amount, 'bank_transfer', `${vp[0].bank_name} - ${vp[0].bank_account}`]
    );

    res.json({ success: true, message: 'Payout request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/vendor/analytics
const getAnalytics = async (req, res) => {
  try {
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(404).json({ success: false, message: 'Vendor not found.' });
    const vendorId = vp[0].id;
    const { period = '30' } = req.query;

    const [salesByDay] = await db.execute(
      `SELECT DATE(o.created_at) as date, SUM(oi.vendor_earnings) as earnings, COUNT(DISTINCT o.id) as orders
       FROM order_items oi JOIN orders o ON oi.order_id = o.id
       WHERE oi.vendor_id = ? AND o.payment_status = "paid" AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY date ORDER BY date ASC`,
      [vendorId, parseInt(period)]
    );

    const [categoryBreakdown] = await db.execute(
      `SELECT c.name as category, SUM(oi.total_price) as revenue, COUNT(*) as items_sold
       FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN categories c ON p.category_id = c.id
       WHERE oi.vendor_id = ? AND oi.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY c.id ORDER BY revenue DESC`,
      [vendorId, parseInt(period)]
    );

    res.json({ success: true, data: { salesByDay, categoryBreakdown } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/vendor/coupons
const createCoupon = async (req, res) => {
  try {
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(404).json({ success: false, message: 'Vendor not found.' });

    const { code, type, value, min_order_amount, max_discount, usage_limit, expires_at } = req.body;
    await db.execute(
      'INSERT INTO coupons (code, type, value, min_order_amount, max_discount, usage_limit, vendor_id, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [code.toUpperCase(), type, value, min_order_amount || 0, max_discount || null, usage_limit || null, vp[0].id, expires_at || null]
    );
    res.status(201).json({ success: true, message: 'Coupon created.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Coupon code already exists.' });
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/vendor/coupons
const getCoupons = async (req, res) => {
  try {
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    const [coupons] = await db.execute('SELECT * FROM coupons WHERE vendor_id = ? ORDER BY created_at DESC', [vp[0].id]);
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getDashboard, getProfile, updateProfile, requestPayout, getAnalytics, createCoupon, getCoupons };
