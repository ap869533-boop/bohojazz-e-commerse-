const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('../config/db');

const pendingRazorpayOrders = new Map();
const RAZORPAY_SESSION_TTL_MS = 15 * 60 * 1000;

const generateOrderNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BJ-${ts}-${rand}`;
};

const getRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured.');
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const getSettingsMap = async (conn) => {
  const [settings] = await conn.execute(
    'SELECT setting_key, setting_value FROM settings WHERE setting_key IN ("free_shipping_above","shipping_charge")'
  );
  const settingsMap = {
    free_shipping_above: 999,
    shipping_charge: 99,
  };

  settings.forEach((setting) => {
    settingsMap[setting.setting_key] = parseFloat(setting.setting_value);
  });

  return settingsMap;
};

const getCartItemsForUser = async (conn, userId) => {
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

  if (!cartItems.length) {
    throw new Error('Cart is empty.');
  }

  for (const item of cartItems) {
    if (item.manage_stock && item.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for: ${item.name}`);
    }
  }

  return cartItems.map((item) => ({
    ...item,
    price: parseFloat(item.price),
    sale_price: item.sale_price ? parseFloat(item.sale_price) : null,
    stock_quantity: parseFloat(item.stock_quantity || 0),
    quantity: parseInt(item.quantity, 10),
    price_modifier: parseFloat(item.price_modifier || 0),
    commission_rate: parseFloat(item.commission_rate || 10),
  }));
};

const getAddressForUser = async (conn, addressId, userId) => {
  const [addresses] = await conn.execute(
    'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
    [addressId, userId]
  );

  if (!addresses.length) {
    throw new Error('Invalid address.');
  }

  return addresses[0];
};

const calculateCoupon = async (conn, couponCode, subtotal) => {
  if (!couponCode) {
    return { couponId: null, discountAmount: 0, couponCode: null };
  }

  const [coupons] = await conn.execute(
    `SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())
     AND (usage_limit IS NULL OR used_count < usage_limit) AND min_order_amount <= ?`,
    [couponCode, subtotal]
  );

  if (!coupons.length) {
    throw new Error('Invalid coupon.');
  }

  const coupon = coupons[0];
  let discountAmount = 0;

  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * parseFloat(coupon.value)) / 100;
    if (coupon.max_discount) {
      discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount));
    }
  } else {
    discountAmount = parseFloat(coupon.value);
  }

  return {
    couponId: coupon.id,
    discountAmount,
    couponCode,
  };
};

const buildOrderSnapshot = async (conn, { userId, addressId, couponCode, notes }) => {
  const [cartItems, address, settingsMap] = await Promise.all([
    getCartItemsForUser(conn, userId),
    getAddressForUser(conn, addressId, userId),
    getSettingsMap(conn),
  ]);

  let subtotal = 0;
  for (const item of cartItems) {
    const basePrice = item.sale_price || item.price;
    subtotal += (basePrice + item.price_modifier) * item.quantity;
  }

  const { couponId, discountAmount } = await calculateCoupon(conn, couponCode, subtotal);
  const shippingAmount = subtotal >= settingsMap.free_shipping_above ? 0 : settingsMap.shipping_charge || 99;
  const taxAmount = (subtotal - discountAmount) * 0.18;
  const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;
  const orderNumber = generateOrderNumber();

  return {
    userId,
    addressId,
    couponId,
    couponCode: couponCode || null,
    notes: notes || null,
    orderNumber,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalAmount,
    address: {
      name: address.name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    },
    cartItems: cartItems.map((item) => ({
      cart_id: item.id,
      product_id: item.product_id,
      vendor_id: item.vendor_id,
      variant_id: item.variant_id || null,
      name: item.name,
      image: item.image,
      variant_name: item.variant_name || null,
      quantity: item.quantity,
      manage_stock: !!item.manage_stock,
      price: item.price,
      sale_price: item.sale_price,
      price_modifier: item.price_modifier,
      commission_rate: item.commission_rate,
    })),
  };
};

const createOrderFromSnapshot = async (conn, snapshot, paymentMethod, paymentStatus) => {
  const shippingAddress = JSON.stringify(snapshot.address);

  const [orderResult] = await conn.execute(
    `INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount,
     shipping_amount, tax_amount, total_amount, coupon_id, payment_method, payment_status, shipping_address, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      snapshot.orderNumber,
      snapshot.userId,
      snapshot.addressId,
      snapshot.subtotal,
      snapshot.discountAmount,
      snapshot.shippingAmount,
      snapshot.taxAmount,
      snapshot.totalAmount,
      snapshot.couponId,
      paymentMethod,
      paymentStatus,
      shippingAddress,
      snapshot.notes,
    ]
  );

  const orderId = orderResult.insertId;

  for (const item of snapshot.cartItems) {
    const basePrice = item.sale_price || item.price;
    const unitPrice = parseFloat(basePrice) + parseFloat(item.price_modifier || 0);
    const totalPrice = unitPrice * item.quantity;
    const commissionAmount = (totalPrice * (item.commission_rate || 10)) / 100;
    const vendorEarnings = totalPrice - commissionAmount;

    await conn.execute(
      `INSERT INTO order_items (order_id, product_id, vendor_id, variant_id, product_name,
       product_image, variant_name, quantity, unit_price, total_price, vendor_earnings, commission_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        item.product_id,
        item.vendor_id,
        item.variant_id,
        item.name,
        item.image,
        item.variant_name,
        item.quantity,
        unitPrice,
        totalPrice,
        vendorEarnings,
        commissionAmount,
      ]
    );

    if (item.manage_stock) {
      await conn.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ?, total_sold = total_sold + ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      );
    }
  }

  if (snapshot.couponId) {
    await conn.execute('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [snapshot.couponId]);
  }

  await conn.execute('DELETE FROM cart WHERE user_id = ?', [snapshot.userId]);
  await conn.execute(
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, "order")',
    [snapshot.userId, 'Order Placed!', `Your order #${snapshot.orderNumber} has been placed successfully.`]
  );

  return {
    order_id: orderId,
    order_number: snapshot.orderNumber,
    total_amount: snapshot.totalAmount,
    payment_method: paymentMethod,
    payment_status: paymentStatus,
  };
};

const cleanupExpiredPendingOrders = () => {
  const now = Date.now();
  for (const [razorpayOrderId, snapshot] of pendingRazorpayOrders.entries()) {
    if (snapshot.expiresAt <= now) {
      pendingRazorpayOrders.delete(razorpayOrderId);
    }
  }
};

const placeOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { address_id, payment_method, coupon_code, notes } = req.body;
    const userId = req.user.id;
    const paymentMethod = payment_method || 'cod';

    if (paymentMethod !== 'cod') {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: 'Use Razorpay checkout for online payments.',
      });
    }

    const snapshot = await buildOrderSnapshot(conn, {
      userId,
      addressId: address_id,
      couponCode: coupon_code,
      notes,
    });

    const order = await createOrderFromSnapshot(conn, snapshot, 'cod', 'pending');
    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order,
    });
  } catch (err) {
    await conn.rollback();
    console.error('placeOrder error:', err);
    res.status(err.message ? 400 : 500).json({ success: false, message: err.message || 'Server error.' });
  } finally {
    conn.release();
  }
};

const createRazorpayOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { address_id, coupon_code, notes } = req.body;
    const snapshot = await buildOrderSnapshot(conn, {
      userId: req.user.id,
      addressId: address_id,
      couponCode: coupon_code,
      notes,
    });

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(snapshot.totalAmount * 100),
      currency: 'INR',
      receipt: snapshot.orderNumber,
      notes: {
        user_id: String(req.user.id),
        order_number: snapshot.orderNumber,
      },
    });

    cleanupExpiredPendingOrders();
    pendingRazorpayOrders.set(razorpayOrder.id, {
      ...snapshot,
      razorpayOrderId: razorpayOrder.id,
      expiresAt: Date.now() + RAZORPAY_SESSION_TTL_MS,
    });

    res.status(201).json({
      success: true,
      data: {
        key_id: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        razorpay_order_id: razorpayOrder.id,
        order_number: snapshot.orderNumber,
        total_amount: snapshot.totalAmount,
        company_name: process.env.RAZORPAY_COMPANY_NAME || 'BohoJazz',
      },
    });
  } catch (err) {
    console.error('createRazorpayOrder error:', err);
    res.status(err.message ? 400 : 500).json({ success: false, message: err.message || 'Server error.' });
  } finally {
    conn.release();
  }
};

const verifyRazorpayPayment = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const pendingOrder = pendingRazorpayOrders.get(razorpay_order_id);
    if (!pendingOrder || pendingOrder.userId !== req.user.id) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Payment session expired. Please try again.' });
    }

    if (pendingOrder.expiresAt <= Date.now()) {
      pendingRazorpayOrders.delete(razorpay_order_id);
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Payment session expired. Please try again.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    const order = await createOrderFromSnapshot(conn, pendingOrder, 'razorpay', 'paid');
    pendingRazorpayOrders.delete(razorpay_order_id);
    await conn.commit();

    res.json({
      success: true,
      message: 'Payment verified successfully.',
      data: {
        ...order,
        razorpay_order_id,
        razorpay_payment_id,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('verifyRazorpayPayment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    conn.release();
  }
};

// @GET /api/orders - User's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    let where = ['o.user_id = ?'];
    let params = [req.user.id];
    if (status) {
      where.push('o.status = ?');
      params.push(status);
    }

    const [countRows] = await db.execute(`SELECT COUNT(*) as total FROM orders o WHERE ${where.join(' AND ')}`, params);
    const [orders] = await db.execute(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, o.payment_method, o.created_at,
              COUNT(oi.id) as item_count
       FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE ${where.join(' AND ')} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit, 10)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(countRows[0].total / limit),
      },
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
       FROM order_items oi JOIN vendor_profiles vp ON oi.vendor_id = vp.id WHERE oi.order_id = ?`,
      [id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/vendor/orders - Vendor's orders
const getVendorOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor not found.' });

    let where = ['oi.vendor_id = ?'];
    let params = [vp[0].id];
    if (status) {
      where.push('oi.vendor_status = ?');
      params.push(status);
    }

    const [countRows] = await db.execute(
      `SELECT COUNT(DISTINCT o.id) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE ${where.join(' AND ')}`,
      params
    );

    const [orders] = await db.execute(
      `SELECT DISTINCT o.id, o.order_number, o.created_at, o.payment_status,
              u.name as customer_name, u.email as customer_email,
              SUM(oi.total_price) as vendor_total, SUM(oi.vendor_earnings) as vendor_earnings,
              GROUP_CONCAT(DISTINCT oi.vendor_status) as item_statuses
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN users u ON o.user_id = u.id
       WHERE ${where.join(' AND ')} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit, 10)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(countRows[0].total / limit),
      },
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
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    let where = [];
    let params = [];
    if (status) {
      where.push('o.status = ?');
      params.push(status);
    }
    if (payment_status) {
      where.push('o.payment_status = ?');
      params.push(payment_status);
    }
    const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await db.execute(`SELECT COUNT(*) as total FROM orders o ${whereStr}`, params);
    const [orders] = await db.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email,
              COUNT(oi.id) as item_count
       FROM orders o JOIN users u ON o.user_id = u.id LEFT JOIN order_items oi ON o.id = oi.order_id
       ${whereStr} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit, 10)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(countRows[0].total / limit),
      },
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
    if (status) {
      sets.push('status = ?');
      params.push(status);
    }
    if (payment_status) {
      sets.push('payment_status = ?');
      params.push(payment_status);
    }
    if (!sets.length) return res.status(400).json({ success: false, message: 'Nothing to update.' });
    params.push(id);
    await db.execute(query + sets.join(', ') + ' WHERE id = ?', params);
    res.json({ success: true, message: 'Order updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  placeOrder,
  getUserOrders,
  getOrder,
  getVendorOrders,
  updateVendorOrderStatus,
  adminGetOrders,
  adminUpdateOrderStatus,
};
