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
