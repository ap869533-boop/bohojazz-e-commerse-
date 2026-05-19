const db = require('../config/db');

// @GET /api/cart
const getCart = async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT c.id, c.quantity, c.variant_id,
              p.id as product_id, p.name, p.slug, p.price, p.sale_price, p.stock_quantity,
              pv.name as variant_name, pv.value as variant_value, pv.price_modifier,
              vp.shop_name, vp.shop_slug,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
       FROM cart c 
       JOIN products p ON c.product_id = p.id AND p.status = "published"
       LEFT JOIN product_variants pv ON c.variant_id = pv.id
       JOIN vendor_profiles vp ON p.vendor_id = vp.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    let subtotal = 0;
    items.forEach(item => {
      const price = parseFloat(item.sale_price || item.price) + (parseFloat(item.price_modifier) || 0);
      item.unit_price = price;
      item.item_total = price * item.quantity;
      subtotal += item.item_total;
    });

    res.json({ success: true, data: { items, subtotal, item_count: items.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { product_id, variant_id, quantity = 1 } = req.body;
    const parsedQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    const [products] = await db.execute('SELECT id, stock_quantity, manage_stock FROM products WHERE id = ? AND status = "published"', [product_id]);
    if (!products.length) return res.status(404).json({ success: false, message: 'Product not found.' });
    const product = products[0];

    const [existingItems] = await db.execute(
      `SELECT id, quantity FROM cart
       WHERE user_id = ? AND product_id = ? AND (
         (variant_id IS NULL AND ? IS NULL) OR variant_id = ?
       )
       LIMIT 1`,
      [req.user.id, product_id, variant_id || null, variant_id || null]
    );

    const nextQuantity = (existingItems[0]?.quantity || 0) + parsedQuantity;
    if (product.manage_stock && product.stock_quantity < nextQuantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

    if (existingItems.length) {
      await db.execute(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [nextQuantity, existingItems[0].id, req.user.id]
      );
    } else {
      await db.execute(
        'INSERT INTO cart (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [req.user.id, product_id, variant_id || null, parsedQuantity]
      );
    }

    res.json({ success: true, message: 'Added to cart.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/cart/:id
const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, req.user.id]);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }
    await db.execute('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, req.user.id]);
    res.json({ success: true, message: 'Cart updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
  try {
    await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Item removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT w.id, w.created_at,
              p.id as product_id, p.name, p.slug, p.price, p.sale_price, p.rating, p.stock_quantity,
              vp.shop_name,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
       FROM wishlist w JOIN products p ON w.product_id = p.id
       JOIN vendor_profiles vp ON p.vendor_id = vp.id
       WHERE w.user_id = ? ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/wishlist
const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const [existing] = await db.execute('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
    if (existing.length) {
      await db.execute('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
      return res.json({ success: true, message: 'Removed from wishlist.', in_wishlist: false });
    }
    await db.execute('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
    res.json({ success: true, message: 'Added to wishlist.', in_wishlist: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  try {
    const { code, order_amount } = req.body;
    const [coupons] = await db.execute(
      `SELECT * FROM coupons WHERE code = ? AND is_active = 1 
       AND (expires_at IS NULL OR expires_at > NOW()) 
       AND (usage_limit IS NULL OR used_count < usage_limit)
       AND min_order_amount <= ?`,
      [code, order_amount || 0]
    );
    if (!coupons.length) return res.status(404).json({ success: false, message: 'Invalid or expired coupon.' });

    const coupon = coupons[0];
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (order_amount * coupon.value) / 100;
      if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
    } else {
      discount = coupon.value;
    }

    res.json({ success: true, data: { ...coupon, discount_amount: discount } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart, getWishlist, toggleWishlist, validateCoupon };
