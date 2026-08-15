import { createClient } from "@supabase/supabase-js";

/**
 * Secure Server-Side Supabase Client Configurator
 * Uses environment variables to isolate authentication details securely.
 */
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

export const isBackendConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

export const backendSupabase = isBackendConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
