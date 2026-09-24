import { promisify } from "node:util";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { backendSupabase } from "../config/supabaseClient.js";

const scryptAsync = promisify(scrypt);
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const KEY_LENGTH = 64;

function publicOwner(owner) {
  if (!owner) return owner;
  const { password_hash: _passwordHash, ...safeOwner } = owner;
  return safeOwner;
}

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("A password is required.");
  }

  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
  });

  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64url"),
    Buffer.from(derivedKey).toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password, storedHash) {
  if (typeof password !== "string" || typeof storedHash !== "string") return false;

  const [algorithm, cost, blockSize, parallelization, saltText, hashText] = storedHash.split("$");
  if (algorithm !== "scrypt" || !saltText || !hashText) return false;

  try {
    const expected = Buffer.from(hashText, "base64url");
    const derivedKey = await scryptAsync(
      password,
      Buffer.from(saltText, "base64url"),
      expected.length,
      { N: Number(cost), r: Number(blockSize), p: Number(parallelization) },
    );
    return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Secure Shop Owner Authentication & Registration Service
 * Manages records in the dedicated `public.shop_owners` database table.
 */
export async function registerShopOwnerBackend(ownerData) {
  const passwordHash = await hashPassword(ownerData.password);
  const payload = {
    full_name: ownerData.name || ownerData.full_name,
    email: ownerData.email,
    phone: ownerData.phone,
    category: ownerData.category || "Fashion",
    role: "shop_owner",
    password_hash: passwordHash,
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
      owner: publicOwner(data),
      mode: "supabase_remote",
    };
  } catch (error) {
    console.error("Backend authService error:", error.message);
    throw error;
  }
}

/** Verify a shop-owner password without returning the stored hash. */
export async function loginShopOwnerBackend({ email, password }) {
  if (!email || !password) throw new Error("Email and password are required.");
  if (!backendSupabase) {
    throw new Error("Backend Supabase client is not configured.");
  }

  const { data: owner, error } = await backendSupabase
    .from("shop_owners")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !owner || !(await verifyPassword(password, owner.password_hash))) {
    throw new Error("Invalid email or password.");
  }

  return { success: true, owner: publicOwner(owner), mode: "supabase_remote" };
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
    return publicOwner(data);
  } catch (err) {
    return null;
  }
}
