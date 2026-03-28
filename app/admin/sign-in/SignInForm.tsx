"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Sign in failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Sign in failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border-[3px] border-black bg-white p-6 text-black">
      <h1 className="text-3xl font-bold uppercase tracking-tight text-black">Admin Sign In</h1>
      <p className="mt-2 text-sm text-black">Use your admin email and password.</p>

      <div className="mt-5 flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="h-11 rounded-lg border border-black/30 px-3 text-sm text-black outline-none placeholder:text-black/45 focus:border-black"
          placeholder="Admin email"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="h-11 rounded-lg border border-black/30 px-3 text-sm text-black outline-none placeholder:text-black/45 focus:border-black"
          placeholder="Admin password"
        />
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
