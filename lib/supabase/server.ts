import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

/**
 * Supabase client for use inside Server Components, Server Actions and Route
 * Handlers. Reads/writes the auth session via Next.js cookies.
 *
 * Cookie writes silently no-op when called from a Server Component render
 * (Next.js forbids mutating cookies there) — session refresh in that case is
 * instead handled by the middleware.
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render — ignored, see middleware.
        }
      },
    },
  });
}
