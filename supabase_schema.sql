-- ============================================================================
-- SEROFAST HYPERLOCAL MARKETPLACE - OFFICIAL PRODUCTION DATABASE SCHEMA
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  group_name text NOT NULL DEFAULT 'all'::text,
  image_url text,
  items_count text DEFAULT '0 items'::text,
  bg_color text DEFAULT '#EFF6FF'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
-- 2. SHOP OWNERS TABLE
CREATE TABLE IF NOT EXISTS public.shop_owners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  category text NOT NULL DEFAULT 'Fashion'::text,
  role text NOT NULL DEFAULT 'shop_owner'::text,
  upi_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_owners_pkey PRIMARY KEY (id)
);
-- 3. SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  address text,
  cover_url text,
  avatar_url text,
  category_id text DEFAULT 'fashion'::text,
  rating numeric DEFAULT 4.8,
  created_at timestamp with time zone DEFAULT now(),
  owner_id uuid,
  CONSTRAINT shops_pkey PRIMARY KEY (id),
  CONSTRAINT shops_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.shop_owners(id)
);
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS address text;
-- 4. WAREHOUSE PRODUCTS TABLE (Admin Catalog)
CREATE TABLE IF NOT EXISTS public.warehouse_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  base_price numeric NOT NULL DEFAULT 0,
  retail_price numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  description text,
  warehouse_stock integer DEFAULT 100,
  sku text,
  CONSTRAINT warehouse_products_pkey PRIMARY KEY (id)
);
-- 5. SHOP PRODUCTS TABLE (Junction Mapping Table)
CREATE TABLE IF NOT EXISTS public.shop_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  added_at timestamp with time zone DEFAULT now(),
  shop_id uuid,
  warehouse_product_id uuid,
  selling_price numeric,
  allocated_stock integer DEFAULT 10,
  is_active boolean DEFAULT true,
  CONSTRAINT shop_products_pkey PRIMARY KEY (id),
  CONSTRAINT shop_products_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id),
  CONSTRAINT shop_products_warehouse_product_id_fkey FOREIGN KEY (warehouse_product_id) REFERENCES public.warehouse_products(id)
);
-- 7. PROFILES TABLE (Students / Customers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id text NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'student'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id text,
  total_amount numeric NOT NULL,
  subtotal numeric NOT NULL,
  discount_amount numeric DEFAULT 0.00,
  delivery_fee numeric DEFAULT 0.00,
  order_status text NOT NULL DEFAULT 'PENDING'::text,
  payment_method text NOT NULL DEFAULT 'COD'::text,
  payment_status text NOT NULL DEFAULT 'PENDING'::text,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  tracking_number text,
  estimated_delivery timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  shop_id uuid,
  customer_phone text,
  address text,
  status text DEFAULT 'Pending'::text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);
-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid,
  product_title text NOT NULL,
  product_image text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  size text,
  color text,
  created_at timestamp with time zone DEFAULT now(),
  shop_product_id uuid,
  price_at_purchase numeric DEFAULT 0,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_items_shop_product_id_fkey FOREIGN KEY (shop_product_id) REFERENCES public.shop_products(id)
);
-- 10. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  product_id uuid,
  shop_id uuid,
  quantity integer NOT NULL DEFAULT 1,
  selected_size text,
  selected_color text,
  unit_price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT cart_items_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);
-- 11. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wishlists_pkey PRIMARY KEY (id),
  CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  product_id uuid,
  shop_id uuid,
  rating integer NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
  ),
  review_text text,
  images text [] DEFAULT '{}'::text [],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT reviews_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);
-- 13. USER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  address_type text DEFAULT 'HOME'::text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_addresses_pkey PRIMARY KEY (id),
  CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
-- 14. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  badge_text text NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  gradient_colors text [] DEFAULT '{}'::text [],
  accent_color1 text,
  accent_color2 text,
  target_route text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT banners_pkey PRIMARY KEY (id)
);
-- 15. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'FLAT'::text,
  discount_value numeric NOT NULL,
  min_order_value numeric DEFAULT 0.00,
  is_active boolean DEFAULT true,
  valid_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.shop_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read warehouse_products" ON public.warehouse_products;
DROP POLICY IF EXISTS "Allow public read shops" ON public.shops;
DROP POLICY IF EXISTS "Allow public read shop_products" ON public.shop_products;
DROP POLICY IF EXISTS "Allow full access shop_owners" ON public.shop_owners;
DROP POLICY IF EXISTS "Allow full access shops" ON public.shops;
DROP POLICY IF EXISTS "Allow full access orders" ON public.orders;
CREATE POLICY "Allow public read warehouse_products" ON public.warehouse_products FOR
SELECT USING (true);
CREATE POLICY "Allow public read shops" ON public.shops FOR
SELECT USING (true);
CREATE POLICY "Allow public read shop_products" ON public.shop_products FOR
SELECT USING (true);
CREATE POLICY "Allow full access shop_owners" ON public.shop_owners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access shops" ON public.shops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
-- SUPABASE STORAGE BUCKET FOR SHOP ASSETS (LOGOS & COVERS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-assets', 'shop-assets', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public Storage Read shop-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Upload shop-assets" ON storage.objects;
CREATE POLICY "Public Storage Read shop-assets" ON storage.objects FOR
SELECT USING (bucket_id = 'shop-assets');
CREATE POLICY "Public Storage Upload shop-assets" ON storage.objects FOR
INSERT WITH CHECK (bucket_id = 'shop-assets');