import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-accent">Admin</p>
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
