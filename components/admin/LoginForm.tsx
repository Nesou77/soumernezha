"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          disabled={pending}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none disabled:opacity-60"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={pending}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none disabled:opacity-60"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#031513] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
