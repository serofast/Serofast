import { backendSupabase } from "../config/supabaseClient.js";

/**
 * Secure Shop Owner Authentication & Registration Service
 * Manages records in the dedicated `public.shop_owners` database table.
 */
export async function registerShopOwnerBackend(ownerData) {
  const payload = {
    full_name: ownerData.name || ownerData.full_name,
    email: ownerData.email,
    phone: ownerData.phone,
    category: ownerData.category || "Fashion",
    role: "shop_owner",
  };

  if (!backendSupabase) {
    console.warn("Backend Supabase client not initialized. Populate environment keys in backend/.env");
    return {
      success: true,
      owner: {
        id: `owner-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
      },
      mode: "local_fallback",
    };
  }

  try {
    const { data, error } = await backendSupabase
      .from("shop_owners")
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`Database registration error: ${error.message}`);
    }

    return {
      success: true,
      owner: data,
      mode: "supabase_remote",
    };
  } catch (error) {
    console.error("Backend authService error:", error.message);
    throw error;
  }
}

/**
 * Verify Shop Owner Email Exists in database
 */
export async function getShopOwnerByEmail(email) {
  if (!backendSupabase) return null;

  try {
    const { data, error } = await backendSupabase
      .from("shop_owners")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;
    return data;
  } catch (err) {
    return null;
  }
}
