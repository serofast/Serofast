import { createClient } from "@supabase/supabase-js";

// Read strictly from Vite environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Register Shop Owner in dedicated `public.shop_owners` table
 */
export async function registerShopOwner(ownerData) {
  const payload = {
    full_name: ownerData.name || ownerData.full_name,
    email: ownerData.email,
    phone: ownerData.phone,
    category: ownerData.category || "Fashion",
    role: "shop_owner",
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shop_owners")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn("Supabase shop_owners insert note:", error.message);
      } else if (data) {
        localStorage.setItem("serofast_current_owner", JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn("Network error during shop owner registration:", err);
    }
  }

  // Secure local fallback when env vars are not set
  const fallbackOwner = {
    id: `owner-${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem("serofast_current_owner", JSON.stringify(fallbackOwner));
  return fallbackOwner;
}

/**
 * Create Shop in `public.shops` table with reference to owner_id
 */
export async function createShopInSupabase(shopData) {
  let ownerId = null;
  try {
    const ownerStored = localStorage.getItem("serofast_current_owner");
    if (ownerStored) {
      const parsed = JSON.parse(ownerStored);
      ownerId = parsed.id;
    }
  } catch (e) {
    console.warn("Owner read error", e);
  }

  const generatedId = window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `shop-${Math.random().toString(36).substring(2, 10)}`;

  const payload = {
    id: generatedId,
    name: shopData.shopName || shopData.name || "My Campus Shop",
    tagline: shopData.tagline || "Official Campus Store",
    description: shopData.description || "Campus store on SeroFast Platform.",
    cover_url: shopData.cover || shopData.cover_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    avatar_url: shopData.logo || shopData.avatar_url || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80",
    category_id: (shopData.category || "fashion").toLowerCase(),
    business_type: shopData.businessType || "Individual",
    gst_no: shopData.gstNo || null,
    pan_no: shopData.panNo || null,
    pickup_address: shopData.pickupAddress || shopData.address || null,
    account_holder: shopData.accountHolder || shopData.ownerName || null,
    account_number: shopData.accountNumber || null,
    ifsc_code: shopData.ifscCode || null,
    upi_id: shopData.upiId || null,
    settlement_method: shopData.settlementMethod || "Instant UPI",
    shipping_method: shopData.shippingMethod || "Campus Delivery + Store Pickup",
    delivery_radius: shopData.deliveryRadius || "5 km",
    shipping_fee: Number(shopData.shippingFee || 20),
    free_shipping_threshold: Number(shopData.freeShippingThreshold || 499),
    prep_time: shopData.prepTime || "15-30 mins",
    return_policy: shopData.returnPolicy || "7 Days Easy Returns",
    cancellation_policy: shopData.cancellationPolicy || "Free cancellation before dispatch",
    rating: 4.8,
    created_at: new Date().toISOString(),
  };

  if (ownerId && !ownerId.startsWith("owner-")) {
    payload.owner_id = ownerId;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shops")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn("Supabase shops insert note:", error.message);
      } else if (data) {
        localStorage.setItem("serofast_active_shop", JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn("Network error during shop creation:", err);
    }
  }

  localStorage.setItem("serofast_active_shop", JSON.stringify(payload));
  return payload;
}
