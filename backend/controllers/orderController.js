const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const generateOrderNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BJ-${ts}-${rand}`;
};

// @POST /api/orders - Place order
const placeOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { address_id, payment_method, coupon_code, notes } = req.body;
    const userId = req.user.id;

    // Get cart items
    const [cartItems] = await conn.execute(
      `SELECT c.*, p.name, p.price, p.sale_price, p.stock_quantity, p.manage_stock,
              p.vendor_id, p.status,
              pv.name as variant_name, pv.price_modifier,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
              vp.commission_rate
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       LEFT JOIN product_variants pv ON c.variant_id = pv.id
       JOIN vendor_profiles vp ON p.vendor_id = vp.id
       WHERE c.user_id = ? AND p.status = "published"`,
      [userId]
    );

    if (!cartItems.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });

    // Validate stock
    for (const item of cartItems) {
      if (item.manage_stock && item.stock_quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for: ${item.name}` });
      }
    }

    // Get address
    const [addresses] = await conn.execute('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [address_id, userId]);
    if (!addresses.length) return res.status(400).json({ success: false, message: 'Invalid address.' });
    const address = addresses[0];

    // Get settings
    const [settings] = await conn.execute('SELECT setting_key, setting_value FROM settings WHERE setting_key IN ("free_shipping_above","shipping_charge")');
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.setting_key] = parseFloat(s.setting_value));

    // Calculate subtotal
    let subtotal = 0;
    for (const item of cartItems) {
      const basePrice = item.sale_price || item.price;
      const variantModifier = item.price_modifier || 0;
      subtotal += (parseFloat(basePrice) + parseFloat(variantModifier)) * item.quantity;
    }

    // Apply coupon
    let discountAmount = 0;
    let couponId = null;
    if (coupon_code) {
      const [coupons] = await conn.execute(
        `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) 
         AND (usage_limit IS NULL OR used_count < usage_limit) AND min_order_amount <= ?`,
        [coupon_code, subtotal]
      );
      if (coupons.length) {
        const coupon = coupons[0];
        couponId = coupon.id;
        if (coupon.type === 'percentage') {
          discountAmount = (subtotal * coupon.value) / 100;
          if (coupon.max_discount) discountAmount = Math.min(discountAmount, coupon.max_discount);
        } else {
          discountAmount = coupon.value;
        }
        await conn.execute('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
      }
    }

    // Shipping
    const shippingAmount = subtotal >= settingsMap.free_shipping_above ? 0 : settingsMap.shipping_charge || 99;
    const taxRate = 0.18; // 18% GST
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * taxRate;
    const totalAmount = taxableAmount + shippingAmount + taxAmount;

    const orderNumber = generateOrderNumber();
    const shippingAddress = JSON.stringify({
      name: address.name, phone: address.phone,
      address_line1: address.address_line1, address_line2: address.address_line2,
      city: address.city, state: address.state, pincode: address.pincode, country: address.country
    });

    const [orderResult] = await conn.execute(
      `INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount, 
       shipping_amount, tax_amount, total_amount, coupon_id, payment_method, shipping_address, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, userId, address_id, subtotal, discountAmount, shippingAmount,
       taxAmount, totalAmount, couponId, payment_method, shippingAddress, notes || null]
    );

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of cartItems) {
      const basePrice = item.sale_price || item.price;
      const unitPrice = parseFloat(basePrice) + (parseFloat(item.price_modifier) || 0);
      const totalPrice = unitPrice * item.quantity;
      const commissionRate = item.commission_rate || 10;
      const commissionAmount = (totalPrice * commissionRate) / 100;
      const vendorEarnings = totalPrice - commissionAmount;

      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, vendor_id, variant_id, product_name, 
         product_image, variant_name, quantity, unit_price, total_price, vendor_earnings, commission_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.vendor_id, item.variant_id || null, item.name,
         item.image, item.variant_name || null, item.quantity, unitPrice, totalPrice, vendorEarnings, commissionAmount]
      );

      // Update stock
      if (item.manage_stock) {
        await conn.execute('UPDATE products SET stock_quantity = stock_quantity - ?, total_sold = total_sold + ? WHERE id = ?',
          [item.quantity, item.quantity, item.product_id]);
      }
    }

    // Clear cart
    await conn.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    // Create notification
    await conn.execute(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, "order")',
      [userId, 'Order Placed!', `Your order #${orderNumber} has been placed successfully.`]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: {
        order_id: orderId, order_number: orderNumber,
        total_amount: totalAmount, payment_method
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error('placeOrder error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    conn.release();
  }
};

// @GET /api/orders - User's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['o.user_id = ?'];
    let params = [req.user.id];
    if (status) { where.push('o.status = ?'); params.push(status); }

    const [countRows] = await db.execute(`SELECT COUNT(*) as total FROM orders o WHERE ${where.join(' AND ')}`, params);
    const [orders] = await db.execute(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, o.payment_method, o.created_at,
              COUNT(oi.id) as item_count
       FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE ${where.join(' AND ')} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: orders,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/orders/:id - Single order detail
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await db.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o JOIN users u ON o.user_id = u.id 
       WHERE o.id = ? AND (o.user_id = ? OR ? = "admin")`,
      [id, req.user.id, req.user.role]
    );
    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found.' });

    const [items] = await db.execute(
      `SELECT oi.*, vp.shop_name, vp.shop_slug
       FROM order_items oi JOIN vendor_profiles vp ON oi.vendor_id = vp.id WHERE oi.order_id = ?`, [id]);

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/vendor/orders - Vendor's orders
const getVendorOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor not found.' });

    let where = ['oi.vendor_id = ?'];
    let params = [vp[0].id];
    if (status) { where.push('oi.vendor_status = ?'); params.push(status); }

    const [countRows] = await db.execute(
      `SELECT COUNT(DISTINCT o.id) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE ${where.join(' AND ')}`, params);

    const [orders] = await db.execute(
      `SELECT DISTINCT o.id, o.order_number, o.created_at, o.payment_status,
              u.name as customer_name, u.email as customer_email,
              SUM(oi.total_price) as vendor_total, SUM(oi.vendor_earnings) as vendor_earnings,
              GROUP_CONCAT(DISTINCT oi.vendor_status) as item_statuses
       FROM order_items oi 
       JOIN orders o ON oi.order_id = o.id 
       JOIN users u ON o.user_id = u.id
       WHERE ${where.join(' AND ')} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: orders,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/vendor/orders/:id/status - Update item status
const updateVendorOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor not found.' });

    await db.execute(
      'UPDATE order_items SET vendor_status = ?, tracking_number = ?, shipped_at = CASE WHEN ? = "shipped" THEN NOW() ELSE shipped_at END WHERE order_id = ? AND vendor_id = ?',
      [status, tracking_number || null, status, id, vp[0].id]
    );

    res.json({ success: true, message: 'Order status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/orders - All orders
const adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, payment_status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = [];
    let params = [];
    if (status) { where.push('o.status = ?'); params.push(status); }
    if (payment_status) { where.push('o.payment_status = ?'); params.push(payment_status); }
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [countRows] = await db.execute(`SELECT COUNT(*) as total FROM orders o ${whereStr}`, params);
    const [orders] = await db.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email,
              COUNT(oi.id) as item_count
       FROM orders o JOIN users u ON o.user_id = u.id LEFT JOIN order_items oi ON o.id = oi.order_id
       ${whereStr} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: orders,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/orders/:id/status
const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;
    let query = 'UPDATE orders SET ';
    let params = [];
    let sets = [];
    if (status) { sets.push('status = ?'); params.push(status); }
    if (payment_status) { sets.push('payment_status = ?'); params.push(payment_status); }
    if (!sets.length) return res.status(400).json({ success: false, message: 'Nothing to update.' });
    params.push(id);
    await db.execute(query + sets.join(', ') + ' WHERE id = ?', params);
    res.json({ success: true, message: 'Order updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  placeOrder, getUserOrders, getOrder, getVendorOrders,
  updateVendorOrderStatus, adminGetOrders, adminUpdateOrderStatus
};
