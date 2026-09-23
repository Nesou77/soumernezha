import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase auth session cookie and gates access to /admin.
 * Unauthenticated visitors to any /admin route other than /admin/login are
 * redirected there; authenticated non-admins are signed out and redirected
 * with an error. This is defense in depth — RLS is the real authority.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const redirectUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("error", "not-authorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isLoginRoute && user) {
    const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();
    if (adminRow) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}
