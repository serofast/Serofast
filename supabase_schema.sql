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
  email text NOT NULL,
  phone text NOT NULL,
  category text NOT NULL DEFAULT 'Fashion'::text,
  role text NOT NULL DEFAULT 'shop_owner'::text,
  upi_id text,
  user_id uuid NULL,
  is_shop_created boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shop_owners_pkey PRIMARY KEY (id),
  CONSTRAINT shop_owners_email_key UNIQUE (email),
  CONSTRAINT shop_owners_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS shop_owners_user_id_unique ON public.shop_owners (user_id) WHERE (user_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS shop_owners_user_id_idx ON public.shop_owners (user_id);

-- 3. SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_id text NULL,
  name text NOT NULL,
  tagline text NULL,
  description text NULL,
  address text NOT NULL,
  cover_url text NULL,
  avatar_url text NULL,
  category_id text NULL DEFAULT 'fashion'::text,
  rating numeric(3, 2) NULL DEFAULT 4.8,
  owner_id uuid NULL,
  owner_name text NULL,
  owner_email text NULL,
  owner_phone text NULL,
  status text NOT NULL DEFAULT 'active'::text,
  setup_progress integer NOT NULL DEFAULT 100,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT shops_pkey PRIMARY KEY (id),
  CONSTRAINT shops_shop_id_key UNIQUE (shop_id),
  CONSTRAINT shops_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.shop_owners (id) ON DELETE CASCADE,
  CONSTRAINT shops_owner_email_key UNIQUE (owner_email),
  CONSTRAINT shops_setup_progress_check CHECK (setup_progress >= 0 AND setup_progress <= 100),
  CONSTRAINT shops_status_check CHECK (status = ANY (ARRAY['draft'::text, 'pending_review'::text, 'active'::text, 'suspended'::text, 'rejected'::text, 'closed'::text]))
);

CREATE UNIQUE INDEX IF NOT EXISTS shops_owner_email_unique ON public.shops (lower(trim(owner_email))) WHERE (owner_email IS NOT NULL AND owner_email <> '');
CREATE UNIQUE INDEX IF NOT EXISTS shops_owner_id_unique ON public.shops (owner_id) WHERE (owner_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS shops_owner_id_idx ON public.shops USING btree (owner_id);
CREATE INDEX IF NOT EXISTS shops_status_idx ON public.shops USING btree (status);
-- 4. WAREHOUSE PRODUCTS TABLE (Admin Catalog)
CREATE TABLE IF NOT EXISTS public.warehouse_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  base_price numeric(10, 2) NOT NULL DEFAULT 0,
  retail_price numeric(10, 2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT ''::text,
  images jsonb DEFAULT '[]'::jsonb,
  sections text[] DEFAULT ARRAY['Explore Products']::text[],
  material text NULL,
  fit text NULL,
  care text NULL,
  sizes text[] DEFAULT ARRAY[]::text[],
  description text NULL,
  warehouse_stock integer DEFAULT 1,
  sku text NULL,
  status text NOT NULL DEFAULT 'active'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
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
-- 13. NOTIFICATIONS TABLE (Multi-tenant Role-Based Real-time Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_role text NOT NULL DEFAULT 'shop_owner'::text, -- 'shop_owner', 'user', 'admin'
  recipient_id text,                                      -- specific user/owner ID or email, NULL = broadcast to all in role
  shop_id uuid,                                           -- associated shop id if applicable
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system'::text,              -- 'order', 'payout', 'promoter', 'system', 'alert'
  is_read boolean NOT NULL DEFAULT false,
  action_link text,
  action_label text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE,
  CONSTRAINT notifications_recipient_role_check CHECK (recipient_role = ANY (ARRAY['shop_owner'::text, 'user'::text, 'admin'::text]))
);

CREATE INDEX IF NOT EXISTS notifications_recipient_role_idx ON public.notifications (recipient_role);
CREATE INDEX IF NOT EXISTS notifications_recipient_id_idx ON public.notifications (recipient_id);
CREATE INDEX IF NOT EXISTS notifications_shop_id_idx ON public.notifications (shop_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications (created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.shop_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read warehouse_products" ON public.warehouse_products;
DROP POLICY IF EXISTS "Allow public read shops" ON public.shops;
DROP POLICY IF EXISTS "Allow public read shop_products" ON public.shop_products;
DROP POLICY IF EXISTS "Allow full access shop_owners" ON public.shop_owners;
DROP POLICY IF EXISTS "Allow full access shops" ON public.shops;
DROP POLICY IF EXISTS "Allow full access orders" ON public.orders;
DROP POLICY IF EXISTS "Allow full access notifications" ON public.notifications;

CREATE POLICY "Allow public read warehouse_products" ON public.warehouse_products FOR
SELECT USING (true);
CREATE POLICY "Allow public read shops" ON public.shops FOR
SELECT USING (true);
CREATE POLICY "Allow public read shop_products" ON public.shop_products FOR
SELECT USING (true);
CREATE POLICY "Allow full access shop_owners" ON public.shop_owners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access shops" ON public.shops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.notifications TO anon, authenticated, service_role;

-- SUPABASE STORAGE BUCKET FOR SHOP ASSETS (LOGOS & COVERS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-assets', 'shop-assets', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public Storage Read shop-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Upload shop-assets" ON storage.objects;
CREATE POLICY "Public Storage Read shop-assets" ON storage.objects FOR
SELECT USING (bucket_id = 'shop-assets');
CREATE POLICY "Public Storage Upload shop-assets" ON storage.objects FOR
INSERT WITH CHECK (bucket_id = 'shop-assets');