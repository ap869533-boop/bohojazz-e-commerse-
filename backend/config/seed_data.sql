-- ============================================================
-- BohoJazz - Sample Data / Seed File
-- Fashion E-Commerce with Real Cloth Images (Unsplash Free)
-- Run AFTER database.sql
-- ============================================================

USE bohojazz_db;

-- ============================================================
-- VENDOR USERS (password for all: Vendor@123)
-- bcrypt hash of "Vendor@123"
-- ============================================================
INSERT INTO users (uuid, name, email, password, phone, role, status, email_verified) VALUES
(UUID(), 'Priya Sharma', 'priya@ethnicbypriya.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876501001', 'vendor', 'active', TRUE),
(UUID(), 'Riya Gupta', 'riya@bohochicstore.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876501002', 'vendor', 'active', TRUE),
(UUID(), 'Meera Patel', 'meera@desivibes.com',     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876501003', 'vendor', 'active', TRUE),
(UUID(), 'Anjali Singh', 'anjali@royalweaves.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876501004', 'vendor', 'active', TRUE),
(UUID(), 'Kavya Nair', 'kavya@southsilks.com',     '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876501005', 'vendor', 'active', TRUE);

-- ============================================================
-- CUSTOMER USERS (password: User@123)
-- ============================================================
INSERT INTO users (uuid, name, email, password, phone, role, status, email_verified) VALUES
(UUID(), 'Neha Verma',    'neha@gmail.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876502001', 'user', 'active', TRUE),
(UUID(), 'Pooja Joshi',   'pooja@gmail.com',  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876502002', 'user', 'active', TRUE),
(UUID(), 'Sunita Rao',    'sunita@gmail.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876502003', 'user', 'active', TRUE),
(UUID(), 'Divya Menon',   'divya@gmail.com',  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876502004', 'user', 'active', TRUE),
(UUID(), 'Aisha Khan',    'aisha@gmail.com',  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876502005', 'user', 'active', TRUE),
(UUID(), 'Shreya Das',    'shreya@gmail.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm', '9876502006', 'user', 'active', TRUE);

-- ============================================================
-- VENDOR PROFILES
-- ============================================================
INSERT INTO vendor_profiles
  (user_id, shop_name, shop_slug, shop_description, business_email, business_phone,
   address, city, state, pincode, commission_rate, is_approved, approved_at,
   total_sales, rating, total_reviews)
VALUES
(
  (SELECT id FROM users WHERE email='priya@ethnicbypriya.com'),
  'Ethnic by Priya', 'ethnic-by-priya',
  'Handcrafted ethnic wear blending traditional Indian artistry with contemporary silhouettes. Each piece tells a story.',
  'priya@ethnicbypriya.com', '9876501001',
  '42, Lajpat Nagar Market', 'New Delhi', 'Delhi', '110024',
  10.00, TRUE, NOW(), 245000.00, 4.6, 89
),
(
  (SELECT id FROM users WHERE email='riya@bohochicstore.com'),
  'Boho Chic Store', 'boho-chic-store',
  'Free-spirited fashion for the modern bohemian. Featuring flowy fabrics, earthy tones, and festival-ready looks.',
  'riya@bohochicstore.com', '9876501002',
  '15, Linking Road', 'Mumbai', 'Maharashtra', '400050',
  10.00, TRUE, NOW(), 312000.00, 4.8, 134
),
(
  (SELECT id FROM users WHERE email='meera@desivibes.com'),
  'Desi Vibes', 'desi-vibes',
  'Where Indian roots meet global trends. Fusion fashion that celebrates the beauty of India in every thread.',
  'meera@desivibes.com', '9876501003',
  '7, Commercial Street', 'Bengaluru', 'Karnataka', '560001',
  10.00, TRUE, NOW(), 189000.00, 4.5, 72
),
(
  (SELECT id FROM users WHERE email='anjali@royalweaves.com'),
  'Royal Weaves', 'royal-weaves',
  'Premium handloom and silk sarees, kurtas, and lehengas. Celebrating the rich weaving traditions of India.',
  'anjali@royalweaves.com', '9876501004',
  '88, Hazratganj', 'Lucknow', 'Uttar Pradesh', '226001',
  10.00, TRUE, NOW(), 421000.00, 4.9, 201
),
(
  (SELECT id FROM users WHERE email='kavya@southsilks.com'),
  'South Silks', 'south-silks',
  'Authentic Kanjivaram, Mysore and Chanderi silks. Luxury ethnic wear for weddings and special occasions.',
  'kavya@southsilks.com', '9876501005',
  '23, T. Nagar', 'Chennai', 'Tamil Nadu', '600017',
  10.00, TRUE, NOW(), 567000.00, 4.7, 178
);

-- ============================================================
-- BANNERS (using Unsplash free fashion images)
-- ============================================================
INSERT INTO banners (title, subtitle, image, link_url, button_text, position, sort_order, is_active) VALUES
(
  'New Winter Collection', 'Classic · Contemporary · Fusion',
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80',
  '/shop?sort=newest', 'Shop Now', 'hero', 1, TRUE
),
(
  'Festival Season Sale', 'Up to 40% Off on Select Styles',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1400&q=80',
  '/shop/sale', 'Shop Sale', 'hero', 2, TRUE
),
(
  'Bridal Collection 2025', 'Lehengas · Sarees · Anarkalis',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80',
  '/shop/co-ords-sets', 'Explore', 'hero', 3, TRUE
),
(
  'Boho Summer Dresses', 'Light, Flowy & Free-Spirited',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
  '/shop/dresses', 'Shop Dresses', 'sidebar', 1, TRUE
);

-- ============================================================
-- PRODUCTS
-- Images: Unsplash free-to-use fashion/clothing photos
-- ============================================================

-- ---- VENDOR 1: Ethnic by Priya (Kurtas & Suits) ----
INSERT INTO products
  (uuid, vendor_id, category_id, name, slug, description, short_description,
   sku, price, sale_price, stock_quantity, fabric, care_instructions, brand,
   tags, status, is_featured, rating, total_reviews, total_sold)
VALUES
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  (SELECT id FROM categories WHERE slug='kurtas-suits'),
  'Floral Anarkali Kurta with Dupatta',
  'floral-anarkali-kurta-dupatta',
  'A stunning Anarkali kurta in soft cotton with hand-block printed florals. Paired with a matching printed dupatta. Perfect for festive occasions and family gatherings. The flared silhouette flatters all body types and moves beautifully. Finished with intricate mirror work at the neckline.',
  'Hand-block printed floral Anarkali with mirror work neckline & matching dupatta.',
  'EBP-ANK-001', 2499.00, 1899.00, 45,
  'Cotton Cambric', 'Gentle hand wash or dry clean. Do not bleach. Iron on medium heat.',
  'Ethnic by Priya',
  '["anarkali","kurta","festive","floral","cotton","ethnic","dupatta"]',
  'published', TRUE, 4.7, 34, 78
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  (SELECT id FROM categories WHERE slug='kurtas-suits'),
  'Embroidered Straight Kurta Set',
  'embroidered-straight-kurta-set',
  'Elegant straight-cut kurta with rich thread embroidery along the neckline and sleeves. Comes with matching palazzo pants and dupatta. Made from premium Chanderi fabric with a beautiful sheen. The intricate embroidery is done by skilled artisans from Lucknow.',
  'Premium Chanderi kurta with Lucknawi embroidery, palazzo & dupatta set.',
  'EBP-STR-002', 3299.00, NULL, 30,
  'Chanderi Silk', 'Dry clean only. Store in a cool, dry place.',
  'Ethnic by Priya',
  '["kurta","embroidery","chanderi","palazzo","set","lucknawi"]',
  'published', FALSE, 4.5, 18, 42
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  (SELECT id FROM categories WHERE slug='kurtas-suits'),
  'Bandhani Print Kurti with Pants',
  'bandhani-print-kurti-pants',
  'Traditional Bandhani tie-dye art in vibrant colors on a comfortable cotton kurti. Paired with cigarette pants. The Bandhani print is authentic, sourced from Jaipur artisans. Lightweight and perfect for daily wear or casual outings.',
  'Authentic Jaipur Bandhani kurti with cigarette pants. Vibrant & comfortable.',
  'EBP-BAN-003', 1799.00, 1399.00, 60,
  'Pure Cotton', 'Machine wash cold. Do not wring. Dry in shade.',
  'Ethnic by Priya',
  '["bandhani","kurti","jaipur","casual","cotton","daily wear"]',
  'published', TRUE, 4.4, 22, 95
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  (SELECT id FROM categories WHERE slug='kurtas-suits'),
  'Chikankari White Kurta',
  'chikankari-white-kurta',
  'Classic white Chikankari kurta with delicate hand-embroidered motifs. A timeless piece that works for both formal and casual settings. The Chikankari work is authentic Lucknawi craftsmanship passed down through generations. Pairs beautifully with any bottom wear.',
  'Authentic Lucknawi Chikankari hand-embroidered white kurta. Timeless elegance.',
  'EBP-CHK-004', 2199.00, NULL, 25,
  'Georgette', 'Gentle hand wash only. Do not tumble dry.',
  'Ethnic by Priya',
  '["chikankari","white","kurta","lucknawi","embroidery","formal"]',
  'published', FALSE, 4.8, 41, 67
);

-- ---- VENDOR 2: Boho Chic Store (Dresses & Tops) ----
INSERT INTO products
  (uuid, vendor_id, category_id, name, slug, description, short_description,
   sku, price, sale_price, stock_quantity, fabric, care_instructions, brand,
   tags, status, is_featured, rating, total_reviews, total_sold)
VALUES
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  (SELECT id FROM categories WHERE slug='dresses'),
  'Maxi Boho Floral Dress',
  'maxi-boho-floral-dress',
  'Effortlessly beautiful maxi dress with an all-over floral print. Features a V-neckline, flowy silhouette and tiered hem. Made from lightweight chiffon that moves with you. Perfect for beach days, brunches, or boho-style festivals. Available in multiple color combinations.',
  'Flowy V-neck floral maxi dress in lightweight chiffon. Beach & festival perfect.',
  'BCS-MXD-001', 2199.00, 1699.00, 55,
  'Chiffon', 'Hand wash cold. Hang dry. Iron on low heat.',
  'Boho Chic Store',
  '["maxi","dress","floral","boho","chiffon","beach","festival"]',
  'published', TRUE, 4.9, 67, 143
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  (SELECT id FROM categories WHERE slug='dresses'),
  'Wrap Midi Dress with Belt',
  'wrap-midi-dress-belt',
  'Classic wrap-style midi dress with adjustable tie belt. The wrap design is universally flattering and the midi length is perfectly versatile. Made from sustainable viscose fabric in an earthy abstract print. Dress up with heels or dress down with sandals.',
  'Flattering wrap midi dress in sustainable viscose. Comes with matching tie belt.',
  'BCS-WRP-002', 2799.00, NULL, 38,
  'Viscose Crepe', 'Machine wash gentle. Do not bleach. Low iron.',
  'Boho Chic Store',
  '["midi","dress","wrap","sustainable","viscose","versatile"]',
  'published', FALSE, 4.6, 29, 58
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  (SELECT id FROM categories WHERE slug='tops-blouses'),
  'Embroidered Boho Crop Top',
  'embroidered-boho-crop-top',
  'Free-spirited crop top with colorful thread embroidery across the chest. The peasant-style neckline and balloon sleeves give it an authentic boho feel. Pairs perfectly with high-waist palazzos or wide-leg jeans. Made from soft cotton with a relaxed fit.',
  'Boho crop top with colorful chest embroidery & balloon sleeves. Pairs with palazzos.',
  'BCS-CRP-003', 1299.00, 999.00, 70,
  'Cotton', 'Machine wash cold. Dry flat to maintain shape.',
  'Boho Chic Store',
  '["crop top","boho","embroidery","cotton","casual","festive"]',
  'published', TRUE, 4.7, 45, 112
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  (SELECT id FROM categories WHERE slug='dresses'),
  'Off-Shoulder Tiered Sundress',
  'off-shoulder-tiered-sundress',
  'Romantic off-shoulder sundress with three tiers of ruffles. The elastic neckline can be worn on or off the shoulder for versatile styling. In a delicate floral print on a cream base. Perfect for summer days and vacations. Lightweight and easy to pack.',
  'Romantic off-shoulder ruffled tiered dress. Cream floral print. Summer essential.',
  'BCS-SND-004', 1899.00, 1499.00, 48,
  'Cotton Voile', 'Hand wash cold. Dry in shade to preserve colors.',
  'Boho Chic Store',
  '["off-shoulder","sundress","tiered","ruffles","summer","floral"]',
  'published', TRUE, 4.8, 53, 98
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  (SELECT id FROM categories WHERE slug='tops-blouses'),
  'Printed Puff Sleeve Blouse',
  'printed-puff-sleeve-blouse',
  'Trendy puff-sleeve blouse in a bold geometric print. The structured puff sleeves add drama while the relaxed body keeps it comfortable. Features a subtle keyhole back with a button closure. Style with sarees, skirts, or trousers for a modern-ethnic look.',
  'Bold geometric print blouse with dramatic puff sleeves. Modern-ethnic versatility.',
  'BCS-BLS-005', 1499.00, NULL, 42,
  'Cotton Silk Blend', 'Dry clean recommended. Steam iron on low.',
  'Boho Chic Store',
  '["blouse","puff sleeve","geometric","modern","ethnic","trendy"]',
  'published', FALSE, 4.5, 31, 74
);

-- ---- VENDOR 3: Desi Vibes (Co-ords & Bottoms) ----
INSERT INTO products
  (uuid, vendor_id, category_id, name, slug, description, short_description,
   sku, price, sale_price, stock_quantity, fabric, care_instructions, brand,
   tags, status, is_featured, rating, total_reviews, total_sold)
VALUES
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='desi-vibes'),
  (SELECT id FROM categories WHERE slug='co-ords-sets'),
  'Tie-Dye Co-ord Set',
  'tie-dye-co-ord-set',
  'Trendy tie-dye matching set featuring a bralette top and wide-leg pants. The vibrant tie-dye pattern is hand-dyed, making each piece unique. Perfect for beachside vacations or casual hangouts. The set is fully lined and the fabric is breathable for Indian summers.',
  'Hand-dyed tie-dye bralette + wide-leg pants set. Each piece uniquely yours.',
  'DV-CORD-001', 2499.00, 1999.00, 35,
  'Rayon', 'Hand wash separately. Colors may bleed slightly initially.',
  'Desi Vibes',
  '["co-ord","tie-dye","set","beach","casual","rayon","wide-leg"]',
  'published', TRUE, 4.6, 38, 82
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='desi-vibes'),
  (SELECT id FROM categories WHERE slug='co-ords-sets'),
  'Printed Shirt and Palazzo Co-ord',
  'printed-shirt-palazzo-co-ord',
  'Matching printed shirt and palazzo set in a stunning block-print pattern. The oversized shirt can be tucked in, left out, or knotted at the waist for multiple looks. The palazzo provides maximum comfort and the pair makes a complete ready-to-wear outfit.',
  'Block-print shirt + palazzo combo. Style 3 ways. Complete ready-to-wear look.',
  'DV-CORD-002', 2899.00, NULL, 28,
  'Linen Blend', 'Machine wash gentle cycle. Hang dry.',
  'Desi Vibes',
  '["co-ord","block print","shirt","palazzo","linen","versatile"]',
  'published', FALSE, 4.4, 19, 44
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='desi-vibes'),
  (SELECT id FROM categories WHERE slug='bottoms'),
  'High-Waist Printed Palazzo',
  'high-waist-printed-palazzo',
  'Comfortable high-waist palazzo pants in a vibrant Ikat print. The wide-leg silhouette is flattering and the elasticated waistband ensures all-day comfort. Pairs beautifully with kurtis, crop tops, or simple white shirts. Made from breathable cotton for Indian climates.',
  'Vibrant Ikat printed high-waist palazzo. Elasticated waist for all-day comfort.',
  'DV-PAL-003', 1199.00, 899.00, 65,
  'Cotton', 'Machine wash. Dry in shade to preserve print.',
  'Desi Vibes',
  '["palazzo","ikat","high-waist","cotton","comfortable","ethnic"]',
  'published', TRUE, 4.7, 56, 134
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='desi-vibes'),
  (SELECT id FROM categories WHERE slug='bottoms'),
  'Flared Skirt with Mirror Work',
  'flared-skirt-mirror-work',
  'Beautiful A-line flared skirt adorned with intricate mirror work at the hem. The tiered construction gives it volume and movement. In a rich burgundy with gold mirror details. Pairs wonderfully with ethnic or fusion tops. Perfect for Navratri, festivals, and celebrations.',
  'Tiered A-line skirt with hand-done mirror work. Navratri & festival perfect.',
  'DV-SKT-004', 1899.00, 1599.00, 40,
  'Rayon', 'Gentle hand wash. Do not wring. Dry in shade.',
  'Desi Vibes',
  '["skirt","mirror work","flared","navratri","festival","ethnic"]',
  'published', FALSE, 4.5, 27, 63
);

-- ---- VENDOR 4: Royal Weaves (Dupattas & Accessories) ----
INSERT INTO products
  (uuid, vendor_id, category_id, name, slug, description, short_description,
   sku, price, sale_price, stock_quantity, fabric, care_instructions, brand,
   tags, status, is_featured, rating, total_reviews, total_sold)
VALUES
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  (SELECT id FROM categories WHERE slug='dupattas-stoles'),
  'Banarasi Silk Dupatta Gold Border',
  'banarasi-silk-dupatta-gold-border',
  'Exquisite Banarasi silk dupatta with a rich zari border and intricate buta motifs woven throughout. The gold zari work catches light beautifully. A must-have accessory to elevate any ethnic outfit. Comes in a signature gift box, perfect as a present.',
  'Authentic Banarasi silk dupatta with gold zari border. Elevates any ethnic look.',
  'RW-DUP-001', 3499.00, NULL, 22,
  'Pure Banarasi Silk', 'Dry clean only. Store in muslin cloth.',
  'Royal Weaves',
  '["dupatta","banarasi","silk","zari","gold","wedding","festive"]',
  'published', TRUE, 4.9, 87, 156
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  (SELECT id FROM categories WHERE slug='dupattas-stoles'),
  'Phulkari Embroidered Dupatta',
  'phulkari-embroidered-dupatta',
  'Vibrant Phulkari dupatta from Punjab with dense, colorful thread embroidery covering the entire surface. Each Phulkari piece is hand-embroidered by skilled artisans and takes weeks to complete. A cherished piece of Indian textile heritage.',
  'Authentic Punjab Phulkari hand-embroidered dupatta. Dense colorful threadwork.',
  'RW-DUP-002', 2799.00, 2399.00, 18,
  'Cotton with Silk Thread', 'Dry clean only. Handle with care.',
  'Royal Weaves',
  '["phulkari","dupatta","embroidery","punjab","traditional","heritage"]',
  'published', TRUE, 4.8, 62, 109
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  (SELECT id FROM categories WHERE slug='accessories'),
  'Oxidized Silver Jhumka Earrings Set',
  'oxidized-silver-jhumka-set',
  'Traditional oxidized silver-finish jhumka earrings with intricate filigree work. The dangling beads and floral motifs make them a perfect accessory for ethnic and fusion outfits. Lightweight despite their bold appearance. Nickel-free and skin-friendly.',
  'Oxidized silver jhumka earrings with filigree work. Lightweight & skin-friendly.',
  'RW-JHK-003', 799.00, 649.00, 80,
  'Brass with Silver Oxidized Finish', 'Wipe with soft dry cloth. Avoid water exposure.',
  'Royal Weaves',
  '["jhumka","earrings","oxidized","silver","ethnic","jewelry","accessories"]',
  'published', FALSE, 4.6, 43, 198
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  (SELECT id FROM categories WHERE slug='accessories'),
  'Kundan Choker Necklace Set',
  'kundan-choker-necklace-set',
  'Royal Kundan choker necklace set with matching earrings and maang tikka. Features green and red meenakari work on gold-plated base with Kundan stone settings. Perfect for weddings, sangeet, and festive occasions. Comes in a velvet gift box.',
  'Kundan choker necklace with earrings & maang tikka. Perfect for weddings.',
  'RW-KND-004', 2499.00, 1999.00, 30,
  'Brass Gold Plated with Kundan', 'Keep dry. Store in provided velvet box.',
  'Royal Weaves',
  '["kundan","choker","necklace","set","wedding","meenakari","gold"]',
  'published', TRUE, 4.7, 74, 121
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  (SELECT id FROM categories WHERE slug='dupattas-stoles'),
  'Chiffon Printed Stole',
  'chiffon-printed-stole',
  'Lightweight chiffon stole with a beautiful paisley and floral digital print. Versatile enough to be worn as a dupatta, scarf, or beach cover-up. The feather-light fabric drapes elegantly. Pack a few in your travel bag as they take almost no space.',
  'Lightweight chiffon paisley stole. Wear as dupatta, scarf, or beach cover-up.',
  'RW-STL-005', 899.00, 699.00, 90,
  'Chiffon', 'Gentle hand wash. Drip dry.',
  'Royal Weaves',
  '["stole","chiffon","printed","paisley","versatile","travel","dupatta"]',
  'published', FALSE, 4.4, 28, 86
);

-- ---- VENDOR 5: South Silks (Premium Sarees / Sale items) ----
INSERT INTO products
  (uuid, vendor_id, category_id, name, slug, description, short_description,
   sku, price, sale_price, stock_quantity, fabric, care_instructions, brand,
   tags, status, is_featured, rating, total_reviews, total_sold)
VALUES
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  (SELECT id FROM categories WHERE slug='sale'),
  'Kanjivaram Silk Saree - Emerald Green',
  'kanjivaram-silk-saree-emerald',
  'Authentic Kanjivaram silk saree in rich emerald green with a contrasting gold zari border and pallu. The traditional temple border design and heavy zari work make this a prized possession. Woven on handlooms in Kanchipuram by master weavers. Comes with an unstitched blouse piece.',
  'Authentic handloom Kanjivaram silk saree. Gold zari temple border. Blouse included.',
  'SS-KNJ-001', 14999.00, 11999.00, 12,
  'Pure Kanjivaram Silk', 'Dry clean only. Store wrapped in muslin cloth with neem leaves.',
  'South Silks',
  '["kanjivaram","saree","silk","zari","wedding","bridal","south indian"]',
  'published', TRUE, 4.9, 103, 67
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  (SELECT id FROM categories WHERE slug='sale'),
  'Mysore Crepe Silk Saree - Rose Pink',
  'mysore-crepe-silk-saree-rose',
  'Elegant Mysore crepe silk saree in soft rose pink with delicate silver border. Mysore silk is known for its soft texture and royal sheen. Lightweight and easy to drape. The minimal design makes it suitable for both formal occasions and casual festive wear. With matching blouse piece.',
  'Soft Mysore crepe silk saree in rose pink. Lightweight & elegant. With blouse piece.',
  'SS-MYS-002', 8999.00, 6999.00, 18,
  'Mysore Crepe Silk', 'Dry clean only.',
  'South Silks',
  '["mysore","silk","saree","crepe","elegant","formal","pink"]',
  'published', TRUE, 4.7, 56, 43
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  (SELECT id FROM categories WHERE slug='sale'),
  'Chanderi Silk Saree - Powder Blue',
  'chanderi-silk-saree-powder-blue',
  'Delicate Chanderi silk saree in powder blue with gold woven bootis throughout. Chanderi is known for its characteristic texture with a translucent appearance. The lightness of this fabric makes it extremely comfortable to wear. Perfect for day events and office parties.',
  'Delicate Chanderi silk saree with gold bootis. Translucent & lightweight.',
  'SS-CHN-003', 5999.00, 4499.00, 24,
  'Chanderi Silk', 'Dry clean or gentle hand wash. Do not wring.',
  'South Silks',
  '["chanderi","silk","saree","booti","lightweight","office","blue"]',
  'published', FALSE, 4.6, 34, 55
),
(
  UUID(),
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  (SELECT id FROM categories WHERE slug='sale'),
  'Kalamkari Printed Cotton Saree',
  'kalamkari-printed-cotton-saree',
  'Hand-painted Kalamkari art on soft cotton saree. Features traditional mythological motifs painted using natural dyes in the authentic Andhra Kalamkari style. Each saree is unique as it is entirely hand-painted by skilled artists. Comfortable for daily wear.',
  'Hand-painted Kalamkari cotton saree with natural dyes. Each piece is unique.',
  'SS-KAL-004', 3499.00, 2799.00, 30,
  'Handloom Cotton', 'First wash separately. Gentle hand wash.',
  'South Silks',
  '["kalamkari","cotton","saree","handpainted","natural dyes","daily wear"]',
  'published', FALSE, 4.5, 41, 77
);

-- ============================================================
-- PRODUCT IMAGES (Unsplash free fashion photos)
-- ============================================================

-- Floral Anarkali Kurta
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Floral Anarkali Kurta Front', TRUE, 0),
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Floral Anarkali Kurta Side', FALSE, 1),
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Floral Anarkali Kurta Detail', FALSE, 2);

-- Embroidered Straight Kurta
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='embroidered-straight-kurta-set'), 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Embroidered Straight Kurta', TRUE, 0),
((SELECT id FROM products WHERE slug='embroidered-straight-kurta-set'), 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Embroidered Kurta Detail', FALSE, 1);

-- Bandhani Kurti
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='bandhani-print-kurti-pants'), 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', 'Bandhani Print Kurti', TRUE, 0),
((SELECT id FROM products WHERE slug='bandhani-print-kurti-pants'), 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Bandhani Detail', FALSE, 1);

-- Chikankari White Kurta
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='chikankari-white-kurta'), 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80', 'Chikankari White Kurta', TRUE, 0),
((SELECT id FROM products WHERE slug='chikankari-white-kurta'), 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Chikankari Embroidery Detail', FALSE, 1);

-- Maxi Boho Floral Dress
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Maxi Boho Floral Dress', TRUE, 0),
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', 'Maxi Dress Side View', FALSE, 1),
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'Maxi Dress Back View', FALSE, 2);

-- Wrap Midi Dress
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='wrap-midi-dress-belt'), 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', 'Wrap Midi Dress', TRUE, 0),
((SELECT id FROM products WHERE slug='wrap-midi-dress-belt'), 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Wrap Dress Detail', FALSE, 1);

-- Embroidered Boho Crop Top
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='embroidered-boho-crop-top'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'Embroidered Boho Crop Top', TRUE, 0),
((SELECT id FROM products WHERE slug='embroidered-boho-crop-top'), 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&q=80', 'Crop Top Embroidery Detail', FALSE, 1);

-- Off Shoulder Tiered Sundress
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='off-shoulder-tiered-sundress'), 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80', 'Off Shoulder Sundress', TRUE, 0),
((SELECT id FROM products WHERE slug='off-shoulder-tiered-sundress'), 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', 'Sundress Side View', FALSE, 1);

-- Printed Puff Sleeve Blouse
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='printed-puff-sleeve-blouse'), 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&q=80', 'Puff Sleeve Blouse', TRUE, 0),
((SELECT id FROM products WHERE slug='printed-puff-sleeve-blouse'), 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'Blouse Back Detail', FALSE, 1);

-- Tie-Dye Co-ord Set
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='tie-dye-co-ord-set'), 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', 'Tie-Dye Co-ord Set', TRUE, 0),
((SELECT id FROM products WHERE slug='tie-dye-co-ord-set'), 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80', 'Tie-Dye Set Detail', FALSE, 1);

-- Printed Shirt Palazzo Co-ord
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='printed-shirt-palazzo-co-ord'), 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', 'Printed Shirt Palazzo', TRUE, 0),
((SELECT id FROM products WHERE slug='printed-shirt-palazzo-co-ord'), 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', 'Co-ord Set Detail', FALSE, 1);

-- High Waist Palazzo
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='high-waist-printed-palazzo'), 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a7e?w=800&q=80', 'High Waist Printed Palazzo', TRUE, 0),
((SELECT id FROM products WHERE slug='high-waist-printed-palazzo'), 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', 'Palazzo Detail', FALSE, 1);

-- Flared Skirt Mirror Work
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='flared-skirt-mirror-work'), 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80', 'Flared Mirror Work Skirt', TRUE, 0),
((SELECT id FROM products WHERE slug='flared-skirt-mirror-work'), 'https://images.unsplash.com/photo-1594938298603-c8148c4b4a7e?w=800&q=80', 'Skirt Mirror Detail', FALSE, 1);

-- Banarasi Dupatta
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='banarasi-silk-dupatta-gold-border'), 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Banarasi Silk Dupatta', TRUE, 0),
((SELECT id FROM products WHERE slug='banarasi-silk-dupatta-gold-border'), 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Banarasi Zari Border Detail', FALSE, 1);

-- Phulkari Dupatta
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='phulkari-embroidered-dupatta'), 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Phulkari Embroidered Dupatta', TRUE, 0),
((SELECT id FROM products WHERE slug='phulkari-embroidered-dupatta'), 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Phulkari Thread Detail', FALSE, 1);

-- Jhumka Earrings
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='oxidized-silver-jhumka-set'), 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', 'Oxidized Silver Jhumka', TRUE, 0),
((SELECT id FROM products WHERE slug='oxidized-silver-jhumka-set'), 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 'Jhumka Close-up', FALSE, 1);

-- Kundan Choker
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='kundan-choker-necklace-set'), 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 'Kundan Choker Necklace', TRUE, 0),
((SELECT id FROM products WHERE slug='kundan-choker-necklace-set'), 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', 'Kundan Set Complete', FALSE, 1);

-- Chiffon Stole
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='chiffon-printed-stole'), 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', 'Chiffon Printed Stole', TRUE, 0);

-- Kanjivaram Saree
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='kanjivaram-silk-saree-emerald'), 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Kanjivaram Silk Saree Emerald', TRUE, 0),
((SELECT id FROM products WHERE slug='kanjivaram-silk-saree-emerald'), 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Kanjivaram Zari Border', FALSE, 1),
((SELECT id FROM products WHERE slug='kanjivaram-silk-saree-emerald'), 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Kanjivaram Pallu Detail', FALSE, 2);

-- Mysore Saree
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='mysore-crepe-silk-saree-rose'), 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Mysore Crepe Silk Saree', TRUE, 0),
((SELECT id FROM products WHERE slug='mysore-crepe-silk-saree-rose'), 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Mysore Silk Border', FALSE, 1);

-- Chanderi Saree
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='chanderi-silk-saree-powder-blue'), 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Chanderi Silk Saree', TRUE, 0),
((SELECT id FROM products WHERE slug='chanderi-silk-saree-powder-blue'), 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Chanderi Booti Detail', FALSE, 1);

-- Kalamkari Saree
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='kalamkari-printed-cotton-saree'), 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', 'Kalamkari Cotton Saree', TRUE, 0),
((SELECT id FROM products WHERE slug='kalamkari-printed-cotton-saree'), 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80', 'Kalamkari Art Detail', FALSE, 1);

-- ============================================================
-- PRODUCT VARIANTS (Sizes for clothing)
-- ============================================================

-- Anarkali Kurta sizes
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, sku) VALUES
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'Size', 'S', 0, 8, 'EBP-ANK-001-S'),
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'Size', 'M', 0, 12, 'EBP-ANK-001-M'),
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'Size', 'L', 0, 14, 'EBP-ANK-001-L'),
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'Size', 'XL', 0, 8, 'EBP-ANK-001-XL'),
((SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'), 'Size', 'XXL', 100, 3, 'EBP-ANK-001-XXL');

-- Maxi Dress sizes
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, sku) VALUES
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'Size', 'XS', 0, 5, 'BCS-MXD-001-XS'),
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'Size', 'S', 0, 10, 'BCS-MXD-001-S'),
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'Size', 'M', 0, 15, 'BCS-MXD-001-M'),
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'Size', 'L', 0, 15, 'BCS-MXD-001-L'),
((SELECT id FROM products WHERE slug='maxi-boho-floral-dress'), 'Size', 'XL', 0, 10, 'BCS-MXD-001-XL');

-- Co-ord Set sizes
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, sku) VALUES
((SELECT id FROM products WHERE slug='tie-dye-co-ord-set'), 'Size', 'S', 0, 8, 'DV-CORD-001-S'),
((SELECT id FROM products WHERE slug='tie-dye-co-ord-set'), 'Size', 'M', 0, 10, 'DV-CORD-001-M'),
((SELECT id FROM products WHERE slug='tie-dye-co-ord-set'), 'Size', 'L', 0, 10, 'DV-CORD-001-L'),
((SELECT id FROM products WHERE slug='tie-dye-co-ord-set'), 'Size', 'XL', 0, 7, 'DV-CORD-001-XL');

-- Palazzo sizes
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, sku) VALUES
((SELECT id FROM products WHERE slug='high-waist-printed-palazzo'), 'Size', 'S (26-28 inch)', 0, 15, 'DV-PAL-003-S'),
((SELECT id FROM products WHERE slug='high-waist-printed-palazzo'), 'Size', 'M (30-32 inch)', 0, 20, 'DV-PAL-003-M'),
((SELECT id FROM products WHERE slug='high-waist-printed-palazzo'), 'Size', 'L (34-36 inch)', 0, 18, 'DV-PAL-003-L'),
((SELECT id FROM products WHERE slug='high-waist-printed-palazzo'), 'Size', 'XL (38-40 inch)', 0, 12, 'DV-PAL-003-XL');

-- Crop Top sizes
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_quantity, sku) VALUES
((SELECT id FROM products WHERE slug='embroidered-boho-crop-top'), 'Size', 'XS', 0, 10, 'BCS-CRP-003-XS'),
((SELECT id FROM products WHERE slug='embroidered-boho-crop-top'), 'Size', 'S', 0, 20, 'BCS-CRP-003-S'),
((SELECT id FROM products WHERE slug='embroidered-boho-crop-top'), 'Size', 'M', 0, 25, 'BCS-CRP-003-M'),
((SELECT id FROM products WHERE slug='embroidered-boho-crop-top'), 'Size', 'L', 0, 15, 'BCS-CRP-003-L');

-- ============================================================
-- CUSTOMER ADDRESSES
-- ============================================================
INSERT INTO addresses (user_id, name, phone, address_line1, address_line2, city, state, pincode, is_default, address_type) VALUES
((SELECT id FROM users WHERE email='neha@gmail.com'),    'Neha Verma', '9876502001', 'B-204, Sunshine Apartments, Sector 15', 'Near Metro Station', 'Noida', 'Uttar Pradesh', '201301', TRUE, 'home'),
((SELECT id FROM users WHERE email='pooja@gmail.com'),   'Pooja Joshi', '9876502002', '12, Rose Garden Colony', NULL, 'Jaipur', 'Rajasthan', '302001', TRUE, 'home'),
((SELECT id FROM users WHERE email='sunita@gmail.com'),  'Sunita Rao', '9876502003', 'Flat 3B, Green Valley, Koramangala', '4th Block', 'Bengaluru', 'Karnataka', '560034', TRUE, 'home'),
((SELECT id FROM users WHERE email='divya@gmail.com'),   'Divya Menon', '9876502004', '77, Indiranagar, 100 Feet Road', NULL, 'Bengaluru', 'Karnataka', '560038', TRUE, 'home'),
((SELECT id FROM users WHERE email='aisha@gmail.com'),   'Aisha Khan', '9876502005', 'C-15, Banjara Hills', 'Road No. 12', 'Hyderabad', 'Telangana', '500034', TRUE, 'home'),
((SELECT id FROM users WHERE email='shreya@gmail.com'),  'Shreya Das', '9876502006', '45, Lake Town', NULL, 'Kolkata', 'West Bengal', '700089', TRUE, 'home');

-- ============================================================
-- COUPONS
-- ============================================================
INSERT INTO coupons (code, type, value, min_order_amount, max_discount, usage_limit, used_count, vendor_id, expires_at, is_active) VALUES
('WELCOME10', 'percentage', 10, 500, 200, NULL, 45, NULL, DATE_ADD(NOW(), INTERVAL 365 DAY), TRUE),
('FLAT200', 'fixed', 200, 1500, NULL, 100, 23, NULL, DATE_ADD(NOW(), INTERVAL 90 DAY), TRUE),
('BOHO20', 'percentage', 20, 1000, 500, 50, 12, NULL, DATE_ADD(NOW(), INTERVAL 60 DAY), TRUE),
('FESTIVE15', 'percentage', 15, 800, 300, 200, 67, NULL, DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE),
('NEWUSER', 'percentage', 25, 0, 250, 1000, 234, NULL, DATE_ADD(NOW(), INTERVAL 180 DAY), TRUE),
('ETHNIC30', 'percentage', 30, 2000, 600, 30, 8,
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  DATE_ADD(NOW(), INTERVAL 45 DAY), TRUE),
('SILK500', 'fixed', 500, 5000, NULL, 20, 5,
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE);

-- ============================================================
-- SAMPLE ORDERS
-- ============================================================

-- Order 1
INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, coupon_id, payment_method, payment_status, status, shipping_address) VALUES
(
  'BJ-SAMPLE-0001',
  (SELECT id FROM users WHERE email='neha@gmail.com'),
  (SELECT id FROM addresses WHERE user_id=(SELECT id FROM users WHERE email='neha@gmail.com') LIMIT 1),
  1899.00, 190.00, 0, 308.34, 2017.34,
  (SELECT id FROM coupons WHERE code='WELCOME10'),
  'upi', 'paid', 'delivered',
  JSON_OBJECT('name','Neha Verma','phone','9876502001','address_line1','B-204, Sunshine Apartments','city','Noida','state','Uttar Pradesh','pincode','201301')
);

INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_image, quantity, unit_price, total_price, vendor_earnings, commission_amount, vendor_status, shipped_at, delivered_at) VALUES
(
  (SELECT id FROM orders WHERE order_number='BJ-SAMPLE-0001'),
  (SELECT id FROM products WHERE slug='maxi-boho-floral-dress'),
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  'Maxi Boho Floral Dress',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  1, 1699.00, 1699.00, 1529.10, 169.90, 'delivered', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)
);

-- Order 2
INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, payment_method, payment_status, status, shipping_address) VALUES
(
  'BJ-SAMPLE-0002',
  (SELECT id FROM users WHERE email='pooja@gmail.com'),
  (SELECT id FROM addresses WHERE user_id=(SELECT id FROM users WHERE email='pooja@gmail.com') LIMIT 1),
  4498.00, 0, 0, 809.64, 5307.64,
  'cod', 'pending', 'shipped',
  JSON_OBJECT('name','Pooja Joshi','phone','9876502002','address_line1','12, Rose Garden Colony','city','Jaipur','state','Rajasthan','pincode','302001')
);

INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_image, quantity, unit_price, total_price, vendor_earnings, commission_amount, vendor_status, shipped_at) VALUES
(
  (SELECT id FROM orders WHERE order_number='BJ-SAMPLE-0002'),
  (SELECT id FROM products WHERE slug='kanjivaram-silk-saree-emerald'),
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  'Kanjivaram Silk Saree - Emerald Green',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
  1, 11999.00, 11999.00, 10799.10, 1199.90, 'shipped', DATE_SUB(NOW(), INTERVAL 2 DAY)
),
(
  (SELECT id FROM orders WHERE order_number='BJ-SAMPLE-0002'),
  (SELECT id FROM products WHERE slug='banarasi-silk-dupatta-gold-border'),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  'Banarasi Silk Dupatta Gold Border',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&q=80',
  1, 3499.00, 3499.00, 3149.10, 349.90, 'shipped', DATE_SUB(NOW(), INTERVAL 2 DAY)
);

-- Order 3
INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, payment_method, payment_status, status, shipping_address) VALUES
(
  'BJ-SAMPLE-0003',
  (SELECT id FROM users WHERE email='sunita@gmail.com'),
  (SELECT id FROM addresses WHERE user_id=(SELECT id FROM users WHERE email='sunita@gmail.com') LIMIT 1),
  2998.00, 200.00, 0, 503.64, 3301.64,
  'upi', 'paid', 'confirmed',
  JSON_OBJECT('name','Sunita Rao','phone','9876502003','address_line1','Flat 3B, Green Valley','city','Bengaluru','state','Karnataka','pincode','560034')
);

INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_image, quantity, unit_price, total_price, vendor_earnings, commission_amount, vendor_status) VALUES
(
  (SELECT id FROM orders WHERE order_number='BJ-SAMPLE-0003'),
  (SELECT id FROM products WHERE slug='tie-dye-co-ord-set'),
  (SELECT id FROM vendor_profiles WHERE shop_slug='desi-vibes'),
  'Tie-Dye Co-ord Set',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  1, 1999.00, 1999.00, 1799.10, 199.90, 'confirmed'
),
(
  (SELECT id FROM orders WHERE order_number='BJ-SAMPLE-0003'),
  (SELECT id FROM products WHERE slug='oxidized-silver-jhumka-set'),
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  'Oxidized Silver Jhumka Earrings Set',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',
  1, 649.00, 649.00, 584.10, 64.90, 'confirmed'
);

-- Order 4
INSERT INTO orders (order_number, user_id, address_id, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, payment_method, payment_status, status, shipping_address) VALUES
(
  'BJ-SAMPLE-0004',
  (SELECT id FROM users WHERE email='aisha@gmail.com'),
  (SELECT id FROM addresses WHERE user_id=(SELECT id FROM users WHERE email='aisha@gmail.com') LIMIT 1),
  1899.00, 0, 99, 341.82, 2339.82,
  'card', 'paid', 'pending',
  JSON_OBJECT('name','Aisha Khan','phone','9876502005','address_line1','C-15, Banjara Hills','city','Hyderabad','state','Telangana','pincode','500034')
);

INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_image, quantity, unit_price, total_price, vendor_earnings, commission_amount, vendor_status) VALUES
(
  (SELECT id FROM orders WHERE order_number='BJ-SAMPLE-0004'),
  (SELECT id FROM products WHERE slug='bandhani-print-kurti-pants'),
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  'Bandhani Print Kurti with Pants',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  1, 1399.00, 1399.00, 1259.10, 139.90, 'pending'
);

-- ============================================================
-- REVIEWS
-- ============================================================
INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified, is_approved) VALUES
(
  (SELECT id FROM products WHERE slug='maxi-boho-floral-dress'),
  (SELECT id FROM users WHERE email='neha@gmail.com'),
  5, 'Absolutely stunning!',
  'This dress is everything I hoped for! The fabric is so lightweight and the floral print is gorgeous in person. Got so many compliments at the beach. Sizing is perfect, I ordered M and it fits like a dream. Will definitely order more pieces!',
  TRUE, TRUE
),
(
  (SELECT id FROM products WHERE slug='floral-anarkali-kurta-dupatta'),
  (SELECT id FROM users WHERE email='pooja@gmail.com'),
  4, 'Beautiful kurta, great quality',
  'The Anarkali is really beautiful and the fabric feels premium. The mirror work at the neckline is exquisite. Only giving 4 stars because the delivery took a bit longer than expected. But the product itself is 5 stars!',
  FALSE, TRUE
),
(
  (SELECT id FROM products WHERE slug='kanjivaram-silk-saree-emerald'),
  (SELECT id FROM users WHERE email='shreya@gmail.com'),
  5, 'Heirloom quality saree',
  'I bought this for my cousin s wedding and everyone wanted to know where I got it from. The zari work is incredible and the silk is genuinely heavy and rich. Worth every rupee. South Silks has earned a lifetime customer.',
  FALSE, TRUE
),
(
  (SELECT id FROM products WHERE slug='banarasi-silk-dupatta-gold-border'),
  (SELECT id FROM users WHERE email='divya@gmail.com'),
  5, 'Magnificent Banarasi work!',
  'The craftsmanship on this dupatta is unbelievable. The gold zari border catches light beautifully. I paired it with a plain anarkali and it transformed the entire look. The gift box packaging was also very elegant.',
  FALSE, TRUE
),
(
  (SELECT id FROM products WHERE slug='embroidered-boho-crop-top'),
  (SELECT id FROM users WHERE email='sunita@gmail.com'),
  5, 'Festival must-have!',
  'Wore this to a music festival and received so many compliments. The embroidery is really intricate and colorful. Paired it with high-waist palazzo and it was the perfect festival look. Fabric is comfortable too!',
  TRUE, TRUE
),
(
  (SELECT id FROM products WHERE slug='phulkari-embroidered-dupatta'),
  (SELECT id FROM users WHERE email='aisha@gmail.com'),
  5, 'Authentic Phulkari art',
  'I have seen many Phulkari dupattas but this one is exceptional. The density of embroidery and the color combinations are stunning. I can see the hours of work that have gone into it. A true work of art.',
  FALSE, TRUE
),
(
  (SELECT id FROM products WHERE slug='tie-dye-co-ord-set'),
  (SELECT id FROM users WHERE email='neha@gmail.com'),
  4, 'Unique and trendy!',
  'Love the concept of each piece being unique due to hand-dyeing. My set has the most beautiful purple-teal combination. The fabric is soft and comfortable. The wide-leg pants are very flattering. Minor issue was the colors bled a tiny bit on first wash.',
  FALSE, TRUE
),
(
  (SELECT id FROM products WHERE slug='high-waist-printed-palazzo'),
  (SELECT id FROM users WHERE email='pooja@gmail.com'),
  5, 'Best palazzo ever!',
  'I have been looking for the perfect Ikat palazzo for months. This is IT. The print is vibrant, the waist is comfortable and the fabric is breathable. Already ordered two more colors. Sizing chart is accurate.',
  FALSE, TRUE
);

-- ============================================================
-- NOTIFICATIONS for customers
-- ============================================================
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
((SELECT id FROM users WHERE email='neha@gmail.com'), 'Order Delivered!', 'Your order BJ-SAMPLE-0001 has been delivered. Enjoy your Maxi Boho Floral Dress!', 'order', TRUE),
((SELECT id FROM users WHERE email='neha@gmail.com'), 'Welcome to BohoJazz!', 'Discover our latest boho fashion collections. Use code WELCOME10 for 10% off!', 'promotion', FALSE),
((SELECT id FROM users WHERE email='pooja@gmail.com'), 'Order Shipped!', 'Your order BJ-SAMPLE-0002 has been shipped. Track your order now.', 'order', FALSE),
((SELECT id FROM users WHERE email='sunita@gmail.com'), 'Order Confirmed!', 'Your order BJ-SAMPLE-0003 has been confirmed and is being prepared.', 'order', FALSE),
((SELECT id FROM users WHERE email='aisha@gmail.com'), 'New Order Placed', 'Your order BJ-SAMPLE-0004 has been placed successfully.', 'order', FALSE);

-- ============================================================
-- VENDOR PAYOUTS (sample)
-- ============================================================
INSERT INTO vendor_payouts (vendor_id, amount, status, payment_method, notes, processed_at) VALUES
(
  (SELECT id FROM vendor_profiles WHERE shop_slug='boho-chic-store'),
  8500.00, 'paid', 'bank_transfer', 'ICICI Bank - 4521xxxxx', DATE_SUB(NOW(), INTERVAL 10 DAY)
),
(
  (SELECT id FROM vendor_profiles WHERE shop_slug='south-silks'),
  22000.00, 'paid', 'bank_transfer', 'SBI - 7832xxxxx', DATE_SUB(NOW(), INTERVAL 7 DAY)
),
(
  (SELECT id FROM vendor_profiles WHERE shop_slug='royal-weaves'),
  12500.00, 'pending', 'bank_transfer', 'HDFC - 9021xxxxx', NULL
),
(
  (SELECT id FROM vendor_profiles WHERE shop_slug='ethnic-by-priya'),
  6800.00, 'pending', 'bank_transfer', 'Kotak - 3312xxxxx', NULL
);

-- ============================================================
-- UPDATE PRODUCT TOTALS (to reflect reviews)
-- ============================================================
UPDATE products p SET
  rating = (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.product_id = p.id AND r.is_approved = 1),
  total_reviews = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id AND r.is_approved = 1)
WHERE p.id IN (SELECT product_id FROM reviews);

-- ============================================================
-- FINAL SUMMARY
-- ============================================================
SELECT '✅ Seed data loaded successfully!' AS status;
SELECT 'Users' AS entity, COUNT(*) AS count FROM users
UNION ALL SELECT 'Vendors', COUNT(*) FROM vendor_profiles
UNION ALL SELECT 'Products', COUNT(*) FROM products WHERE status='published'
UNION ALL SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL SELECT 'Product Variants', COUNT(*) FROM product_variants
UNION ALL SELECT 'Orders', COUNT(*) FROM orders
UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL SELECT 'Banners', COUNT(*) FROM banners;
