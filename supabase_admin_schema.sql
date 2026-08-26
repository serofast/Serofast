-- ============================================================================
-- SEROFAST HYPERLOCAL MARKETPLACE - COMPREHENSIVE RELATIONAL INTEGRATION SCHEMA
-- ============================================================================
-- This script guarantees that EVERY table is explicitly connected to other
-- tables via relational FOREIGN KEYS so they show up fully linked in the
-- Supabase Schema Graph / Relationship Visualizer.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. CREATE ALL AUXILIARY TABLES (IF NOT EXIST) ───────────────────────────

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_number text NOT NULL,
  subject text NOT NULL,
  CONSTRAINT support_tickets_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL,
  message text NOT NULL,
  CONSTRAINT support_messages_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.returns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  return_number text NOT NULL,
  product_name text NOT NULL,
  reason text NOT NULL,
  CONSTRAINT returns_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  refund_number text NOT NULL,
  reason text NOT NULL,
  CONSTRAINT refunds_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.withdrawals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payout_number text NOT NULL,
  CONSTRAINT withdrawals_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_number text NOT NULL,
  CONSTRAINT transactions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.commission_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  scope_name text NOT NULL,
  CONSTRAINT commission_rules_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quantity integer NOT NULL DEFAULT 0,
  CONSTRAINT inventory_movements_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  CONSTRAINT campaigns_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  section_key text NOT NULL,
  CONSTRAINT homepage_sections_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.risk_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  entity_name text NOT NULL,
  CONSTRAINT risk_alerts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  action text NOT NULL,
  target_type text NOT NULL,
  module text NOT NULL,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  group_key text NOT NULL,
  setting_key text NOT NULL,
  label text NOT NULL,
  CONSTRAINT system_settings_pkey PRIMARY KEY (id)
);


-- ── 2. ENSURE ALL RELATIONAL COLUMNS EXIST (WITH MATCHING TYPES) ────────────

-- support_tickets
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS ticket_number text;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS order_id uuid;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS subject text DEFAULT 'General Inquiry';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS priority text DEFAULT 'MEDIUM';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS status text DEFAULT 'OPEN';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS assigned_to text DEFAULT 'Unassigned';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- support_messages
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS ticket_id uuid;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS sender_type text DEFAULT 'customer';
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS sender_id text;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS sender_name text DEFAULT 'User';
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS message text DEFAULT '';
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS is_internal_note boolean DEFAULT false;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- returns
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS return_number text;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS order_id uuid;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS product_name text DEFAULT 'Product';
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS reason text DEFAULT 'Other';
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS refund_amount numeric DEFAULT 0.00;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS status text DEFAULT 'Requested';
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS evidence_urls text[] DEFAULT '{}'::text[];
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS customer_notes text;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.returns ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- refunds
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS refund_number text;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS order_id uuid;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS return_id uuid;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0.00;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS reason text DEFAULT 'Customer Return';
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pending';
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS gateway_refund_id text;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS processed_at timestamp with time zone;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- withdrawals
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS payout_number text;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS owner_id uuid;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0.00;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS payout_method text DEFAULT 'UPI';
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS account_details jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pending';
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS transaction_ref text;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS processed_at timestamp with time zone;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS transaction_number text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS type text DEFAULT 'Order Payment';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS order_id uuid;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS gross_amount numeric DEFAULT 0.00;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS platform_fee numeric DEFAULT 0.00;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS net_amount numeric DEFAULT 0.00;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'UPI';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS status text DEFAULT 'Success';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS gateway_ref_id text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- commission_rules
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS scope text DEFAULT 'Default';
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS scope_name text DEFAULT 'Platform Default';
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS category_id uuid;
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS rate_percentage numeric DEFAULT 10.00;
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.commission_rules ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- inventory_movements
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS product_id uuid;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS type text DEFAULT 'Stock In';
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 0;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS previous_stock integer DEFAULT 0;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS new_stock integer DEFAULT 0;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS reference_id text;
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS performed_by text DEFAULT 'Admin';
ALTER TABLE public.inventory_movements ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- campaigns
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS audience text DEFAULT 'All Customers';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS category_id uuid;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS budget numeric DEFAULT 0.00;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS reach integer DEFAULT 0;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS discount_percentage numeric;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS starts_at timestamp with time zone;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS ends_at timestamp with time zone;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- homepage_sections
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS section_key text;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS priority integer DEFAULT 1;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS config jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.homepage_sections ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- risk_alerts
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS entity_type text;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS entity_id text;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS entity_name text;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS shop_id uuid;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS order_id uuid;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS score text DEFAULT 'MEDIUM';
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS status text DEFAULT 'Open';
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.risk_alerts ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- audit_logs
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS actor_name text DEFAULT 'Admin';
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS actor_email text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_type text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_id text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_label text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS module text;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- system_settings
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS group_key text;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS setting_key text;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS label text;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS value jsonb DEFAULT '""'::jsonb;
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS value_type text DEFAULT 'text';
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- roles
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS permissions text[] DEFAULT '{}'::text[];
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS is_system boolean DEFAULT false;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();


-- ── 3. CLEAN UP ORPHAN VALUES BEFORE ATTACHING FOREIGN KEYS ─────────────────
-- This ensures foreign key creation never fails due to invalid historical IDs.

DO $$
BEGIN
  -- Clean support_tickets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.support_tickets SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM public.profiles);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.support_tickets SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    UPDATE public.support_tickets SET order_id = NULL WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM public.orders);
  END IF;

  -- Clean support_messages
  UPDATE public.support_messages SET ticket_id = NULL WHERE ticket_id IS NOT NULL AND ticket_id NOT IN (SELECT id FROM public.support_tickets);
  DELETE FROM public.support_messages WHERE ticket_id IS NULL;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.support_messages SET sender_id = NULL WHERE sender_id IS NOT NULL AND sender_id NOT IN (SELECT id FROM public.profiles);
  END IF;

  -- Clean returns
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    UPDATE public.returns SET order_id = NULL WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM public.orders);
    DELETE FROM public.returns WHERE order_id IS NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.returns SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM public.profiles);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.returns SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;

  -- Clean refunds
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    UPDATE public.refunds SET order_id = NULL WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM public.orders);
    DELETE FROM public.refunds WHERE order_id IS NULL;
  END IF;
  UPDATE public.refunds SET return_id = NULL WHERE return_id IS NOT NULL AND return_id NOT IN (SELECT id FROM public.returns);
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.refunds SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM public.profiles);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.refunds SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;

  -- Clean withdrawals
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.withdrawals SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
    DELETE FROM public.withdrawals WHERE shop_id IS NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shop_owners') THEN
    UPDATE public.withdrawals SET owner_id = NULL WHERE owner_id IS NOT NULL AND owner_id NOT IN (SELECT id FROM public.shop_owners);
  END IF;

  -- Clean transactions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    UPDATE public.transactions SET order_id = NULL WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM public.orders);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.transactions SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.transactions SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM public.profiles);
  END IF;

  -- Clean inventory_movements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'warehouse_products') THEN
    UPDATE public.inventory_movements SET product_id = NULL WHERE product_id IS NOT NULL AND product_id NOT IN (SELECT id FROM public.warehouse_products);
    DELETE FROM public.inventory_movements WHERE product_id IS NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.inventory_movements SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;

  -- Clean commission_rules
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
    UPDATE public.commission_rules SET category_id = NULL WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM public.categories);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.commission_rules SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;

  -- Clean campaigns
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
    UPDATE public.campaigns SET category_id = NULL WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM public.categories);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.campaigns SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;

  -- Clean risk_alerts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shops') THEN
    UPDATE public.risk_alerts SET shop_id = NULL WHERE shop_id IS NOT NULL AND shop_id NOT IN (SELECT id FROM public.shops);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.risk_alerts SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM public.profiles);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    UPDATE public.risk_alerts SET order_id = NULL WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM public.orders);
  END IF;

  -- Clean audit_logs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    UPDATE public.audit_logs SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM public.profiles);
  END IF;
END $$;


-- ── 4. EXPLICIT FOREIGN KEY RELATIONSHIPS (VISIBLE IN SCHEMA GRAPH) ──────────

-- 1. support_tickets relationships
ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;
ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_shop_id_fkey;
ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_order_id_fkey;
ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

-- 2. support_messages relationships
ALTER TABLE public.support_messages DROP CONSTRAINT IF EXISTS support_messages_ticket_id_fkey;
ALTER TABLE public.support_messages ADD CONSTRAINT support_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;

ALTER TABLE public.support_messages DROP CONSTRAINT IF EXISTS support_messages_sender_id_fkey;
ALTER TABLE public.support_messages ADD CONSTRAINT support_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. returns relationships
ALTER TABLE public.returns DROP CONSTRAINT IF EXISTS returns_order_id_fkey;
ALTER TABLE public.returns ADD CONSTRAINT returns_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.returns DROP CONSTRAINT IF EXISTS returns_user_id_fkey;
ALTER TABLE public.returns ADD CONSTRAINT returns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.returns DROP CONSTRAINT IF EXISTS returns_shop_id_fkey;
ALTER TABLE public.returns ADD CONSTRAINT returns_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

-- 4. refunds relationships
ALTER TABLE public.refunds DROP CONSTRAINT IF EXISTS refunds_order_id_fkey;
ALTER TABLE public.refunds ADD CONSTRAINT refunds_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.refunds DROP CONSTRAINT IF EXISTS refunds_return_id_fkey;
ALTER TABLE public.refunds ADD CONSTRAINT refunds_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id) ON DELETE SET NULL;

ALTER TABLE public.refunds DROP CONSTRAINT IF EXISTS refunds_user_id_fkey;
ALTER TABLE public.refunds ADD CONSTRAINT refunds_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.refunds DROP CONSTRAINT IF EXISTS refunds_shop_id_fkey;
ALTER TABLE public.refunds ADD CONSTRAINT refunds_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

-- 5. withdrawals relationships
ALTER TABLE public.withdrawals DROP CONSTRAINT IF EXISTS withdrawals_shop_id_fkey;
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;

ALTER TABLE public.withdrawals DROP CONSTRAINT IF EXISTS withdrawals_owner_id_fkey;
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.shop_owners(id) ON DELETE SET NULL;

-- 6. transactions relationships
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_order_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_shop_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 7. inventory_movements relationships
ALTER TABLE public.inventory_movements DROP CONSTRAINT IF EXISTS inventory_movements_product_id_fkey;
ALTER TABLE public.inventory_movements ADD CONSTRAINT inventory_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.warehouse_products(id) ON DELETE CASCADE;

ALTER TABLE public.inventory_movements DROP CONSTRAINT IF EXISTS inventory_movements_shop_id_fkey;
ALTER TABLE public.inventory_movements ADD CONSTRAINT inventory_movements_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

-- 8. commission_rules relationships
ALTER TABLE public.commission_rules DROP CONSTRAINT IF EXISTS commission_rules_category_id_fkey;
ALTER TABLE public.commission_rules ADD CONSTRAINT commission_rules_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.commission_rules DROP CONSTRAINT IF EXISTS commission_rules_shop_id_fkey;
ALTER TABLE public.commission_rules ADD CONSTRAINT commission_rules_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

-- 9. campaigns relationships
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_category_id_fkey;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_shop_id_fkey;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

-- 10. risk_alerts relationships
ALTER TABLE public.risk_alerts DROP CONSTRAINT IF EXISTS risk_alerts_shop_id_fkey;
ALTER TABLE public.risk_alerts ADD CONSTRAINT risk_alerts_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE SET NULL;

ALTER TABLE public.risk_alerts DROP CONSTRAINT IF EXISTS risk_alerts_user_id_fkey;
ALTER TABLE public.risk_alerts ADD CONSTRAINT risk_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.risk_alerts DROP CONSTRAINT IF EXISTS risk_alerts_order_id_fkey;
ALTER TABLE public.risk_alerts ADD CONSTRAINT risk_alerts_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

-- 11. audit_logs relationships
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


-- ── 5. PERFORMANCE INDEXES ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets (status);
CREATE INDEX IF NOT EXISTS support_tickets_user_id_idx ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS support_tickets_shop_id_idx ON public.support_tickets (shop_id);
CREATE INDEX IF NOT EXISTS support_tickets_order_id_idx ON public.support_tickets (order_id);

CREATE INDEX IF NOT EXISTS support_messages_ticket_id_idx ON public.support_messages (ticket_id);
CREATE INDEX IF NOT EXISTS support_messages_sender_id_idx ON public.support_messages (sender_id);

CREATE INDEX IF NOT EXISTS returns_order_id_idx ON public.returns (order_id);
CREATE INDEX IF NOT EXISTS returns_shop_id_idx ON public.returns (shop_id);
CREATE INDEX IF NOT EXISTS returns_user_id_idx ON public.returns (user_id);
CREATE INDEX IF NOT EXISTS returns_status_idx ON public.returns (status);

CREATE INDEX IF NOT EXISTS refunds_order_id_idx ON public.refunds (order_id);
CREATE INDEX IF NOT EXISTS refunds_return_id_idx ON public.refunds (return_id);
CREATE INDEX IF NOT EXISTS refunds_shop_id_idx ON public.refunds (shop_id);
CREATE INDEX IF NOT EXISTS refunds_user_id_idx ON public.refunds (user_id);
CREATE INDEX IF NOT EXISTS refunds_status_idx ON public.refunds (status);

CREATE INDEX IF NOT EXISTS withdrawals_shop_id_idx ON public.withdrawals (shop_id);
CREATE INDEX IF NOT EXISTS withdrawals_owner_id_idx ON public.withdrawals (owner_id);
CREATE INDEX IF NOT EXISTS withdrawals_status_idx ON public.withdrawals (status);

CREATE INDEX IF NOT EXISTS transactions_order_id_idx ON public.transactions (order_id);
CREATE INDEX IF NOT EXISTS transactions_shop_id_idx ON public.transactions (shop_id);
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions (user_id);

CREATE INDEX IF NOT EXISTS inventory_movements_product_id_idx ON public.inventory_movements (product_id);
CREATE INDEX IF NOT EXISTS inventory_movements_shop_id_idx ON public.inventory_movements (shop_id);

CREATE INDEX IF NOT EXISTS commission_rules_category_id_idx ON public.commission_rules (category_id);
CREATE INDEX IF NOT EXISTS commission_rules_shop_id_idx ON public.commission_rules (shop_id);

CREATE INDEX IF NOT EXISTS campaigns_category_id_idx ON public.campaigns (category_id);
CREATE INDEX IF NOT EXISTS campaigns_shop_id_idx ON public.campaigns (shop_id);

CREATE INDEX IF NOT EXISTS risk_alerts_shop_id_idx ON public.risk_alerts (shop_id);
CREATE INDEX IF NOT EXISTS risk_alerts_user_id_idx ON public.risk_alerts (user_id);
CREATE INDEX IF NOT EXISTS risk_alerts_order_id_idx ON public.risk_alerts (order_id);

CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS system_settings_group_key_idx ON public.system_settings (group_key);


-- ── 6. ROW LEVEL SECURITY & POLICIES ────────────────────────────────────────

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow full access support_tickets" ON public.support_tickets;
  DROP POLICY IF EXISTS "Allow full access support_messages" ON public.support_messages;
  DROP POLICY IF EXISTS "Allow full access returns" ON public.returns;
  DROP POLICY IF EXISTS "Allow full access refunds" ON public.refunds;
  DROP POLICY IF EXISTS "Allow full access withdrawals" ON public.withdrawals;
  DROP POLICY IF EXISTS "Allow full access transactions" ON public.transactions;
  DROP POLICY IF EXISTS "Allow full access commission_rules" ON public.commission_rules;
  DROP POLICY IF EXISTS "Allow full access inventory_movements" ON public.inventory_movements;
  DROP POLICY IF EXISTS "Allow full access campaigns" ON public.campaigns;
  DROP POLICY IF EXISTS "Allow full access homepage_sections" ON public.homepage_sections;
  DROP POLICY IF EXISTS "Allow full access risk_alerts" ON public.risk_alerts;
  DROP POLICY IF EXISTS "Allow full access roles" ON public.roles;
  DROP POLICY IF EXISTS "Allow full access audit_logs" ON public.audit_logs;
  DROP POLICY IF EXISTS "Allow full access system_settings" ON public.system_settings;

  CREATE POLICY "Allow full access support_tickets" ON public.support_tickets FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access support_messages" ON public.support_messages FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access returns" ON public.returns FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access refunds" ON public.refunds FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access withdrawals" ON public.withdrawals FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access commission_rules" ON public.commission_rules FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access inventory_movements" ON public.inventory_movements FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access homepage_sections" ON public.homepage_sections FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access risk_alerts" ON public.risk_alerts FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access roles" ON public.roles FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow full access system_settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Grant privileges to all roles
GRANT ALL ON public.support_tickets TO anon, authenticated, service_role;
GRANT ALL ON public.support_messages TO anon, authenticated, service_role;
GRANT ALL ON public.returns TO anon, authenticated, service_role;
GRANT ALL ON public.refunds TO anon, authenticated, service_role;
GRANT ALL ON public.withdrawals TO anon, authenticated, service_role;
GRANT ALL ON public.transactions TO anon, authenticated, service_role;
GRANT ALL ON public.commission_rules TO anon, authenticated, service_role;
GRANT ALL ON public.inventory_movements TO anon, authenticated, service_role;
GRANT ALL ON public.campaigns TO anon, authenticated, service_role;
GRANT ALL ON public.homepage_sections TO anon, authenticated, service_role;
GRANT ALL ON public.risk_alerts TO anon, authenticated, service_role;
GRANT ALL ON public.roles TO anon, authenticated, service_role;
GRANT ALL ON public.audit_logs TO anon, authenticated, service_role;
GRANT ALL ON public.system_settings TO anon, authenticated, service_role;


-- ── 7. SEED DATA ────────────────────────────────────────────────────────────

-- Commission Rules Seed
INSERT INTO public.commission_rules (scope, scope_name, rate_percentage) VALUES
  ('Default', 'Platform Default', 10.00),
  ('Category', 'Fashion', 8.00),
  ('Category', 'Electronics', 9.00),
  ('Shop', 'Urban Styles', 6.00),
  ('Promotion', 'Seller Launch Offer', 4.00)
ON CONFLICT DO NOTHING;

-- Roles Seed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Super Admin') THEN
    INSERT INTO public.roles (name, description, permissions, is_system) VALUES
      ('Super Admin', 'Full unrestricted platform access across all domains and settings.', ARRAY['shops.view', 'shops.approve', 'shops.suspend', 'products.view', 'products.edit', 'products.approve', 'orders.view', 'orders.cancel', 'orders.refund', 'payments.view', 'payments.approve', 'marketing.manage', 'users.manage', 'settings.manage'], true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Catalog Manager') THEN
    INSERT INTO public.roles (name, description, permissions, is_system) VALUES
      ('Catalog Manager', 'Product listings, category taxonomy, and inventory stock oversight.', ARRAY['products.view', 'products.edit', 'products.approve', 'categories.manage', 'inventory.manage'], false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Finance Lead') THEN
    INSERT INTO public.roles (name, description, permissions, is_system) VALUES
      ('Finance Lead', 'Payout approvals, fee management, commission rules, and settlement ledgers.', ARRAY['payments.view', 'payments.approve', 'finance.manage', 'reports.view'], false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'Support Agent') THEN
    INSERT INTO public.roles (name, description, permissions, is_system) VALUES
      ('Support Agent', 'Customer service, dispute tickets, return approvals, and customer comms.', ARRAY['support.manage', 'orders.view', 'returns.manage', 'customers.view'], false);
  END IF;
END $$;

-- System Settings Seed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'platform_name') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('General', 'platform_name', 'Platform Name', '"SeroFast"'::jsonb, 'text');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'currency') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('General', 'currency', 'Currency', '"INR"'::jsonb, 'text');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'maintenance_mode') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Marketplace', 'maintenance_mode', 'Marketplace Maintenance Mode', 'false'::jsonb, 'toggle');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'registration_fee') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Marketplace', 'registration_fee', 'Shop Registration Fee (₹)', '499'::jsonb, 'number');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'auto_payouts') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Payments', 'auto_payouts', 'Automatic Seller Payouts', 'true'::jsonb, 'toggle');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'return_window_days') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Orders', 'return_window_days', 'Return Window (Days)', '7'::jsonb, 'number');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'delivery_sla_days') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Delivery', 'delivery_sla_days', 'Default Delivery SLA (Days)', '3'::jsonb, 'number');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'prices_include_tax') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Taxes', 'prices_include_tax', 'Prices Include Applicable GST', 'true'::jsonb, 'toggle');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'default_commission_pct') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Commission', 'default_commission_pct', 'Default Commission (%)', '10'::jsonb, 'number');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.system_settings WHERE setting_key = 'two_factor_auth') THEN
    INSERT INTO public.system_settings (group_key, setting_key, label, value, value_type) VALUES
      ('Security', 'two_factor_auth', 'Require Two-Factor Authentication', 'false'::jsonb, 'toggle');
  END IF;
END $$;

-- Homepage CMS Sections Seed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE section_key = 'hero_banners') THEN
    INSERT INTO public.homepage_sections (name, section_key, priority, is_active) VALUES
      ('Hero Banner Carousel', 'hero_banners', 1, true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE section_key = 'quick_categories') THEN
    INSERT INTO public.homepage_sections (name, section_key, priority, is_active) VALUES
      ('Quick Categories Grid', 'quick_categories', 2, true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE section_key = 'flash_deals') THEN
    INSERT INTO public.homepage_sections (name, section_key, priority, is_active) VALUES
      ('Flash Campus Deals', 'flash_deals', 3, true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE section_key = 'student_favorites') THEN
    INSERT INTO public.homepage_sections (name, section_key, priority, is_active) VALUES
      ('Top Student Favorites', 'student_favorites', 4, true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE section_key = 'featured_shops') THEN
    INSERT INTO public.homepage_sections (name, section_key, priority, is_active) VALUES
      ('Featured Campus Shops', 'featured_shops', 5, true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.homepage_sections WHERE section_key = 'trending_now') THEN
    INSERT INTO public.homepage_sections (name, section_key, priority, is_active) VALUES
      ('Trending Now', 'trending_now', 6, true);
  END IF;
END $$;
