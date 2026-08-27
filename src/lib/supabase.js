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

export async function uploadShopAsset(file, folder = "logos", shopIdentifier = "") {
  if (!file) return null;
  if (typeof file === "string") return file; // already a URL

  if (supabase) {
    try {
      const ext = file.name?.split(".").pop() || "png";
      const shopFolder = shopIdentifier
        ? String(shopIdentifier).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "general"
        : "general";
      const path = `shops/${shopFolder}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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

/* ── Helper: Unique Shop ID Slug Generator ───────────────── */

export function generateShopSlug(name) {
  const baseSlug = String(name || "shop")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const randomSuffix = Math.random().toString(36).slice(2, 7);
  return `${baseSlug || "shop"}-${randomSuffix}`;
}

/* ── Shop Owner Registration (Saved to public.shop_owners) ── */

export async function registerShopOwner(ownerData) {
  const email = ownerData.email?.trim() || "";
  const inputPhone = ownerData.phone?.trim() || "";
  const inputName = ownerData.name || ownerData.full_name || "";
  const inputCategory = ownerData.category || "Fashion";

  const payload = {
    full_name: inputName || "Shop Owner",
    email,
    phone: inputPhone,
    category: inputCategory,
    role: "shop_owner",
    is_shop_created: false,
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
        // Cross-check if there is a registered shop with an owner_phone
        let shopPhone = "";
        let shopObj = null;
        try {
          const { data: shop } = await supabase
            .from("shops")
            .select("*")
            .or(`owner_id.eq.${existing.id},owner_email.eq.${email}`)
            .maybeSingle();
          if (shop) {
            shopObj = shop;
            if (shop.owner_phone?.trim()) shopPhone = shop.owner_phone.trim();
          }
        } catch {}

        const finalPhone = inputPhone || existing.phone?.trim() || shopPhone || "";
        const finalName = inputName || existing.full_name?.trim() || "Shop Owner";
        const finalCategory = ownerData.category || existing.category || "Fashion";

        const updatePayload = {
          full_name: finalName,
          email,
          phone: finalPhone,
          category: finalCategory,
          is_shop_created: Boolean(existing.is_shop_created || shopObj),
          updated_at: new Date().toISOString(),
        };

        const { data: updated, error: updateError } = await supabase
          .from("shop_owners")
          .update(updatePayload)
          .eq("email", email)
          .select()
          .single();

        if (!updateError && updated) {
          localStorage.setItem("serofast_current_owner", JSON.stringify(updated));
          if (shopObj) {
            localStorage.setItem("serofast_active_shop", JSON.stringify(shopObj));
          } else {
            localStorage.removeItem("serofast_active_shop");
          }
          return updated;
        }
      } else {
        // If creating new owner, check if an existing shop has owner_phone or belongs to this email
        let matchedShop = null;
        try {
          const { data: shop } = await supabase
            .from("shops")
            .select("*")
            .eq("owner_email", email)
            .maybeSingle();

          if (shop) {
            matchedShop = shop;
            payload.is_shop_created = true;
            if (shop.owner_phone?.trim() && !payload.phone) {
              payload.phone = shop.owner_phone.trim();
            }
          }
        } catch {}

        const { data: created, error: createError } = await supabase
          .from("shop_owners")
          .insert([payload])
          .select()
          .single();

        if (!createError && created) {
          localStorage.setItem("serofast_current_owner", JSON.stringify(created));
          if (matchedShop) {
            localStorage.setItem("serofast_active_shop", JSON.stringify(matchedShop));
          } else {
            localStorage.removeItem("serofast_active_shop");
          }
          return created;
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  const fallback = { id: ownerData.id || `owner-${Date.now()}`, ...payload };
  localStorage.setItem("serofast_current_owner", JSON.stringify(fallback));
  localStorage.removeItem("serofast_active_shop");
  return fallback;
}

/* ── Shop Owner Sign In (Fetches from public.shop_owners & public.shops) ── */

export async function loginShopOwner(credentials) {
  const email = credentials.email?.trim() || "";
  const firebaseUid = credentials.id;

  if (!firebaseUid && !email) {
    throw new Error("Authentication failed: Unverified login request.");
  }

  if (supabase && email) {
    try {
      // 1. Fetch owner details from shop_owners table by email or id
      let query = supabase.from("shop_owners").select("*");
      if (isValidUuid(firebaseUid)) {
        query = query.or(`email.eq.${email},id.eq.${firebaseUid}`);
      } else {
        query = query.eq("email", email);
      }
      const { data: owner, error: ownerError } = await query.maybeSingle();

      if (!ownerError && owner) {
        // 2. Check if owner already has a registered shop (by owner_id or owner_email)
        let { data: shop } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", owner.id)
          .maybeSingle();

        if (!shop && email) {
          const { data: shopByEmail } = await supabase
            .from("shops")
            .select("*")
            .eq("owner_email", email)
            .maybeSingle();
          if (shopByEmail) shop = shopByEmail;
        }

        const hasShop = Boolean(shop);

        // Bidirectional Auto-Heal for phone number
        const effectivePhone = owner.phone?.trim() || shop?.owner_phone?.trim() || "";

        let ownerUpdated = false;
        const ownerUpdatePayload = {};

        if (hasShop && !owner.is_shop_created) {
          ownerUpdatePayload.is_shop_created = true;
          ownerUpdated = true;
        }

        if (effectivePhone && !owner.phone?.trim()) {
          ownerUpdatePayload.phone = effectivePhone;
          owner.phone = effectivePhone;
          ownerUpdated = true;
        }

        if (ownerUpdated) {
          try {
            await supabase
              .from("shop_owners")
              .update(ownerUpdatePayload)
              .eq("id", owner.id);
          } catch {}
        }

        if (shop) {
          const shopUpdatePayload = {};
          if (!shop.owner_id && owner.id) shopUpdatePayload.owner_id = owner.id;
          if (!shop.owner_name && owner.full_name) shopUpdatePayload.owner_name = owner.full_name;
          if (!shop.owner_email && owner.email) shopUpdatePayload.owner_email = owner.email;
          if (effectivePhone && !shop.owner_phone?.trim()) {
            shopUpdatePayload.owner_phone = effectivePhone;
            shop.owner_phone = effectivePhone;
          }

          if (Object.keys(shopUpdatePayload).length > 0) {
            try {
              await supabase
                .from("shops")
                .update(shopUpdatePayload)
                .eq("id", shop.id);
              if (shopUpdatePayload.owner_id) shop.owner_id = owner.id;
            } catch {}
          }
        }

        const ownerWithStatus = {
          ...owner,
          phone: effectivePhone || owner.phone || "",
          is_shop_created: hasShop || Boolean(owner.is_shop_created),
        };

        localStorage.setItem("serofast_current_owner", JSON.stringify(ownerWithStatus));

        if (hasShop && shop) {
          if (effectivePhone && !shop.owner_phone) {
            shop.owner_phone = effectivePhone;
          }
          localStorage.setItem("serofast_active_shop", JSON.stringify(shop));
          return { owner: ownerWithStatus, shop };
        }
        localStorage.removeItem("serofast_active_shop");
        return { owner: ownerWithStatus, shop: null };
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
    if (storedShop && owner) {
      const parsed = JSON.parse(storedShop);
      const isMatch =
        (parsed.owner_id && owner.id && String(parsed.owner_id) === String(owner.id)) ||
        (parsed.owner_email && owner.email && parsed.owner_email.toLowerCase() === owner.email.toLowerCase());
      if (isMatch) {
        shop = parsed;
      } else {
        localStorage.removeItem("serofast_active_shop");
      }
    } else {
      localStorage.removeItem("serofast_active_shop");
    }

    if (owner && shop) {
      const effectivePhone = owner.phone?.trim() || shop.owner_phone?.trim() || "";
      if (effectivePhone) {
        if (!owner.phone) owner.phone = effectivePhone;
        if (!shop.owner_phone) shop.owner_phone = effectivePhone;
      }
    }
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
        // Auto-heal phone from shops table if data.phone is empty
        if (!data.phone?.trim()) {
          const { data: shop } = await supabase
            .from("shops")
            .select("owner_phone")
            .or(`owner_id.eq.${data.id},owner_email.eq.${data.email}`)
            .maybeSingle();

          if (shop?.owner_phone?.trim()) {
            data.phone = shop.owner_phone.trim();
            try {
              await supabase
                .from("shop_owners")
                .update({ phone: data.phone })
                .eq("id", data.id);
            } catch {}
          }
        }
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

/* ── Save Onboarding Progress / Draft to Supabase & Storage ─ */

export async function saveOnboardingDraft(stepNumber, formData) {
  if (!formData) return;

  // 1. Persist in local storage under specific user key
  let currentOwnerObj = null;
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) currentOwnerObj = JSON.parse(stored);
  } catch {}

  const userKey = currentOwnerObj?.email || currentOwnerObj?.id || "default";
  try {
    localStorage.setItem(`serofast_create_shop_draft_${userKey}`, JSON.stringify(formData));
  } catch {}

  // 2. Persist in Supabase public.shop_owners and public.shops
  if (supabase && currentOwnerObj) {
    try {
      const ownerUpdates = {};
      if (formData.ownerName) ownerUpdates.full_name = formData.ownerName;
      if (formData.phone) ownerUpdates.phone = formData.phone;
      if (formData.email) ownerUpdates.email = formData.email;
      if (formData.category) ownerUpdates.category = formData.category;
      if (formData.is_paid) {
        ownerUpdates.is_paid = true;
        if (formData.payment_id) ownerUpdates.payment_id = formData.payment_id;
      }
      ownerUpdates.updated_at = new Date().toISOString();

      if (currentOwnerObj.id && isValidUuid(currentOwnerObj.id)) {
        await supabase.from("shop_owners").update(ownerUpdates).eq("id", currentOwnerObj.id);
      } else if (currentOwnerObj.email) {
        await supabase.from("shop_owners").update(ownerUpdates).eq("email", currentOwnerObj.email);
      }

      // Update currentOwnerObj in localStorage
      const mergedOwner = { ...currentOwnerObj, ...ownerUpdates };
      localStorage.setItem("serofast_current_owner", JSON.stringify(mergedOwner));

      // Also upsert/update draft in public.shops if shopName or payment is present
      const ownerEmail = formData.email || currentOwnerObj.email;
      const ownerId = currentOwnerObj.id;

      if (ownerEmail || (ownerId && isValidUuid(ownerId))) {
        let shopQuery = supabase.from("shops").select("*");
        if (ownerEmail && ownerId && isValidUuid(ownerId)) {
          shopQuery = shopQuery.or(`owner_email.eq.${ownerEmail},owner_id.eq.${ownerId}`);
        } else if (ownerEmail) {
          shopQuery = shopQuery.eq("owner_email", ownerEmail);
        } else {
          shopQuery = shopQuery.eq("owner_id", ownerId);
        }
        const { data: existingShop } = await shopQuery.maybeSingle();

        const fullAddress = [formData.address, formData.city, formData.pincode]
          .filter(Boolean)
          .map((s) => String(s).trim())
          .join(", ");

        const shopFields = {
          name: formData.shopName || existingShop?.name || "Draft Shop",
          tagline: formData.tagline || existingShop?.tagline || "",
          description: formData.description || existingShop?.description || "",
          address: fullAddress || existingShop?.address || "",
          category_id: (formData.category || existingShop?.category_id || "fashion").toLowerCase(),
          owner_name: formData.ownerName || currentOwnerObj.full_name || "",
          owner_email: ownerEmail,
          owner_phone: formData.phone || currentOwnerObj.phone || "",
          updated_at: new Date().toISOString(),
        };

        if (formData.is_paid) {
          shopFields.is_paid = true;
          shopFields.payment_id = formData.payment_id;
          shopFields.payment_status = "paid";
          shopFields.onboarding_amount = 49.00;
        }

        if (existingShop) {
          await supabase.from("shops").update(shopFields).eq("id", existingShop.id);
        }
      }
    } catch {}
  }
}

/* ── Load Onboarding Progress / Draft from Supabase & Storage ─ */

export async function loadOnboardingDraft() {
  let ownerObj = null;
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) ownerObj = JSON.parse(stored);
  } catch {}

  const userKey = ownerObj?.email || ownerObj?.id || "default";
  let localDraft = null;
  try {
    const dStr = localStorage.getItem(`serofast_create_shop_draft_${userKey}`);
    if (dStr) localDraft = JSON.parse(dStr);
  } catch {}

  const draft = { ...(localDraft || {}) };

  // Rehydrate directly from Supabase public.shop_owners and public.shops
  if (supabase && ownerObj) {
    try {
      // 1. Fetch live owner profile
      let ownerQuery = supabase.from("shop_owners").select("*");
      if (ownerObj.id && isValidUuid(ownerObj.id)) {
        ownerQuery = ownerQuery.eq("id", ownerObj.id);
      } else if (ownerObj.email) {
        ownerQuery = ownerQuery.eq("email", ownerObj.email);
      }
      const { data: dbOwner } = await ownerQuery.maybeSingle();

      if (dbOwner) {
        if (dbOwner.full_name && !draft.ownerName) draft.ownerName = dbOwner.full_name;
        if (dbOwner.phone && !draft.phone) draft.phone = dbOwner.phone;
        if (dbOwner.email && !draft.email) draft.email = dbOwner.email;
        if (dbOwner.category && !draft.category) draft.category = dbOwner.category;
        if (dbOwner.is_paid) {
          draft.is_paid = true;
          if (dbOwner.payment_id) draft.payment_id = dbOwner.payment_id;
        }
        localStorage.setItem("serofast_current_owner", JSON.stringify({ ...ownerObj, ...dbOwner }));
      }

      // 2. Fetch live shop profile
      const email = dbOwner?.email || ownerObj.email;
      const ownerId = dbOwner?.id || ownerObj.id;
      let shopQuery = supabase.from("shops").select("*");
      if (email && ownerId && isValidUuid(ownerId)) {
        shopQuery = shopQuery.or(`owner_email.eq.${email},owner_id.eq.${ownerId}`);
      } else if (email) {
        shopQuery = shopQuery.eq("owner_email", email);
      } else if (ownerId && isValidUuid(ownerId)) {
        shopQuery = shopQuery.eq("owner_id", ownerId);
      }
      const { data: dbShop } = await shopQuery.maybeSingle();

      if (dbShop) {
        if (dbShop.name && !draft.shopName) draft.shopName = dbShop.name;
        if (dbShop.tagline && !draft.tagline) draft.tagline = dbShop.tagline;
        if (dbShop.description && !draft.description) draft.description = dbShop.description;
        if (dbShop.address && !draft.address) draft.address = dbShop.address;
        if (dbShop.cover_url && !draft.cover) draft.cover = dbShop.cover_url;
        if (dbShop.avatar_url && !draft.logo) draft.logo = dbShop.avatar_url;
        if (dbShop.owner_phone && !draft.phone) draft.phone = dbShop.owner_phone;
        if (dbShop.owner_name && !draft.ownerName) draft.ownerName = dbShop.owner_name;
        if (dbShop.owner_email && !draft.email) draft.email = dbShop.owner_email;
        if (dbShop.is_paid) {
          draft.is_paid = true;
          draft.payment_id = dbShop.payment_id || draft.payment_id;
          draft.payment_status = "paid";
        }
      }
    } catch {}
  }

  // Ensure ownerName, email, and phone are populated from ownerObj if still empty
  if (ownerObj) {
    if (!draft.ownerName && ownerObj.full_name) draft.ownerName = ownerObj.full_name;
    if (!draft.email && ownerObj.email) draft.email = ownerObj.email;
    if (!draft.phone && ownerObj.phone) draft.phone = ownerObj.phone;
    if (!draft.category && ownerObj.category) draft.category = ownerObj.category;
    if (ownerObj.is_paid) {
      draft.is_paid = true;
      if (ownerObj.payment_id) draft.payment_id = ownerObj.payment_id;
    }
  }

  return draft;
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

/* ── Create Shop (Saves ALL details to public.shops & updates public.shop_owners) ────── */

export async function createShopInSupabase(shopData) {
  let ownerId = null;
  let currentOwnerObj = null;
  try {
    const stored = localStorage.getItem("serofast_current_owner");
    if (stored) {
      currentOwnerObj = JSON.parse(stored);
      ownerId = currentOwnerObj.id;
    }
  } catch {
    // Graceful fallback
  }

  const shopName = shopData.shopName || shopData.name || "My Campus Shop";
  const shopIdSlug = generateShopSlug(shopName);

  let avatarUrl = shopData.logo || "";
  let coverUrl = shopData.cover || "";

  if (shopData.logoFile) {
    const uploadedLogo = await uploadShopAsset(shopData.logoFile, "logos", shopName);
    if (uploadedLogo) avatarUrl = uploadedLogo;
  }

  if (shopData.coverFile) {
    const uploadedCover = await uploadShopAsset(shopData.coverFile, "covers", shopName);
    if (uploadedCover) coverUrl = uploadedCover;
  }

  const ownerName = shopData.ownerName || currentOwnerObj?.full_name || currentOwnerObj?.name || "Shop Owner";
  const ownerEmail = shopData.email || currentOwnerObj?.email || "";
  const ownerPhone = shopData.phone || currentOwnerObj?.phone || "";

  // 1. Strict Payment Security Check: Store cannot be created without verified ₹49 payment
  if (!shopData.is_paid || !shopData.payment_id) {
    throw new Error("Store activation requires completing the ₹49 onboarding payment.");
  }

  // Format shop address (location, city, pincode separated by commas)
  const fullAddress = [shopData.address, shopData.city, shopData.pincode]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .join(", ");

  const payload = {
    shop_id: shopIdSlug,
    name: shopName,
    tagline: shopData.tagline || "",
    description: shopData.description || "",
    address: fullAddress,
    cover_url: coverUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    avatar_url: avatarUrl || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80",
    category_id: (shopData.category || "fashion").toLowerCase(),
    rating: 4.8,
    owner_name: ownerName,
    owner_email: ownerEmail,
    owner_phone: ownerPhone,
    is_paid: true,
    payment_id: shopData.payment_id,
    payment_status: "paid",
    onboarding_amount: 49.00,
    created_at: new Date().toISOString(),
  };

  if (shopData.id && isValidUuid(shopData.id)) {
    payload.id = shopData.id;
  }

  if (ownerId && isValidUuid(ownerId)) {
    payload.owner_id = ownerId;
  }

  // Update phone, full_name, email, is_paid & set is_shop_created = true in public.shop_owners table
  if (supabase) {
    try {
      const ownerUpdate = {
        is_shop_created: true,
        is_paid: true,
        payment_id: shopData.payment_id,
        updated_at: new Date().toISOString(),
      };
      if (ownerPhone) ownerUpdate.phone = ownerPhone;
      if (ownerName) ownerUpdate.full_name = ownerName;
      if (ownerEmail) ownerUpdate.email = ownerEmail;

      if (ownerId && isValidUuid(ownerId)) {
        await supabase
          .from("shop_owners")
          .update(ownerUpdate)
          .eq("id", ownerId);
      } else if (ownerEmail) {
        await supabase
          .from("shop_owners")
          .update(ownerUpdate)
          .eq("email", ownerEmail);
      }

      // Record transaction
      try {
        const txNumber = `TXN-ONBOARD-${Date.now()}`;
        await supabase.from("transactions").insert([
          {
            transaction_number: txNumber,
            type: "Seller Onboarding",
            gross_amount: 49.00,
            platform_fee: 0.00,
            net_amount: 49.00,
            payment_method: "Razorpay Online",
            status: "Success",
            gateway_ref_id: shopData.payment_id,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch {}
    } catch {
      // Graceful fallback
    }
  }

  // Update local current owner state with is_shop_created: true, is_paid: true and updated phone number
  if (currentOwnerObj) {
    const updatedOwner = {
      ...currentOwnerObj,
      is_shop_created: true,
      is_paid: true,
      payment_id: shopData.payment_id,
      phone: ownerPhone || currentOwnerObj.phone,
      full_name: ownerName || currentOwnerObj.full_name,
    };
    localStorage.setItem("serofast_current_owner", JSON.stringify(updatedOwner));
  }

  if (supabase) {
    try {
      // 1. Check if a shop already exists for this owner email or owner_id (1 shop per owner rule)
      let checkQuery = supabase.from("shops").select("*");
      if (ownerEmail && ownerId && isValidUuid(ownerId)) {
        checkQuery = checkQuery.or(`owner_email.eq.${ownerEmail},owner_id.eq.${ownerId}`);
      } else if (ownerEmail) {
        checkQuery = checkQuery.eq("owner_email", ownerEmail);
      } else if (ownerId && isValidUuid(ownerId)) {
        checkQuery = checkQuery.eq("owner_id", ownerId);
      }

      const { data: existingShop } = await checkQuery.maybeSingle();

      if (existingShop) {
        // Update existing shop instead of creating duplicate
        const { id: existingId, created_at, ...updateFields } = payload;
        const { data: updated, error: updateError } = await supabase
          .from("shops")
          .update({ ...updateFields, updated_at: new Date().toISOString() })
          .eq("id", existingShop.id)
          .select()
          .single();

        if (!updateError && updated) {
          localStorage.setItem("serofast_active_shop", JSON.stringify(updated));
          if (shopData.selectedProducts?.length) {
            await linkProductsToShop(updated.id, shopData.selectedProducts);
          }
          return updated;
        }
      } else {
        // Insert single new shop
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
          const storePrice = Number(sp.selling_price || wp.store_price || wp.retail_price || wp.base_price || 499);
          const cutPrice = Number(wp["Price(will be cutted)"] || wp.cut_price || wp.base_price || wp.retail_price || storePrice);
          const imagesList = Array.isArray(wp.images) && wp.images.length
            ? wp.images
            : (wp.image_url ? [{ url: wp.image_url, isPrimary: true }] : []);

          return {
            id: sp.id || wp.id,
            warehouseId: sp.warehouse_product_id,
            isWarehouse: true,
            name: wp.title || wp.name || "Warehouse Product",
            category: wp.category || "General Catalog",
            price: storePrice,
            store_price: storePrice,
            originalPrice: cutPrice,
            cut_price: cutPrice,
            "Price(will be cutted)": cutPrice,
            stock: Number(wp.warehouse_stock ?? 1),
            status: (Number(wp.warehouse_stock ?? 1) > 0 && sp.is_active) ? "In Stock" : "Out of Stock",
            salesCount: 0,
            image: wp.image_url || wp.image || imagesList[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80",
            images: imagesList,
            material: wp.material,
            fit: wp.fit,
            care: wp.care,
            occation: wp.occation || wp.occasion || "",
            sizes: wp.sizes,
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
      if (ownerId && isValidUuid(ownerId)) {
        const { data: o } = await supabase.from("shop_owners").select("*").eq("id", ownerId).maybeSingle();
        if (o) ownerData = o;
      }
      if (shopId && isValidUuid(shopId)) {
        const { data: s } = await supabase.from("shops").select("*").eq("id", shopId).maybeSingle();
        if (s) shopData = s;
      } else if (ownerId && isValidUuid(ownerId)) {
        const { data: s } = await supabase.from("shops").select("*").eq("owner_id", ownerId).maybeSingle();
        if (s) {
          shopData = s;
        } else if (ownerData?.email) {
          const { data: sByEmail } = await supabase.from("shops").select("*").eq("owner_email", ownerData.email).maybeSingle();
          if (sByEmail) shopData = sByEmail;
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  if (!shopData) {
    try {
      const storedShop = localStorage.getItem("serofast_active_shop");
      if (storedShop) {
        const parsed = JSON.parse(storedShop);
        const ownerEmail = ownerData?.email?.toLowerCase();
        const ownerUid = ownerId || ownerData?.id;
        const isMatch =
          (ownerUid && parsed.owner_id && String(parsed.owner_id) === String(ownerUid)) ||
          (ownerEmail && parsed.owner_email && parsed.owner_email.toLowerCase() === ownerEmail);

        if (isMatch) {
          shopData = parsed;
        } else {
          localStorage.removeItem("serofast_active_shop");
        }
      }
    } catch {}
  }
  if (!ownerData) {
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      if (storedOwner) ownerData = JSON.parse(storedOwner);
    } catch {}
  }

  const effectivePhone = ownerData?.phone?.trim() || shopData?.owner_phone?.trim() || "";
  if (ownerData && effectivePhone && !ownerData.phone?.trim()) {
    ownerData.phone = effectivePhone;
  }
  if (shopData && effectivePhone && !shopData.owner_phone?.trim()) {
    shopData.owner_phone = effectivePhone;
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
        if (rawShopPayload.owner_name !== undefined) cleanShopPayload.owner_name = rawShopPayload.owner_name;
        if (rawShopPayload.owner_email !== undefined) cleanShopPayload.owner_email = rawShopPayload.owner_email;
        if (rawShopPayload.owner_phone !== undefined && rawShopPayload.owner_phone !== null) {
          const p = String(rawShopPayload.owner_phone).trim();
          if (p) cleanShopPayload.owner_phone = p;
        }

        await supabase.from("shops").update(cleanShopPayload).eq("id", shopId);
      }
      if (ownerId && isValidUuid(ownerId) && rawOwnerPayload) {
        // Filter strictly valid columns in public.shop_owners table
        const cleanOwnerPayload = { updated_at: new Date().toISOString() };
        if (rawOwnerPayload.full_name !== undefined) cleanOwnerPayload.full_name = rawOwnerPayload.full_name;
        if (rawOwnerPayload.email !== undefined) cleanOwnerPayload.email = rawOwnerPayload.email;
        if (rawOwnerPayload.phone !== undefined && rawOwnerPayload.phone !== null) {
          const p = String(rawOwnerPayload.phone).trim();
          if (p) cleanOwnerPayload.phone = p;
        }
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

/* ── Shop Owner Payouts, Sales & Withdrawals (₹30/dress & ₹100 Min Withdrawal) ── */

export async function fetchShopPayoutStats(shopId, ownerId) {
  let totalSalesAmount = 0;
  let completedOrdersCount = 0;
  let totalDressesSold = 0;
  let totalWithdrawn = 0;

  // 1. Fetch Orders from Supabase or localStorage
  let ordersList = [];
  if (supabase && shopId && isValidUuid(shopId)) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) ordersList = data;
    } catch {}
  }

  if (!ordersList.length) {
    try {
      const stored = localStorage.getItem(`serofast_orders_${shopId}`) || localStorage.getItem("serofast_active_shop");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) ordersList = parsed;
        else if (parsed?.orders) ordersList = parsed.orders;
      }
    } catch {}
  }

  // Calculate completed sales & dress units sold
  ordersList.forEach((order) => {
    const status = String(order.status || order.order_status || "").toLowerCase();
    const isCancelled = status === "cancelled" || status === "rejected";
    if (!isCancelled) {
      completedOrdersCount += 1;
      totalSalesAmount += Number(order.total_amount || order.totalAmount || 0);

      const items = order.order_items || order.items || [];
      if (items.length > 0) {
        items.forEach((item) => {
          totalDressesSold += Math.max(1, Number(item.quantity || item.qty || 1));
        });
      } else {
        totalDressesSold += 1;
      }
    }
  });

  // Shop owner earns 30rs per dress/item sold
  const ratePerDress = 30;
  const minWithdrawal = 100;
  const totalEarnings = totalDressesSold * ratePerDress;

  // 2. Fetch withdrawals from Supabase
  let withdrawalsList = [];
  if (supabase && (shopId || ownerId)) {
    try {
      let query = supabase.from("withdrawals").select("*");
      if (shopId && isValidUuid(shopId) && ownerId && isValidUuid(ownerId)) {
        query = query.or(`shop_id.eq.${shopId},owner_id.eq.${ownerId}`);
      } else if (shopId && isValidUuid(shopId)) {
        query = query.eq("shop_id", shopId);
      } else if (ownerId && isValidUuid(ownerId)) {
        query = query.eq("owner_id", ownerId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error && data && data.length > 0) withdrawalsList = data;
    } catch {}
  }

  if (!withdrawalsList.length) {
    try {
      const stored = localStorage.getItem(`serofast_withdrawals_${shopId || ownerId}`);
      if (stored) withdrawalsList = JSON.parse(stored);
    } catch {}
  }

  withdrawalsList.forEach((w) => {
    const st = String(w.status || "").toLowerCase();
    if (st !== "rejected" && st !== "cancelled" && st !== "failed") {
      totalWithdrawn += Number(w.amount || 0);
    }
  });

  const availableAmount = Math.max(0, totalEarnings - totalWithdrawn);

  return {
    totalSalesAmount,
    completedOrdersCount,
    totalDressesSold,
    ratePerDress,
    totalEarnings,
    totalWithdrawn,
    availableAmount,
    minWithdrawal,
    canWithdraw: availableAmount >= minWithdrawal,
    withdrawals: withdrawalsList.map((w) => ({
      id: w.id,
      payoutNumber: w.payout_number || `PO-${w.id?.slice(0, 8)}`,
      amount: Number(w.amount || 0),
      status: w.status || "Completed",
      method: w.payout_method || "Razorpay UPI",
      upiId: w.account_details?.upi_id || w.upi_id || "Direct UPI",
      transactionRef: w.transaction_ref || `RZP-${w.id?.slice(0, 8)}`,
      createdAt: w.created_at,
      date: new Date(w.created_at || Date.now()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
  };
}

export async function fetchShopWithdrawals(shopId, ownerId) {
  if (supabase && (shopId || ownerId)) {
    try {
      let query = supabase.from("withdrawals").select("*");
      if (shopId && isValidUuid(shopId) && ownerId && isValidUuid(ownerId)) {
        query = query.or(`shop_id.eq.${shopId},owner_id.eq.${ownerId}`);
      } else if (shopId && isValidUuid(shopId)) {
        query = query.eq("shop_id", shopId);
      } else if (ownerId && isValidUuid(ownerId)) {
        query = query.eq("owner_id", ownerId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error && data) {
        return data.map((w) => ({
          id: w.id,
          payoutNumber: w.payout_number || `PO-${w.id?.slice(0, 8)}`,
          amount: Number(w.amount || 0),
          status: w.status || "Completed",
          method: w.payout_method || "Razorpay UPI",
          upiId: w.account_details?.upi_id || w.upi_id || "Direct UPI",
          transactionRef: w.transaction_ref || `RZP-${w.id?.slice(0, 8)}`,
          createdAt: w.created_at,
          date: new Date(w.created_at || Date.now()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
      }
    } catch {}
  }

  try {
    const stored = localStorage.getItem(`serofast_withdrawals_${shopId || ownerId}`);
    if (stored) return JSON.parse(stored);
  } catch {}

  return [];
}

export async function requestShopWithdrawal({ shopId, ownerId, amount, upiId, payoutMethod = "Razorpay UPI" }) {
  const numAmount = Number(amount);
  if (!numAmount || numAmount < 100) {
    throw new Error("Minimum withdrawal amount is ₹100.");
  }
  if (!upiId || !String(upiId).trim()) {
    throw new Error("A valid UPI ID is required for Razorpay settlement.");
  }

  const cleanUpi = String(upiId).trim();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const payoutNumber = `PO-${dateStr}-${randSuffix}`;
  const txnRef = `RZP-PAYOUT-${Date.now().toString(36).toUpperCase()}`;

  const payload = {
    payout_number: payoutNumber,
    amount: numAmount,
    payout_method: payoutMethod || "Razorpay UPI",
    account_details: { upi_id: cleanUpi, gateway: "Razorpay Payouts" },
    status: "Completed", // Instant Razorpay direct payout settlement
    transaction_ref: txnRef,
    processed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (shopId && isValidUuid(shopId)) payload.shop_id = shopId;
  if (ownerId && isValidUuid(ownerId)) payload.owner_id = ownerId;

  let insertedRow = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("withdrawals")
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        insertedRow = data;
      }
    } catch {}

    // Record notification
    try {
      await sendNotification({
        recipient_role: "shop_owner",
        recipient_id: ownerId || "all",
        shop_id: shopId,
        title: "Razorpay Payout Processed",
        message: `₹${numAmount.toLocaleString("en-IN")} has been sent to your UPI address (${cleanUpi}) via Razorpay. Ref: ${txnRef}`,
        type: "payout",
        action_route: "/shop-owner/payouts",
        action_label: "View Payout",
        details: { payout_number: payoutNumber, amount: numAmount, upi_id: cleanUpi, transaction_ref: txnRef },
      });
    } catch {}
  }

  if (!insertedRow) {
    insertedRow = { id: `with_${Date.now()}`, ...payload };
  }

  const mappedRow = {
    id: insertedRow.id,
    payoutNumber: insertedRow.payout_number || payoutNumber,
    amount: numAmount,
    status: insertedRow.status || "Completed",
    method: insertedRow.payout_method || "Razorpay UPI",
    upiId: cleanUpi,
    transactionRef: insertedRow.transaction_ref || txnRef,
    createdAt: insertedRow.created_at,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Cache in localStorage
  try {
    const key = `serofast_withdrawals_${shopId || ownerId}`;
    const stored = localStorage.getItem(key);
    const list = stored ? JSON.parse(stored) : [];
    localStorage.setItem(key, JSON.stringify([mappedRow, ...list]));
  } catch {}

  return mappedRow;
}

export function subscribeToShopPayouts(shopId, ownerId, onUpdate) {
  if (!supabase) return () => {};

  try {
    const channelName = `shop_payouts_${shopId || ownerId || "all"}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        if (onUpdate) onUpdate();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "withdrawals" }, () => {
        if (onUpdate) onUpdate();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "shop_owners" }, () => {
        if (onUpdate) onUpdate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

/* ── Realtime Role-Based Notifications (User, Shop Owner, Admin) ── */

export async function fetchNotifications({ role = "shop_owner", recipientId = null, shopId = null }) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data
          .filter((n) => {
            if (n.recipient_role && n.recipient_role !== role && n.recipient_role !== "all") return false;
            if (n.recipient_id && recipientId && n.recipient_id !== recipientId && n.recipient_id !== "all") return false;
            if (n.shop_id && shopId && n.shop_id !== shopId) return false;
            return true;
          })
          .map((n) => ({
            id: n.id,
            title: n.title || "Notification",
            message: n.message || n.body || "",
            time: formatNotificationTime(n.created_at),
            date: new Date(n.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            type: (n.type || "system").toLowerCase(),
            unread: n.is_read !== undefined ? !n.is_read : true,
            actionLink: n.action_link || n.action_route || "",
            actionLabel: n.action_label || "View",
            details: n.details || {},
            rawCreatedAt: n.created_at,
          }));
      }
    } catch {
      // Graceful fallback
    }
  }

  return [];
}

export async function sendNotification({
  recipient_role = "shop_owner",
  recipient_id = null,
  user_id = null,
  shop_id = null,
  title,
  body = null,
  message = null,
  type = "system",
  action_route = null,
  action_link = null,
  action_label = "View",
  details = {},
}) {
  const finalMessage = body || message || "";
  const finalAction = action_route || action_link || "";
  const targetUser = recipient_id || user_id || "all";

  const payload = {
    recipient_role,
    recipient_id: targetUser,
    shop_id: shop_id && isValidUuid(shop_id) ? shop_id : null,
    title,
    message: finalMessage,
    type: type.toLowerCase(),
    action_link: finalAction,
    action_label,
    details,
    is_read: false,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert([payload])
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // Graceful fallback
    }
  }

  return null;
}

export async function markNotificationAsReadInSupabase(notificationId) {
  if (supabase && notificationId && isValidUuid(notificationId)) {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
    } catch {}
  }
}

export async function markAllNotificationsAsReadInSupabase({ role = "shop_owner", recipientId = null, shopId = null }) {
  if (supabase) {
    try {
      let query = supabase
        .from("notifications")
        .update({ is_read: true });

      if (recipientId) {
        query = query.eq("recipient_id", recipientId);
      } else if (role) {
        query = query.eq("recipient_role", role);
      }

      await query;
    } catch {}
  }
}

export async function deleteNotificationFromSupabase(notificationId) {
  if (supabase && notificationId && isValidUuid(notificationId)) {
    try {
      await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);
    } catch {}
  }
}

export function subscribeToRealtimeNotifications({ role = "shop_owner", recipientId = null, shopId = null, onNotification }) {
  if (!supabase) return () => {};

  try {
    const channelName = `realtime_notifs_${role}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newRow = payload.new;
          if (!newRow) return;

          // Check if notification is intended for this role
          if (newRow.recipient_role && newRow.recipient_role !== role) return;

          // Check recipient filtering
          const targetId = newRow.user_id || newRow.recipient_id;
          if (targetId && targetId !== "all" && recipientId && targetId !== recipientId) {
            return;
          }
          if (newRow.shop_id && shopId && newRow.shop_id !== shopId) {
            return;
          }

          const formatted = {
            id: newRow.id,
            title: newRow.title || "Notification",
            message: newRow.body || newRow.message || "",
            time: "Just now",
            date: new Date(newRow.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            type: (newRow.type || "system").toLowerCase(),
            unread: newRow.is_read !== undefined ? !newRow.is_read : true,
            actionLink: newRow.action_route || newRow.action_link || "",
            actionLabel: newRow.action_label || (newRow.action_route ? "View Details" : "View"),
            details: newRow.details || {},
            rawCreatedAt: newRow.created_at,
          };

          if (onNotification) onNotification(formatted);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

function formatNotificationTime(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Admin Portal Supabase API Integration ────────────────── */

export async function fetchAdminShops() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("*, shop_owners(*)")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminShopOwners() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shop_owners")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminWarehouseProducts() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("warehouse_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminOrders() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, shops(name, avatar_url)")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminProfiles() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminCategories() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function updateShopStatusInSupabase(shopId, status) {
  if (supabase && shopId) {
    try {
      const { data, error } = await supabase
        .from("shops")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", shopId)
        .select()
        .single();

      if (!error && data) return data;
    } catch {}
  }
  return null;
}

export async function fetchAdminOverviewStats() {
  let shops = [];
  let owners = [];
  let orders = [];
  let products = [];
  let profiles = [];

  if (supabase) {
    try {
      const [shopsRes, ownersRes, ordersRes, productsRes, profilesRes] = await Promise.all([
        supabase.from("shops").select("*"),
        supabase.from("shop_owners").select("*"),
        supabase.from("orders").select("*"),
        supabase.from("warehouse_products").select("*"),
        supabase.from("profiles").select("*"),
      ]);

      if (shopsRes.data) shops = shopsRes.data;
      if (ownersRes.data) owners = ownersRes.data;
      if (ordersRes.data) orders = ordersRes.data;
      if (productsRes.data) products = productsRes.data;
      if (profilesRes.data) profiles = profilesRes.data;
    } catch {}
  }

  const activeShops = shops.filter((s) => s.status === "active").length;
  const pendingShops = shops.filter((s) => s.status === "pending_review" || s.status === "draft").length;
  const totalGMV = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const pendingOrders = orders.filter((o) => o.order_status === "PENDING" || o.status === "Pending").length;

  return {
    totalShops: shops.length,
    activeShops,
    pendingShops,
    totalMerchants: owners.length,
    totalOrders: orders.length,
    pendingOrders,
    totalProducts: products.length,
    totalCustomers: profiles.length,
    totalGMV,
    shops,
    owners,
    orders,
    products,
    profiles,
  };
}

export async function fetchAdminCoupons() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminBanners() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminSupportTickets() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminReviews() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, email), shops(name)")
        .order("created_at", { ascending: false });

      if (!error && data?.length) return data;
    } catch {}
  }
  return [];
}

export async function fetchAdminShopDetails(shopId) {
  if (supabase && shopId) {
    try {
      const { data, error } = await supabase
        .from("shops")
        .select("*, shop_owners(*)")
        .eq("id", shopId)
        .single();

      if (!error && data) return data;
    } catch {}
  }
  return null;
}

export async function fetchAdminCustomerDetails(customerId) {
  if (supabase && customerId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, orders(*)")
        .eq("id", customerId)
        .single();

      if (!error && data) return data;
    } catch {}
  }
  return null;
}

export function subscribeToAdminTableChanges(tableName, onChangeCallback) {
  if (!supabase || !tableName) return () => {};

  try {
    const channelName = `admin_realtime_${tableName}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          if (onChangeCallback) onChangeCallback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

