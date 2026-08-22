import { createClient } from "@supabase/supabase-js";

// Read Supabase environment credentials cleanly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://hjmwhsjkoyrkcwxhyedz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "shop-assets";

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// UUID validation helper
const isValidUuid = (str) =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/* ── Helper: File to Base64 / Data URL ───────────────────── */

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file || typeof file === "string") {
      resolve(file || null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/* ── Image Upload (Supabase Storage Bucket) ──────────────── */

export async function uploadShopAsset(file, folder = "logos") {
  if (!file) return null;
  if (typeof file === "string") return file; // already a URL

  if (supabase) {
    try {
      const ext = file.name?.split(".").pop() || "png";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: true });

      if (!error && data) {
        const { data: url } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        if (url?.publicUrl) return url.publicUrl;
      }
    } catch {
      // Graceful fallback to persistent Data URL
    }
  }

  // Persistent Data URL fallback so user's image is preserved
  const dataUrl = await fileToDataUrl(file);
  if (dataUrl) return dataUrl;

  return folder === "logos"
    ? "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80"
    : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";
}

/* ── Shop Owner Registration (Saved to public.shop_owners) ── */

export async function registerShopOwner(ownerData) {
  const email = ownerData.email?.trim() || "";
  const payload = {
    full_name: ownerData.name || ownerData.full_name || "Shop Owner",
    email,
    phone: ownerData.phone || "",
    category: ownerData.category || "Fashion",
    role: "shop_owner",
    updated_at: new Date().toISOString(),
  };

  if (ownerData.id && isValidUuid(ownerData.id)) {
    payload.id = ownerData.id;
  }

  if (supabase && email) {
    try {
      // 1. Check if owner already exists in shop_owners table
      const { data: existing } = await supabase
        .from("shop_owners")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        // Update existing owner profile
        const { data: updated, error: updateError } = await supabase
          .from("shop_owners")
          .update(payload)
          .eq("email", email)
          .select()
          .single();

        if (!updateError && updated) {
          localStorage.setItem("serofast_current_owner", JSON.stringify(updated));
          return updated;
        }
      } else {
        // Insert new owner profile
        const { data: created, error: createError } = await supabase
          .from("shop_owners")
          .insert([payload])
          .select()
          .single();

        if (!createError && created) {
          localStorage.setItem("serofast_current_owner", JSON.stringify(created));
          return created;
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  const fallback = { id: ownerData.id || `owner-${Date.now()}`, ...payload };
  localStorage.setItem("serofast_current_owner", JSON.stringify(fallback));
  return fallback;
}

/* ── Shop Owner Sign In (Fetches from public.shop_owners) ── */

export async function loginShopOwner(credentials) {
  const email = credentials.email?.trim() || "";
  const firebaseUid = credentials.id;

  if (!firebaseUid) {
    throw new Error("Authentication failed: Unverified login request.");
  }

  if (supabase && email) {
    try {
      // 1. Fetch owner details from shop_owners table by email or valid UUID
      let query = supabase.from("shop_owners").select("*");
      if (isValidUuid(firebaseUid)) {
        query = query.or(`email.eq.${email},id.eq.${firebaseUid}`);
      } else {
        query = query.eq("email", email);
      }
      const { data: owner, error: ownerError } = await query.maybeSingle();

      if (!ownerError && owner) {
        localStorage.setItem("serofast_current_owner", JSON.stringify(owner));

        // 2. Check if owner already has a registered shop
        const { data: shop, error: shopError } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", owner.id)
          .maybeSingle();

        if (!shopError && shop) {
          localStorage.setItem("serofast_active_shop", JSON.stringify(shop));
          return { owner, shop };
        }
        return { owner, shop: null };
      }
    } catch {
      // Graceful fallback
    }
  }

  // Local Storage Fallback
  let owner = null;
  let shop = null;
  try {
    const storedOwner = localStorage.getItem("serofast_current_owner");
    if (storedOwner) owner = JSON.parse(storedOwner);
    const storedShop = localStorage.getItem("serofast_active_shop");
    if (storedShop) shop = JSON.parse(storedShop);
  } catch {}

  return { owner, shop };
}

/* ── Fetch Owner Profile ────────────────────────────────── */

export async function fetchOwnerProfile() {
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (supabase && parsed.id && isValidUuid(parsed.id)) {
      const { data } = await supabase
        .from("shop_owners")
        .select("*")
        .eq("id", parsed.id)
        .maybeSingle();

      if (data) {
        localStorage.setItem("serofast_current_owner", JSON.stringify(data));
        return data;
      }
    }
    return parsed;
  } catch {
    // Graceful fallback
  }
  return null;
}

/* ── Fetch Warehouse Products (Admin Catalog) ───────────── */

export async function fetchWarehouseProducts() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("warehouse_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem("serofast_warehouse_products");
    if (stored) return JSON.parse(stored);
  } catch {}

  return [];
}

/* ── Create Shop (Saves ALL details to public.shops) ────── */

export async function createShopInSupabase(shopData) {
  let ownerId = null;
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) ownerId = JSON.parse(stored).id;
  } catch {
    // Graceful fallback
  }

  let avatarUrl = shopData.logo || "";
  let coverUrl = shopData.cover || "";

  if (shopData.logoFile) {
    const uploadedLogo = await uploadShopAsset(shopData.logoFile, "logos");
    if (uploadedLogo) avatarUrl = uploadedLogo;
  }

  if (shopData.coverFile) {
    const uploadedCover = await uploadShopAsset(shopData.coverFile, "covers");
    if (uploadedCover) coverUrl = uploadedCover;
  }

  const id = window.crypto?.randomUUID?.()
    || `shop-${Math.random().toString(36).slice(2, 10)}`;

  // Format shop address (location, city, pincode separated by commas)
  const fullAddress = [shopData.address, shopData.city, shopData.pincode]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .join(", ");

  const payload = {
    id,
    name: shopData.shopName || shopData.name || "My Campus Shop",
    tagline: shopData.tagline || "",
    description: shopData.description || "",
    address: fullAddress,
    cover_url: coverUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    avatar_url: avatarUrl || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80",
    category_id: (shopData.category || "fashion").toLowerCase(),
    rating: 4.8,
    created_at: new Date().toISOString(),
  };

  if (ownerId && isValidUuid(ownerId)) {
    payload.owner_id = ownerId;
  }

  // Update phone, full_name, email in public.shop_owners table
  if (supabase && ownerId && isValidUuid(ownerId)) {
    try {
      const ownerUpdate = { updated_at: new Date().toISOString() };
      if (shopData.phone) ownerUpdate.phone = shopData.phone;
      if (shopData.ownerName) ownerUpdate.full_name = shopData.ownerName;
      if (shopData.email) ownerUpdate.email = shopData.email;

      await supabase
        .from("shop_owners")
        .update(ownerUpdate)
        .eq("id", ownerId);
    } catch {
      // Graceful fallback
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shops")
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem("serofast_active_shop", JSON.stringify(data));

        if (shopData.selectedProducts?.length) {
          await linkProductsToShop(data.id, shopData.selectedProducts);
        }
        return data;
      }
    } catch {
      // Graceful fallback
    }
  }

  localStorage.setItem("serofast_active_shop", JSON.stringify(payload));
  return payload;
}

/* ── Fetch Shop Products for Inventory (Shop Products Junction) ── */

export async function fetchShopProducts(shopId) {
  let list = [];
  if (!shopId) return list;

  if (supabase && isValidUuid(shopId)) {
    try {
      const { data: spData, error: spError } = await supabase
        .from("shop_products")
        .select("*, warehouse_products(*)")
        .eq("shop_id", shopId);

      if (!spError && spData?.length) {
        list = spData.map((sp) => {
          const wp = sp.warehouse_products || {};
          return {
            id: sp.id || wp.id,
            warehouseId: sp.warehouse_product_id,
            isWarehouse: true,
            name: wp.title || wp.name || "Warehouse Product",
            category: wp.category || "General Catalog",
            price: Number(sp.selling_price || wp.retail_price || wp.base_price || 499),
            originalPrice: Number(wp.base_price || wp.original_price || 699),
            stock: sp.allocated_stock ?? 10,
            status: sp.is_active ? "In Stock" : "Out of Stock",
            salesCount: 0,
            image: wp.image_url || wp.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80",
          };
        });
      }

      if (list.length > 0) return list;
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem(`serofast_shop_products_${shopId}`);
    if (stored) return JSON.parse(stored);
  } catch {}

  return list;
}

/* ── Link Warehouse Products to Shop ─────────────────────── */

export async function linkProductsToShop(shopId, productIds) {
  if (!supabase || !productIds?.length || !isValidUuid(shopId)) return;

  try {
    const validPids = productIds.filter((pid) => isValidUuid(pid));
    if (!validPids.length) return;

    const payload = validPids.map((pid) => ({
      shop_id: shopId,
      warehouse_product_id: pid,
      allocated_stock: 10,
      is_active: true,
    }));

    await supabase.from("shop_products").upsert(payload, {
      onConflict: "shop_id,warehouse_product_id",
    });
  } catch {
    // Graceful fallback
  }
}

/* ── Fetch Shop & Owner Details (Settings Page) ─────────── */

export async function fetchShopDetails(shopId, ownerId) {
  let shopData = null;
  let ownerData = null;

  if (supabase) {
    try {
      if (shopId && isValidUuid(shopId)) {
        const { data: s } = await supabase.from("shops").select("*").eq("id", shopId).maybeSingle();
        if (s) shopData = s;
      }
      if (ownerId && isValidUuid(ownerId)) {
        const { data: o } = await supabase.from("shop_owners").select("*").eq("id", ownerId).maybeSingle();
        if (o) ownerData = o;
      }
    } catch {
      // Graceful fallback
    }
  }

  if (!shopData) {
    try {
      const storedShop = localStorage.getItem("serofast_active_shop");
      if (storedShop) shopData = JSON.parse(storedShop);
    } catch {}
  }
  if (!ownerData) {
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      if (storedOwner) ownerData = JSON.parse(storedOwner);
    } catch {}
  }

  return { shop: shopData, owner: ownerData };
}

/* ── Update Shop & Owner Details (Settings Page) ────────── */

export async function updateShopDetails(shopId, ownerId, rawShopPayload, rawOwnerPayload) {
  if (supabase) {
    try {
      if (shopId && isValidUuid(shopId) && rawShopPayload) {
        // Filter strictly valid columns in public.shops table
        const cleanShopPayload = { updated_at: new Date().toISOString() };
        if (rawShopPayload.name !== undefined) cleanShopPayload.name = rawShopPayload.name;
        if (rawShopPayload.tagline !== undefined) cleanShopPayload.tagline = rawShopPayload.tagline;
        if (rawShopPayload.description !== undefined) cleanShopPayload.description = rawShopPayload.description;
        if (rawShopPayload.address !== undefined) cleanShopPayload.address = rawShopPayload.address;
        if (rawShopPayload.avatar_url !== undefined) cleanShopPayload.avatar_url = rawShopPayload.avatar_url;
        if (rawShopPayload.cover_url !== undefined) cleanShopPayload.cover_url = rawShopPayload.cover_url;
        if (rawShopPayload.category_id !== undefined) cleanShopPayload.category_id = rawShopPayload.category_id;

        await supabase.from("shops").update(cleanShopPayload).eq("id", shopId);
      }
      if (ownerId && isValidUuid(ownerId) && rawOwnerPayload) {
        // Filter strictly valid columns in public.shop_owners table
        const cleanOwnerPayload = { updated_at: new Date().toISOString() };
        if (rawOwnerPayload.full_name !== undefined) cleanOwnerPayload.full_name = rawOwnerPayload.full_name;
        if (rawOwnerPayload.email !== undefined) cleanOwnerPayload.email = rawOwnerPayload.email;
        if (rawOwnerPayload.phone !== undefined) cleanOwnerPayload.phone = rawOwnerPayload.phone;
        if (rawOwnerPayload.category !== undefined) cleanOwnerPayload.category = rawOwnerPayload.category;

        await supabase.from("shop_owners").update(cleanOwnerPayload).eq("id", ownerId);
      }
    } catch {
      // Graceful fallback
    }
  }

  if (rawShopPayload) {
    try {
      const storedShop = localStorage.getItem("serofast_active_shop");
      const current = storedShop ? JSON.parse(storedShop) : {};
      localStorage.setItem("serofast_active_shop", JSON.stringify({ ...current, ...rawShopPayload }));
    } catch {}
  }
  if (rawOwnerPayload) {
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      const current = storedOwner ? JSON.parse(storedOwner) : {};
      localStorage.setItem("serofast_current_owner", JSON.stringify({ ...current, ...rawOwnerPayload }));
    } catch {}
  }
}

/* ── Fetch Shop Orders (from public.orders) ─────────────── */

export async function fetchShopOrders(shopId) {
  if (supabase && shopId && isValidUuid(shopId)) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false });

      if (!error && data?.length) {
        return data.map((o) => ({
          id: o.order_number || o.id,
          rawId: o.id,
          customerName: o.shipping_address?.full_name || "Campus Customer",
          phone: o.shipping_address?.phone || "",
          address: o.delivery_location || o.shipping_address?.address || "Campus Hostel",
          items: (o.order_items || []).map((item) => ({
            name: item.product_name || "Item",
            qty: item.quantity,
            price: item.unit_price,
          })),
          totalAmount: o.total_amount,
          paymentMethod: o.payment_method === "COD" ? "Cash on Delivery" : "UPI Direct",
          paymentStatus: o.payment_status,
          status: o.status || o.order_status || "Pending",
          orderedAt: new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
          studentPartner: "Direct Shop Customer",
        }));
      }
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem(`serofast_orders_${shopId}`);
    if (stored) return JSON.parse(stored);
  } catch {}

  return [];
}

/* ── Update Order Status in Supabase ─────────────────────── */

export async function updateOrderStatusInSupabase(rawOrderId, status) {
  if (supabase && rawOrderId && isValidUuid(rawOrderId)) {
    try {
      await supabase
        .from("orders")
        .update({ status, order_status: status, updated_at: new Date().toISOString() })
        .eq("id", rawOrderId);
    } catch {
      // Graceful fallback
    }
  }
}

/* ── Fetch & Update Owner UPI ID (Saved in shop_owners table) ─ */

export async function fetchOwnerUpiId(ownerId) {
  if (supabase && ownerId && isValidUuid(ownerId)) {
    try {
      const { data, error } = await supabase
        .from("shop_owners")
        .select("*")
        .eq("id", ownerId)
        .maybeSingle();

      if (!error && data?.upi_id) return data.upi_id;
    } catch {
      // Graceful fallback
    }
  }
  return "";
}

export async function updateOwnerUpiId(ownerId, upiId) {
  if (supabase && ownerId && isValidUuid(ownerId)) {
    try {
      await supabase
        .from("shop_owners")
        .update({ upi_id: upiId, updated_at: new Date().toISOString() })
        .eq("id", ownerId);
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) {
      const owner = JSON.parse(stored);
      owner.upi_id = upiId;
      localStorage.setItem("serofast_current_owner", JSON.stringify(owner));
    }
  } catch {}
}
