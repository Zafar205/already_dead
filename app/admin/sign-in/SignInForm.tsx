"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("mohamedalzafar@gmail.com");
  const [password, setPassword] = useState("123456");
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
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border-[3px] border-black bg-white p-6">
      <h1 className="text-3xl font-bold uppercase tracking-tight">Admin Sign In</h1>
      <p className="mt-2 text-sm text-black/70">Use your admin email and password.</p>

      <div className="mt-5 flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-11 rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="h-11 rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
          placeholder="Password"
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
