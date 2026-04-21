import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  "";

// Browser-only singleton — persists the auth session in localStorage and
// auto-refreshes the access token before expiry. This is what the admin UI
// uses so that fetch calls always carry a fresh Bearer token.
let _browser: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser() must only be called in the browser");
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public env vars are not configured");
  }
  if (!_browser) {
    _browser = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "ak-admin-auth",
      },
    });
  }
  return _browser;
}

export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase environment variables not configured");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
