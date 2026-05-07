const db = require('../config/db');

// @GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role = "user"');
    const [[vendors]] = await db.execute('SELECT COUNT(*) as total FROM vendor_profiles');
    const [[pendingVendors]] = await db.execute('SELECT COUNT(*) as total FROM vendor_profiles WHERE is_approved = 0');
    const [[products]] = await db.execute('SELECT COUNT(*) as total FROM products WHERE status = "published"');
    const [[pendingProducts]] = await db.execute('SELECT COUNT(*) as total FROM products WHERE status = "pending"');
    const [[orders]] = await db.execute('SELECT COUNT(*) as total FROM orders');
    const [[revenue]] = await db.execute('SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE payment_status = "paid"');
    const [[todayOrders]] = await db.execute('SELECT COUNT(*) as total FROM orders WHERE DATE(created_at) = CURDATE()');
    const [[todayRevenue]] = await db.execute('SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE DATE(created_at) = CURDATE() AND payment_status = "paid"');

    const [recentOrders] = await db.execute(
      `SELECT o.order_number, o.total_amount, o.status, o.payment_status, o.created_at, u.name as customer_name
       FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10`
    );

    const [monthlySales] = await db.execute(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_amount) as total, COUNT(*) as orders
       FROM orders WHERE payment_status = "paid" AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month ASC`
    );

    const [topProducts] = await db.execute(
      `SELECT p.name, p.total_sold, p.rating, vp.shop_name,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
       FROM products p JOIN vendor_profiles vp ON p.vendor_id = vp.id
       ORDER BY p.total_sold DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        stats: {
          total_users: users.total, total_vendors: vendors.total,
          pending_vendors: pendingVendors.total, total_products: products.total,
          pending_products: pendingProducts.total, total_orders: orders.total,
          total_revenue: revenue.total, today_orders: todayOrders.total,
          today_revenue: todayRevenue.total
        },
        recentOrders, monthlySales, topProducts
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = [];
    let params = [];
    if (role) { where.push('role = ?'); params.push(role); }
    if (status) { where.push('status = ?'); params.push(status); }
    if (search) { where.push('(name LIKE ? OR email LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [countRows] = await db.execute(`SELECT COUNT(*) as total FROM users ${whereStr}`, params);
    const [users] = await db.execute(
      `SELECT id, uuid, name, email, phone, role, status, email_verified, created_at FROM users ${whereStr} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: users,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (parseInt(id) === req.user.id) return res.status(400).json({ success: false, message: 'Cannot change own status.' });
    await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'User status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/vendors
const getVendors = async (req, res) => {
  try {
    const { page = 1, limit = 20, is_approved, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = [];
    let params = [];
    if (is_approved !== undefined) { where.push('vp.is_approved = ?'); params.push(is_approved === 'true' ? 1 : 0); }
    if (search) { where.push('(vp.shop_name LIKE ? OR u.name LIKE ? OR u.email LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM vendor_profiles vp JOIN users u ON vp.user_id = u.id ${whereStr}`, params);

    const [vendors] = await db.execute(
      `SELECT vp.id, vp.shop_name, vp.shop_slug, vp.is_approved, vp.commission_rate, 
              vp.total_sales, vp.rating, vp.created_at,
              u.name as owner_name, u.email as owner_email, u.status as user_status,
              COUNT(DISTINCT p.id) as product_count
       FROM vendor_profiles vp 
       JOIN users u ON vp.user_id = u.id
       LEFT JOIN products p ON vp.id = p.vendor_id
       ${whereStr} GROUP BY vp.id ORDER BY vp.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: vendors,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/vendors/:id/approve
const approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved, commission_rate } = req.body;
    await db.execute(
      'UPDATE vendor_profiles SET is_approved = ?, approved_at = ?, commission_rate = COALESCE(?, commission_rate) WHERE id = ?',
      [is_approved, is_approved ? new Date() : null, commission_rate || null, id]
    );
    res.json({ success: true, message: `Vendor ${is_approved ? 'approved' : 'rejected'}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/categories
const getCategories = async (req, res) => {
  try {
    const [cats] = await db.execute(
      `SELECT c.*, p.name as parent_name, COUNT(pr.id) as product_count
       FROM categories c LEFT JOIN categories p ON c.parent_id = p.id
       LEFT JOIN products pr ON c.id = pr.category_id AND pr.status = "published"
       GROUP BY c.id ORDER BY c.sort_order ASC`
    );
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/admin/categories
const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, sort_order, is_active } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [result] = await db.execute(
      'INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, description || null, parent_id || null, sort_order || 0, is_active !== false]
    );
    res.status(201).json({ success: true, message: 'Category created.', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id, sort_order, is_active } = req.body;
    await db.execute(
      'UPDATE categories SET name = ?, description = ?, parent_id = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, description, parent_id || null, sort_order || 0, is_active !== false, id]
    );
    res.json({ success: true, message: 'Category updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    const [settings] = await db.execute('SELECT * FROM settings ORDER BY id');
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.setting_key] = s.setting_value);
    res.json({ success: true, data: settingsMap, rows: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await db.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    res.json({ success: true, message: 'Settings updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/banners
const getBanners = async (req, res) => {
  try {
    const [banners] = await db.execute('SELECT * FROM banners ORDER BY sort_order ASC');
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/admin/banners
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link_url, button_text, position, sort_order, is_active, starts_at, ends_at } = req.body;
    const [result] = await db.execute(
      'INSERT INTO banners (title, subtitle, image, link_url, button_text, position, sort_order, is_active, starts_at, ends_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, image, link_url, button_text, position || 'hero', sort_order || 0, is_active !== false, starts_at || new Date(), ends_at || null]
    );
    res.status(201).json({ success: true, message: 'Banner created.', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @DELETE /api/admin/banners/:id
const deleteBanner = async (req, res) => {
  try {
    await db.execute('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/payouts
const getPayouts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = status ? 'WHERE vp.status = ?' : '';
    let params = status ? [status] : [];
    const [payouts] = await db.execute(
      `SELECT vp.*, vendor.shop_name, u.name as owner_name, u.email as owner_email
       FROM vendor_payouts vp JOIN vendor_profiles vendor ON vp.vendor_id = vendor.id
       JOIN users u ON vendor.user_id = u.id ${where} ORDER BY vp.requested_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );
    res.json({ success: true, data: payouts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/payouts/:id
const updatePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transaction_id, notes } = req.body;
    await db.execute(
      'UPDATE vendor_payouts SET status = ?, transaction_id = ?, notes = ?, processed_at = CASE WHEN ? = "paid" THEN NOW() ELSE processed_at END WHERE id = ?',
      [status, transaction_id || null, notes || null, status, id]
    );
    res.json({ success: true, message: 'Payout updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getDashboardStats, getUsers, updateUserStatus, getVendors, approveVendor,
  getCategories, createCategory, updateCategory, getSettings, updateSettings,
  getBanners, createBanner, deleteBanner, getPayouts, updatePayout
};
