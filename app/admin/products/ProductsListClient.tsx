"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  slug: string;
  title: string;
  color: string;
  price: number;
  image: string;
  description: string;
};

type ProductsListClientProps = {
  initialProducts: Product[];
};

export default function ProductsListClient({ initialProducts }: ProductsListClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteProduct(id: number) {
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete product.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 text-black md:px-6 md:py-14">
      <section className="mx-auto w-full max-w-6xl rounded-2xl border-[3px] border-black bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">All Products</h1>
            <p className="mt-2 text-sm text-black/65">Full list of products for management.</p>
          </div>
          <Link
            href="/admin"
            className="rounded-full border-2 border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-black hover:text-white"
          >
            Back to dashboard
          </Link>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-xl border-2 border-black p-3">
              <div className="mb-3 aspect-square overflow-hidden rounded-lg border border-black/15 bg-[#efefef]">
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase">{product.title}</p>
                  <p className="text-xs text-black/60">{product.color}</p>
                  <p className="text-xs font-semibold">${product.price}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="rounded-full border border-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-black hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
