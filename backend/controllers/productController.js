const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

// @GET /api/products - Public: all published products with filters
const getProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 20, category, search, vendor,
      min_price, max_price, sort = 'newest', featured
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['p.status = "published"'];
    let params = [];

    if (category) { where.push('c.slug = ?'); params.push(category); }
    if (search) { where.push('MATCH(p.name, p.description, p.short_description) AGAINST(? IN BOOLEAN MODE)'); params.push(search + '*'); }
    if (vendor) { where.push('vp.shop_slug = ?'); params.push(vendor); }
    if (min_price) { where.push('COALESCE(p.sale_price, p.price) >= ?'); params.push(min_price); }
    if (max_price) { where.push('COALESCE(p.sale_price, p.price) <= ?'); params.push(max_price); }
    if (featured === 'true') { where.push('p.is_featured = TRUE'); }

    const orderMap = {
      newest: 'p.created_at DESC',
      oldest: 'p.created_at ASC',
      price_asc: 'COALESCE(p.sale_price, p.price) ASC',
      price_desc: 'COALESCE(p.sale_price, p.price) DESC',
      rating: 'p.rating DESC',
      popular: 'p.total_sold DESC',
    };
    const orderBy = orderMap[sort] || 'p.created_at DESC';
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN vendor_profiles vp ON p.vendor_id = vp.id 
       ${whereStr}`,
      params
    );

    const [products] = await db.execute(
      `SELECT p.id, p.uuid, p.name, p.slug, p.short_description, p.price, p.sale_price, 
              p.stock_quantity, p.rating, p.total_reviews, p.total_sold, p.is_featured,
              c.name as category_name, c.slug as category_slug,
              vp.shop_name, vp.shop_slug,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN vendor_profiles vp ON p.vendor_id = vp.id 
       ${whereStr} ORDER BY ${orderBy} LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: products,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countRows[0].total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/products/:slug - Single product detail
const getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              vp.shop_name, vp.shop_slug, vp.rating as vendor_rating, vp.is_approved,
              u.name as vendor_owner
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN vendor_profiles vp ON p.vendor_id = vp.id 
       LEFT JOIN users u ON vp.user_id = u.id
       WHERE p.slug = ? AND p.status = "published"`,
      [slug]
    );

    if (!products.length) return res.status(404).json({ success: false, message: 'Product not found.' });

    const product = products[0];
    const [images] = await db.execute('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC', [product.id]);
    const [variants] = await db.execute('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
    const [reviews] = await db.execute(
      `SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar 
       FROM reviews r JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = ? AND r.is_approved = 1 
       ORDER BY r.created_at DESC LIMIT 10`,
      [product.id]
    );

    // Increment views
    await db.execute('UPDATE products SET views = views + 1 WHERE id = ?', [product.id]);

    res.json({ success: true, data: { ...product, images, variants, reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/vendor/products - Create product (vendor only)
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const [vp] = await db.execute('SELECT id, is_approved FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor profile not found.' });
    if (!vp[0].is_approved) return res.status(403).json({ success: false, message: 'Vendor not approved yet.' });

    const {
      name, description, short_description, category_id, price, sale_price,
      stock_quantity, sku, fabric, care_instructions, brand, tags, variants
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const productUUID = uuidv4();

    const [result] = await db.execute(
      `INSERT INTO products (uuid, vendor_id, category_id, name, slug, description, short_description, 
       sku, price, sale_price, stock_quantity, fabric, care_instructions, brand, tags, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")`,
      [productUUID, vp[0].id, category_id || null, name, slug, description, short_description,
       sku || null, price, sale_price || null, stock_quantity || 0, fabric || null,
       care_instructions || null, brand || null, tags ? JSON.stringify(tags) : null]
    );

    const productId = result.insertId;

    // Save variants
    if (variants && variants.length) {
      for (const v of variants) {
        await db.execute(
          'INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, sku) VALUES (?, ?, ?, ?, ?, ?)',
          [productId, v.name, v.value, v.price_modifier || 0, v.stock_quantity || 0, v.sku || null]
        );
      }
    }

    res.status(201).json({ success: true, message: 'Product submitted for review.', data: { id: productId, uuid: productUUID, slug } });
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/vendor/products/:id - Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor not found.' });

    const [products] = await db.execute('SELECT id FROM products WHERE id = ? AND vendor_id = ?', [id, vp[0].id]);
    if (!products.length) return res.status(404).json({ success: false, message: 'Product not found.' });

    const {
      name, description, short_description, category_id, price, sale_price,
      stock_quantity, sku, fabric, care_instructions, brand, tags
    } = req.body;

    await db.execute(
      `UPDATE products SET name = ?, description = ?, short_description = ?, category_id = ?,
       price = ?, sale_price = ?, stock_quantity = ?, sku = ?, fabric = ?, 
       care_instructions = ?, brand = ?, tags = ?, status = "pending"
       WHERE id = ?`,
      [name, description, short_description, category_id || null, price, sale_price || null,
       stock_quantity || 0, sku || null, fabric || null, care_instructions || null, brand || null,
       tags ? JSON.stringify(tags) : null, id]
    );

    res.json({ success: true, message: 'Product updated and sent for review.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @DELETE /api/vendor/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor not found.' });

    const [products] = await db.execute('SELECT id FROM products WHERE id = ? AND vendor_id = ?', [id, vp[0].id]);
    if (!products.length) return res.status(404).json({ success: false, message: 'Product not found.' });

    await db.execute('UPDATE products SET status = "archived" WHERE id = ?', [id]);
    res.json({ success: true, message: 'Product archived.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/vendor/products - Vendor's own products
const getVendorProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [vp] = await db.execute('SELECT id FROM vendor_profiles WHERE user_id = ?', [req.user.id]);
    if (!vp.length) return res.status(403).json({ success: false, message: 'Vendor not found.' });

    let where = ['p.vendor_id = ?'];
    let params = [vp[0].id];
    if (status) { where.push('p.status = ?'); params.push(status); }

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM products p WHERE ${where.join(' AND ')}`, params);

    const [products] = await db.execute(
      `SELECT p.id, p.uuid, p.name, p.slug, p.price, p.sale_price, p.stock_quantity, 
              p.status, p.rating, p.total_sold, p.created_at,
              c.name as category_name,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM products p LEFT JOIN categories c ON p.category_id = c.id 
       WHERE ${where.join(' AND ')} ORDER BY p.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: products,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/products/:id/status - Admin approve/reject product
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['published', 'rejected', 'archived', 'draft'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

    await db.execute('UPDATE products SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Product ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/products - Admin: all products
const adminGetProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, vendor } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = [];
    let params = [];
    if (status) { where.push('p.status = ?'); params.push(status); }
    if (vendor) { where.push('vp.id = ?'); params.push(vendor); }
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM products p LEFT JOIN vendor_profiles vp ON p.vendor_id = vp.id ${whereStr}`, params);

    const [products] = await db.execute(
      `SELECT p.id, p.uuid, p.name, p.slug, p.price, p.sale_price, p.stock_quantity, p.status,
              p.rating, p.total_sold, p.created_at,
              c.name as category_name, vp.shop_name, vp.id as vendor_id,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN vendor_profiles vp ON p.vendor_id = vp.id 
       ${whereStr} ORDER BY p.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true, data: products,
      pagination: { total: countRows[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(countRows[0].total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getVendorProducts, updateProductStatus, adminGetProducts
};
