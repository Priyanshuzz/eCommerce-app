-- Insert sample categories
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Electronic devices and gadgets', '/categories/electronics.jpg'),
  ('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion', 'Clothing, shoes, and accessories', '/categories/fashion.jpg'),
  ('33333333-3333-3333-3333-333333333333', 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', '/categories/home-garden.jpg'),
  ('44444444-4444-4444-4444-444444444444', 'Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', '/categories/sports.jpg'),
  ('55555555-5555-5555-5555-555555555555', 'Books & Media', 'books-media', 'Books, magazines, and digital media', '/categories/books.jpg'),
  ('66666666-6666-6666-6666-666666666666', 'Beauty & Health', 'beauty-health', 'Cosmetics, skincare, and health products', '/categories/beauty.jpg'),
  ('77777777-7777-7777-7777-777777777777', 'Automotive', 'automotive', 'Car parts and automotive accessories', '/categories/automotive.jpg'),
  ('88888888-8888-8888-8888-888888888888', 'Toys & Games', 'toys-games', 'Toys, games, and entertainment', '/categories/toys.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Create a sample seller profile (you'll need to create a user first through auth)
-- This assumes a user with ID 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' exists
INSERT INTO public.profiles (id, email, full_name, user_type) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seller@example.com', 'Sample Seller', 'seller')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (id, seller_id, category_id, name, description, price, compare_at_price, sku, stock_quantity, images, tags, is_featured) VALUES
  (
    'p1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Wireless Bluetooth Headphones',
    'Premium wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    79.99,
    99.99,
    'WBH-001',
    50,
    '["/wireless-bluetooth-headphones.jpg"]',
    '{"wireless", "bluetooth", "headphones", "noise-cancellation"}',
    true
  ),
  (
    'p2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Smart Fitness Watch',
    'Advanced fitness tracking with heart rate monitor, GPS, and waterproof design. Track your workouts and health metrics.',
    199.99,
    NULL,
    'SFW-002',
    25,
    '["/smart-fitness-watch.png"]',
    '{"fitness", "watch", "smart", "GPS", "health"}',
    true
  ),
  (
    'p3333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Portable Phone Charger',
    'High-capacity 20,000mAh power bank with fast charging support for all devices. Never run out of battery again.',
    29.99,
    39.99,
    'PPC-003',
    100,
    '["/portable-phone-charger.jpg"]',
    '{"charger", "portable", "power-bank", "fast-charging"}',
    false
  ),
  (
    'p4444444-4444-4444-4444-444444444444',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Wireless Gaming Mouse',
    'Precision gaming mouse with RGB lighting and customizable buttons. Perfect for competitive gaming.',
    59.99,
    NULL,
    'WGM-004',
    35,
    '["/wireless-gaming-mouse.png"]',
    '{"gaming", "mouse", "wireless", "RGB", "precision"}',
    false
  ),
  (
    'p5555555-5555-5555-5555-555555555555',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'Cotton T-Shirt',
    '100% organic cotton t-shirt. Comfortable, breathable, and perfect for everyday wear.',
    24.99,
    34.99,
    'CTS-005',
    200,
    '["/cotton-t-shirt.jpg"]',
    '{"cotton", "organic", "t-shirt", "comfortable"}',
    false
  ),
  (
    'p6666666-6666-6666-6666-666666666666',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '44444444-4444-4444-4444-444444444444',
    'Running Shoes',
    'Lightweight running shoes with advanced cushioning and breathable mesh upper. Perfect for your daily runs.',
    89.99,
    NULL,
    'RS-006',
    45,
    '["/running-shoes-on-track.png"]',
    '{"running", "shoes", "lightweight", "cushioning", "breathable"}',
    true
  ),
  (
    'p7777777-7777-7777-7777-777777777777',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '33333333-3333-3333-3333-333333333333',
    'Coffee Maker',
    'Programmable coffee maker with thermal carafe and built-in grinder. Brew the perfect cup every morning.',
    149.99,
    NULL,
    'CM-007',
    15,
    '["/modern-coffee-maker.png"]',
    '{"coffee", "maker", "programmable", "grinder", "thermal"}',
    false
  ),
  (
    'p8888888-8888-8888-8888-888888888888',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '44444444-4444-4444-4444-444444444444',
    'Yoga Mat',
    'Non-slip yoga mat with extra cushioning and carrying strap. Perfect for yoga, pilates, and stretching.',
    39.99,
    NULL,
    'YM-008',
    75,
    '["/rolled-yoga-mat.png"]',
    '{"yoga", "mat", "non-slip", "cushioning", "exercise"}',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample discount codes
INSERT INTO public.discount_codes (code, description, discount_type, discount_value, minimum_order_amount, usage_limit, valid_until) VALUES
  ('WELCOME10', '10% off for new customers', 'percentage', 10.00, 50.00, 100, NOW() + INTERVAL '30 days'),
  ('SAVE20', '$20 off orders over $100', 'fixed_amount', 20.00, 100.00, 50, NOW() + INTERVAL '14 days'),
  ('FREESHIP', 'Free shipping on orders over $75', 'fixed_amount', 10.00, 75.00, NULL, NOW() + INTERVAL '60 days'),
  ('FLASH50', '50% off flash sale items', 'percentage', 50.00, 0.00, 200, NOW() + INTERVAL '7 days')
ON CONFLICT (code) DO NOTHING;
