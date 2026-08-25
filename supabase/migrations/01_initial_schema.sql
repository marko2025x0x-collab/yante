-- ==============================================================================
-- YANTI TITANIUM DATABASE SCHEMA (Supabase / PostgreSQL)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. КАТЕГОРІЇ
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ТОВАРИ
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    images TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    material TEXT NOT NULL DEFAULT 'Implant Grade Titanium ASTM F-136',
    thread_type TEXT DEFAULT 'Threadless (Безрізьбовий)',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. РОЗМІРНІ ВАРІАНТИ (GAUGE & LENGTH)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    gauge TEXT NOT NULL,
    length_or_diameter TEXT NOT NULL,
    price_adjustment NUMERIC(10, 2) DEFAULT 0,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ОПЦІЇ АНОДУВАННЯ (КОЛЬОРИ)
CREATE TABLE IF NOT EXISTS anodization_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    voltage TEXT,
    hex_code TEXT NOT NULL,
    price_extra NUMERIC(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

-- 5. ТАБЛИЦЯ ЗАМОВЛЕНЬ (ORDERS)
DO $$ BEGIN
    CREATE TYPE delivery_type_enum AS ENUM ('nova_poshta_warehouse', 'nova_poshta_courier');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('card', 'cod', 'iban');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM ('new', 'processing', 'shipped', 'completed', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number BIGSERIAL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_type delivery_type_enum NOT NULL DEFAULT 'nova_poshta_warehouse',
    delivery_city TEXT NOT NULL,
    delivery_warehouse TEXT NOT NULL,
    payment_method payment_method_enum NOT NULL DEFAULT 'cod',
    payment_status payment_status_enum NOT NULL DEFAULT 'pending',
    order_status order_status_enum NOT NULL DEFAULT 'new',
    subtotal_amount NUMERIC(10, 2) NOT NULL,
    sterilization_total NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ПОЗИЦІЇ ЗАМОВЛЕННЯ (ORDER ITEMS)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    selected_gauge TEXT NOT NULL,
    selected_size TEXT NOT NULL,
    selected_color TEXT NOT NULL,
    is_sterilized BOOLEAN NOT NULL DEFAULT false,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- ІНДЕКСИ
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ПОЧАТКОВІ КАТЕГОРІЇ
INSERT INTO categories (name, slug, sort_order) VALUES
('Лабрети', 'labrets', 1),
('Клікери та Кільця', 'clickers', 2),
('Банани', 'curved-barbells', 3),
('Штанги', 'straight-barbells', 4),
('Накрутки та Топи', 'tops-and-ends', 5)
ON CONFLICT (slug) DO NOTHING;

-- ПОЧАТКОВІ ОПЦІЇ АНОДУВАННЯ
INSERT INTO anodization_options (name, voltage, hex_code, price_extra, sort_order) VALUES
('High Polish Silver', '0V', '#E2E8F0', 0, 1),
('Gold 65V', '65V', '#E5B842', 0, 2),
('Rose Gold', '60V', '#DDA096', 0, 3),
('Ice Blue', '25V', '#7BC4E8', 0, 4),
('Deep Purple', '85V', '#8A4F9E', 0, 5),
('Dark Bronze', '15V', '#966B4A', 0, 6)
ON CONFLICT DO NOTHING;

-- RLS POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE anodization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read for variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read for anodization" ON anodization_options FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public insert for orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for order items" ON order_items FOR INSERT WITH CHECK (true);
