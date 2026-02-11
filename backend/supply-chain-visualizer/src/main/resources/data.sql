-- Seed data for Supply Chain Visualizer
-- Uses ON CONFLICT DO NOTHING so it's safe to run on every startup

-- ===================== NODES (Locations) =====================
INSERT INTO nodes (id, name, type, latitude, longitude, capacity, status, created_at, updated_at)
VALUES
  (1, 'Shanghai Factory', 'factory', 31.2304, 121.4737, 50000, 'active', NOW(), NOW()),
  (2, 'Shenzhen Factory', 'factory', 22.5431, 114.0579, 40000, 'active', NOW(), NOW()),
  (3, 'Los Angeles Warehouse', 'warehouse', 33.9425, -118.2551, 30000, 'active', NOW(), NOW()),
  (4, 'Chicago Distribution Center', 'warehouse', 41.8781, -87.6298, 25000, 'active', NOW(), NOW()),
  (5, 'New York Warehouse', 'warehouse', 40.7128, -74.0060, 20000, 'active', NOW(), NOW()),
  (6, 'Miami Store', 'store', 25.7617, -80.1918, 5000, 'active', NOW(), NOW()),
  (7, 'Dallas Store', 'store', 32.7767, -96.7970, 4500, 'active', NOW(), NOW()),
  (8, 'Seattle Store', 'store', 47.6062, -122.3321, 4000, 'active', NOW(), NOW()),
  (9, 'London Warehouse', 'warehouse', 51.5074, -0.1278, 22000, 'active', NOW(), NOW()),
  (10, 'Tokyo Distribution Center', 'warehouse', 35.6762, 139.6503, 18000, 'active', NOW(), NOW()),
  (11, 'Mumbai Factory', 'factory', 19.0760, 72.8777, 35000, 'active', NOW(), NOW()),
  (12, 'Sao Paulo Store', 'store', -23.5505, -46.6333, 6000, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to avoid conflicts with future inserts
SELECT setval('nodes_id_seq', (SELECT COALESCE(MAX(id), 0) FROM nodes) + 1, false);

-- ===================== PRODUCTS =====================
INSERT INTO products (id, name, description, unit_price, weight, sku, status, created_at, updated_at)
VALUES
  (1, 'Laptop Pro 15"', 'High-performance laptop with 16GB RAM', 1299.99, 2.1, 'ELEC-LP15-001', 'active', NOW(), NOW()),
  (2, 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 29.99, 0.1, 'ELEC-WM-002', 'active', NOW(), NOW()),
  (3, 'USB-C Hub', '7-in-1 USB-C hub with HDMI output', 49.99, 0.15, 'ELEC-HUB-003', 'active', NOW(), NOW()),
  (4, 'Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 89.99, 0.9, 'ELEC-KB-004', 'active', NOW(), NOW()),
  (5, '27" Monitor', '4K IPS monitor with HDR support', 449.99, 5.5, 'ELEC-MON-005', 'active', NOW(), NOW()),
  (6, 'Webcam HD', '1080p webcam with built-in microphone', 59.99, 0.2, 'ELEC-WC-006', 'active', NOW(), NOW()),
  (7, 'Portable SSD 1TB', 'External SSD with USB 3.2 interface', 109.99, 0.05, 'STOR-SSD-007', 'active', NOW(), NOW()),
  (8, 'Noise-Canceling Headphones', 'Over-ear wireless headphones with ANC', 199.99, 0.3, 'AUDIO-HP-008', 'active', NOW(), NOW()),
  (9, 'Tablet 10"', '10-inch tablet with stylus support', 399.99, 0.5, 'ELEC-TAB-009', 'active', NOW(), NOW()),
  (10, 'Smartphone Case', 'Shockproof phone case, universal fit', 19.99, 0.05, 'ACC-CASE-010', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 0) FROM products) + 1, false);

-- ===================== CONNECTIONS (Routes) =====================
INSERT INTO connections (id, source_id, target_id, transportation_type, distance, travel_time, cost_per_unit, status, created_at, updated_at)
VALUES
  (1, 1, 3, 'ship', 10500, 360, 2.50, 'active', NOW(), NOW()),
  (2, 2, 3, 'ship', 11200, 384, 2.75, 'active', NOW(), NOW()),
  (3, 3, 4, 'truck', 2800, 30, 1.20, 'active', NOW(), NOW()),
  (4, 3, 8, 'truck', 1800, 20, 1.00, 'active', NOW(), NOW()),
  (5, 4, 5, 'train', 1270, 18, 0.80, 'active', NOW(), NOW()),
  (6, 4, 7, 'truck', 1450, 14, 0.95, 'active', NOW(), NOW()),
  (7, 5, 6, 'truck', 2050, 20, 1.10, 'active', NOW(), NOW()),
  (8, 1, 10, 'ship', 1800, 72, 1.80, 'active', NOW(), NOW()),
  (9, 1, 9, 'ship', 9500, 480, 3.00, 'active', NOW(), NOW()),
  (10, 11, 9, 'ship', 7200, 336, 2.60, 'active', NOW(), NOW()),
  (11, 9, 12, 'ship', 9400, 408, 3.20, 'active', NOW(), NOW()),
  (12, 11, 3, 'ship', 14500, 504, 3.50, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval('connections_id_seq', (SELECT COALESCE(MAX(id), 0) FROM connections) + 1, false);

-- ===================== INVENTORY =====================
INSERT INTO inventory (id, node_id, product_id, quantity, min_threshold, max_threshold, created_at, updated_at)
VALUES
  (1, 1, 1, 5000, 1000, 10000, NOW(), NOW()),
  (2, 1, 5, 3000, 500, 6000, NOW(), NOW()),
  (3, 1, 9, 4000, 800, 8000, NOW(), NOW()),
  (4, 2, 2, 15000, 3000, 30000, NOW(), NOW()),
  (5, 2, 3, 10000, 2000, 20000, NOW(), NOW()),
  (6, 2, 4, 8000, 1500, 15000, NOW(), NOW()),
  (7, 3, 1, 2000, 500, 5000, NOW(), NOW()),
  (8, 3, 2, 6000, 1000, 12000, NOW(), NOW()),
  (9, 3, 5, 1500, 300, 3000, NOW(), NOW()),
  (10, 4, 1, 800, 200, 2000, NOW(), NOW()),
  (11, 4, 4, 2500, 500, 5000, NOW(), NOW()),
  (12, 4, 7, 3000, 600, 6000, NOW(), NOW()),
  (13, 5, 8, 1200, 200, 2500, NOW(), NOW()),
  (14, 5, 6, 2000, 400, 4000, NOW(), NOW()),
  (15, 6, 1, 150, 50, 500, NOW(), NOW()),
  (16, 6, 10, 3000, 500, 6000, NOW(), NOW()),
  (17, 7, 2, 800, 200, 2000, NOW(), NOW()),
  (18, 7, 3, 600, 100, 1500, NOW(), NOW()),
  (19, 8, 7, 400, 100, 1000, NOW(), NOW()),
  (20, 8, 8, 300, 50, 800, NOW(), NOW()),
  (21, 9, 1, 1000, 200, 3000, NOW(), NOW()),
  (22, 9, 9, 800, 150, 2000, NOW(), NOW()),
  (23, 10, 5, 600, 100, 1500, NOW(), NOW()),
  (24, 10, 4, 1200, 250, 3000, NOW(), NOW()),
  (25, 11, 2, 12000, 2000, 25000, NOW(), NOW()),
  (26, 11, 6, 9000, 1500, 18000, NOW(), NOW()),
  (27, 11, 10, 20000, 4000, 40000, NOW(), NOW()),
  (28, 12, 1, 100, 30, 300, NOW(), NOW()),
  (29, 12, 8, 200, 50, 500, NOW(), NOW()),
  (30, 12, 10, 1500, 300, 4000, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval('inventory_id_seq', (SELECT COALESCE(MAX(id), 0) FROM inventory) + 1, false);

-- ===================== SHIPMENTS =====================
INSERT INTO shipments (id, source_id, destination_id, status, departure_date, estimated_arrival, actual_arrival, created_at, updated_at)
VALUES
  (1, 1, 3, 'delivered', '2026-01-05', '2026-01-20', '2026-01-19', NOW(), NOW()),
  (2, 2, 3, 'in_transit', '2026-02-01', '2026-02-17', NULL, NOW(), NOW()),
  (3, 3, 4, 'in_transit', '2026-02-08', '2026-02-10', NULL, NOW(), NOW()),
  (4, 4, 5, 'pending', '2026-02-15', '2026-02-16', NULL, NOW(), NOW()),
  (5, 5, 6, 'pending', '2026-02-18', '2026-02-20', NULL, NOW(), NOW()),
  (6, 1, 10, 'delivered', '2026-01-10', '2026-01-13', '2026-01-13', NOW(), NOW()),
  (7, 11, 9, 'in_transit', '2026-01-28', '2026-02-11', NULL, NOW(), NOW()),
  (8, 3, 8, 'delayed', '2026-02-03', '2026-02-04', NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval('shipments_id_seq', (SELECT COALESCE(MAX(id), 0) FROM shipments) + 1, false);
