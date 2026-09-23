import Link from "next/link";
import { Plus } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Admin</span>
            <span className="hidden text-sm text-white/50 sm:inline">Portfolio projects</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-[#031513] transition-colors hover:bg-white sm:text-sm"
            >
              <Plus size={16} aria-hidden /> Add project
            </Link>
            <span className="hidden text-xs text-white/40 md:inline">{email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white sm:text-sm"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
