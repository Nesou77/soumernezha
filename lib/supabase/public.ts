import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

/**
 * Stateless Supabase client (anon key, no cookies/session) for public reads.
 * Used by the public site's data layer so those pages don't call
 * `next/headers` cookies() — which would force fully dynamic rendering —
 * and can instead rely on time-based + on-demand revalidation.
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}
