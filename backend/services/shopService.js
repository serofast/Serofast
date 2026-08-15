import { backendSupabase } from "../config/supabaseClient.js";

/**
 * Secure Shop Creation & Management Service
 * Manages records in the `public.shops` database table.
 */
export async function createShopBackend(shopData, ownerId = null) {
  const generatedId = window?.crypto?.randomUUID
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

  if (ownerId && !String(ownerId).startsWith("owner-")) {
    payload.owner_id = ownerId;
  }

  if (!backendSupabase) {
    return {
      success: true,
      shop: payload,
      mode: "local_fallback",
    };
  }

  try {
    const { data, error } = await backendSupabase
      .from("shops")
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`Database shop creation error: ${error.message}`);
    }

    return {
      success: true,
      shop: data,
      mode: "supabase_remote",
    };
  } catch (error) {
    console.error("Backend shopService error:", error.message);
    throw error;
  }
}
