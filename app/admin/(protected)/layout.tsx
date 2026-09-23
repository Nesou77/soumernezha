import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side authorization for everything under /admin except /admin/login.
 * The middleware already redirects unauthenticated/non-admin requests before
 * they reach here; this is a second, independent check (defense in depth) so
 * access never depends solely on the middleware or on hiding UI.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();

  if (!adminRow) redirect("/admin/login?error=not-authorized");

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
