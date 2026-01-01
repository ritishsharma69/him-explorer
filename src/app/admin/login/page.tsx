"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const already = window.localStorage.getItem(ADMIN_FLAG_KEY);
    if (already === "1") {
      router.replace("/admin/packages");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Login failed");
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(ADMIN_FLAG_KEY, "1");
      }

      router.replace("/admin/packages");
    } catch (error) {
      // Surface details in the console for debugging without showing to guests.
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Sign in to admin</h2>
      <p className="text-xs text-slate-500">
        Hidden admin area for internal use. Use the credentials you configured
        on the server.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-red-600">{error}</p>
        )}
	        <button
	          type="submit"
	          disabled={submitting}
	          className="inline-flex w-full items-center justify-center rounded-full bg-sky-500/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
	        >
	          {submitting ? "Signing in..." : "Sign in"}
	        </button>
      </form>
    </div>
  );
}

