"use client";

import { useState, type FormEvent } from "react";

type CheckoutFormProps = {
  productSlug: string;
  productTitle: string;
};

export default function CheckoutForm({ productSlug, productTitle }: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      const isJsonResponse = contentType.includes("application/json");

      let data: { url?: string; error?: string } = {};

      if (isJsonResponse) {
        data = (await response.json()) as { url?: string; error?: string };
      } else {
        const fallbackText = await response.text();
        data.error = fallbackText.startsWith("<!DOCTYPE")
          ? "Checkout server error. Please verify Stripe and Supabase environment variables."
          : fallbackText;
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Checkout failed.");
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-8 border-t border-black/10 pt-6" onSubmit={handleSubmit}>
      <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Order this product</h2>
      <p className="mt-2 text-xs text-black/65">Provide your details to place the order.</p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <input
          type="text"
          placeholder="Full name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          required
          className="h-11 rounded-lg border border-black/20 bg-white px-3 text-sm outline-none focus:border-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          required
          className="h-11 rounded-lg border border-black/20 bg-white px-3 text-sm outline-none focus:border-black"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={customerPhone}
          onChange={(event) => setCustomerPhone(event.target.value)}
          required
          className="h-11 rounded-lg border border-black/20 bg-white px-3 text-sm outline-none focus:border-black"
        />
        <textarea
          placeholder="Shipping address (optional)"
          value={shippingAddress}
          onChange={(event) => setShippingAddress(event.target.value)}
          rows={3}
          className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-black"
        />
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Processing..." : `Place order for ${productTitle}`}
        </button>
      </div>
    </form>
  );
}
