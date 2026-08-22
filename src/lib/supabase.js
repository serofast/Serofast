import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "shop-assets";

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/* ── Convert File to Data URL Fallback ──────────────────── */

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file || !(file instanceof Blob)) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result || null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/* ── Image Upload ───────────────────────────────────────── */

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

  // Persistent Data URL fallback so the user's actual image is preserved in database
  const dataUrl = await fileToDataUrl(file);
  if (dataUrl) return dataUrl;

  return folder === "logos"
    ? "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80"
    : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";
}

/* ── Shop Owner Registration (Saved to public.shop_owners) ── */

export async function registerShopOwner(ownerData) {
  const payload = {
    full_name: ownerData.name || ownerData.full_name || "",
    email: ownerData.email || "",
    phone: ownerData.phone || "",
    category: ownerData.category || "Fashion",
    role: "shop_owner",
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shop_owners")
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem("serofast_current_owner", JSON.stringify(data));
        return data;
      }
    } catch {
      // Graceful fallback
    }
  }

  const fallback = { id: `owner-${Date.now()}`, ...payload };
  localStorage.setItem("serofast_current_owner", JSON.stringify(fallback));
  return fallback;
}

/* ── Shop Owner Sign In (Fetches from public.shop_owners) ── */

export async function loginShopOwner(credentials) {
  const email = credentials.email?.trim() || "";

  if (supabase && email) {
    try {
      // 1. Fetch owner details from shop_owners table
      const { data: owner, error: ownerError } = await supabase
        .from("shop_owners")
        .select("*")
        .eq("email", email)
        .maybeSingle();

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

  // Fallback owner
  const fallbackOwner = {
    id: `owner-${Date.now()}`,
    full_name: email.split("@")[0] || "Shop Owner",
    email,
    phone: credentials.phone || "",
    category: "Fashion",
  };
  localStorage.setItem("serofast_current_owner", JSON.stringify(fallbackOwner));
  return { owner: fallbackOwner, shop: null };
}

/* ── Fetch Owner Profile (for auto-prefilling shop creation) ── */

export async function fetchOwnerProfile() {
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Fetch latest from shop_owners table if supabase connected
      if (supabase && parsed.email) {
        const { data } = await supabase
          .from("shop_owners")
          .select("*")
          .eq("email", parsed.email)
          .maybeSingle();

        if (data) {
          localStorage.setItem("serofast_current_owner", JSON.stringify(data));
          return data;
        }
      }
      return parsed;
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

/* ── Fetch Warehouse Products (admin catalog) ───────────── */

export async function fetchWarehouseProducts() {
  if (supabase) {
    try {
      // 1. Try warehouse_products table
      const { data: wData, error: wError } = await supabase
        .from("warehouse_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!wError && wData?.length) return wData;

      // 2. Fallback to products table if warehouse_products is empty
      const { data: pData, error: pError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!pError && pData?.length) return pData;
    } catch {
      // Graceful fallback
    }
  }
  return [];
}

/* ── Create Shop (saves ALL details to public.shops) ────── */

export async function createShopInSupabase(shopData) {
  let ownerId = null;
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) ownerId = JSON.parse(stored).id;
  } catch {
    // Graceful fallback
  }

  // Upload images upon launch if file objects exist
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

  const payload = {
    id,
    name: shopData.shopName || shopData.name || "My Campus Shop",
    tagline: shopData.tagline || "",
    description: shopData.description || "",
    cover_url: coverUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    avatar_url: avatarUrl || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80",
    category_id: (shopData.category || "fashion").toLowerCase(),
    rating: 4.8,
    created_at: new Date().toISOString(),
  };

  if (ownerId && !String(ownerId).startsWith("owner-")) {
    payload.owner_id = ownerId;
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

        // Link selected products to this shop
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

/* ── Fetch Shop Products from public.shop_products Table ───── */

export async function fetchShopProducts(shopId) {
  if (supabase && shopId && !String(shopId).startsWith("shop-")) {
    try {
      const { data, error } = await supabase
        .from("shop_products")
        .select("*, warehouse_products(*)")
        .eq("shop_id", shopId)
        .order("added_at", { ascending: false });

      if (!error && data?.length) {
        return data.map((sp) => {
          const wp = sp.warehouse_products || {};
          return {
            id: sp.id || wp.id,
            warehouseId: sp.warehouse_product_id,
            isWarehouse: true, // Read-only warehouse product mark
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
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem(`serofast_shop_products_${shopId}`);
    if (stored) return JSON.parse(stored);
  } catch {}

  return null;
}

/* ── Link Selected Products to Shop ─────────────────────── */

export async function linkProductsToShop(shopId, productIds) {
  if (!supabase || !productIds?.length) return;

  try {
    const payload = productIds.map((pid) => ({
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



/* ── Fetch Shop & Owner Details ─────────────────────────── */

export async function fetchShopDetails(shopId, ownerId) {
  let shopData = null;
  let ownerData = null;

  if (supabase) {
    try {
      if (shopId && !String(shopId).startsWith("shop-")) {
        const { data: s } = await supabase.from("shops").select("*").eq("id", shopId).maybeSingle();
        if (s) shopData = s;
      }
      if (ownerId && !String(ownerId).startsWith("owner-")) {
        const { data: o } = await supabase.from("shop_owners").select("*").eq("id", ownerId).maybeSingle();
        if (o) ownerData = o;
      }
    } catch {
      // Graceful fallback
    }
  }

  // Local Storage Fallback
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

/* ── Update Shop & Owner Details ────────────────────────── */

export async function updateShopDetails(shopId, ownerId, shopPayload, ownerPayload) {
  if (supabase) {
    try {
      if (shopId && !String(shopId).startsWith("shop-") && shopPayload) {
        await supabase.from("shops").update({
          ...shopPayload,
          updated_at: new Date().toISOString(),
        }).eq("id", shopId);
      }
      if (ownerId && !String(ownerId).startsWith("owner-") && ownerPayload) {
        await supabase.from("shop_owners").update({
          ...ownerPayload,
          updated_at: new Date().toISOString(),
        }).eq("id", ownerId);
      }
    } catch {
      // Graceful fallback
    }
  }

  // Update Local Storage
  if (shopPayload) {
    try {
      const storedShop = localStorage.getItem("serofast_active_shop");
      const current = storedShop ? JSON.parse(storedShop) : {};
      localStorage.setItem("serofast_active_shop", JSON.stringify({ ...current, ...shopPayload }));
    } catch {}
  }
  if (ownerPayload) {
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      const current = storedOwner ? JSON.parse(storedOwner) : {};
      localStorage.setItem("serofast_current_owner", JSON.stringify({ ...current, ...ownerPayload }));
    } catch {}
  }

  return true;
}

/* ── Fetch Shop Orders (Filtered by shop_id) ─────────────── */

export async function fetchShopOrders(shopId) {
  if (supabase && shopId && !String(shopId).startsWith("shop-")) {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false });

      if (!error && orders) {
        return orders.map((o) => ({
          id: o.order_number || o.id,
          rawId: o.id,
          customerName: o.shipping_address?.full_name || o.shipping_address?.name || "Customer",
          phone: o.customer_phone || o.shipping_address?.phone || "",
          address: o.address || o.shipping_address?.address_line1 || "Campus Address",
          items: (o.order_items || []).map((item) => ({
            name: item.product_title,
            qty: item.quantity,
            price: item.total_price || item.unit_price,
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

  // Local Storage Fallback
  try {
    const stored = localStorage.getItem(`serofast_orders_${shopId}`);
    if (stored) return JSON.parse(stored);
  } catch {}

  return [];
}

/* ── Update Order Status in Supabase ─────────────────────── */

export async function updateOrderStatusInSupabase(rawOrderId, status) {
  if (supabase && rawOrderId && !String(rawOrderId).startsWith("SF-")) {
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
  if (supabase && ownerId && !String(ownerId).startsWith("owner-")) {
    try {
      const { data, error } = await supabase
        .from("shop_owners")
        .select("upi_id")
        .eq("id", ownerId)
        .maybeSingle();

      if (!error && data?.upi_id) return data.upi_id;
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.upi_id || parsed.upiId) return parsed.upi_id || parsed.upiId;
    }
  } catch {}

  return "";
}

export async function updateOwnerUpiId(ownerId, upiId) {
  if (supabase && ownerId && !String(ownerId).startsWith("owner-")) {
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
    const current = stored ? JSON.parse(stored) : {};
    localStorage.setItem(
      "serofast_current_owner",
      JSON.stringify({ ...current, upi_id: upiId, upiId })
    );
  } catch {}

  return true;
}

/* ── Fetch Seller Payout Settings ───────────────────────── */

export async function fetchSellerPayoutSettings(shopId, ownerId) {

  if (supabase) {
    try {
      let query = supabase.from("seller_payout_settings").select("*");
      if (shopId && !String(shopId).startsWith("shop-")) {
        query = query.eq("shop_id", shopId);
      } else if (ownerId && !String(ownerId).startsWith("owner-")) {
        query = query.eq("owner_id", ownerId);
      }
      const { data, error } = await query.maybeSingle();
      if (!error && data) return data;
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem("serofast_payout_settings");
    if (stored) return JSON.parse(stored);
  } catch {}

  return null;
}

/* ── Update Seller Payout Settings ───────────────────────── */

export async function updateSellerPayoutSettings(shopId, ownerId, settings) {
  const payload = {
    account_name: settings.accountName || "",
    upi_vpa: settings.upiVpa || "",
    bank_account: settings.bankAccount || "",
    ifsc_code: settings.ifscCode || "",
    updated_at: new Date().toISOString(),
  };

  if (shopId && !String(shopId).startsWith("shop-")) payload.shop_id = shopId;
  if (ownerId && !String(ownerId).startsWith("owner-")) payload.owner_id = ownerId;

  if (supabase) {
    try {
      const existing = await fetchSellerPayoutSettings(shopId, ownerId);
      if (existing?.id) {
        await supabase.from("seller_payout_settings").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("seller_payout_settings").insert([payload]);
      }
    } catch {
      // Graceful fallback
    }
  }

  localStorage.setItem("serofast_payout_settings", JSON.stringify(settings));
  return true;
}

/* ── Fetch Seller Payouts History ───────────────────────── */

export async function fetchSellerPayouts(shopId, ownerId) {
  if (supabase) {
    try {
      let query = supabase.from("seller_payouts").select("*").order("created_at", { ascending: false });
      if (shopId && !String(shopId).startsWith("shop-")) {
        query = query.eq("shop_id", shopId);
      } else if (ownerId && !String(ownerId).startsWith("owner-")) {
        query = query.eq("owner_id", ownerId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map((p) => ({
          id: p.payout_number || p.id,
          rawId: p.id,
          date: new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          amount: Number(p.amount) || 0,
          ordersCount: p.orders_count || 0,
          status: p.status || "Settled",
          method: p.method || "UPI Direct",
        }));
      }
    } catch {
      // Graceful fallback
    }
  }

  try {
    const stored = localStorage.getItem("serofast_payouts_history");
    if (stored) return JSON.parse(stored);
  } catch {}

  return [];
}

/* ── Create Seller Payout Record ────────────────────────── */

export async function createSellerPayout(payoutData) {
  const payload = {
    payout_number: payoutData.id || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: payoutData.amount || 0,
    orders_count: payoutData.ordersCount || 1,
    status: payoutData.status || "Settled",
    method: payoutData.method || "UPI Direct",
    created_at: new Date().toISOString(),
  };

  if (payoutData.shopId && !String(payoutData.shopId).startsWith("shop-")) payload.shop_id = payoutData.shopId;
  if (payoutData.ownerId && !String(payoutData.ownerId).startsWith("owner-")) payload.owner_id = payoutData.ownerId;

  if (supabase) {
    try {
      await supabase.from("seller_payouts").insert([payload]);
    } catch {
      // Graceful fallback
    }
  }

  try {
    const current = await fetchSellerPayouts(payoutData.shopId, payoutData.ownerId);
    const updated = [payoutData, ...current];
    localStorage.setItem("serofast_payouts_history", JSON.stringify(updated));
  } catch {}

  return true;
}

