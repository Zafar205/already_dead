"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "./products";

type Category = "all" | "t-shirts" | "jackets" | "hoodies";

const FILTER_OPTIONS: Array<{ label: string; value: Category }> = [
  { label: "All", value: "all" },
  { label: "T-Shirts", value: "t-shirts" },
  { label: "Jackets", value: "jackets" },
  { label: "Hoodies", value: "hoodies" },
];

type CatalogProductsClientProps = {
  products: Product[];
  initialCategory?: string;
};

function normalizeCategory(category?: string): Category {
  if (!category) {
    return "all";
  }

  const normalized = category.toLowerCase();

  if (normalized === "t-shirts" || normalized === "tshirt" || normalized === "t-shirts") {
    return "t-shirts";
  }

  if (normalized === "jacket" || normalized === "jackets") {
    return "jackets";
  }

  if (normalized === "hoodie" || normalized === "hoodies") {
    return "hoodies";
  }

  return "all";
}

function getProductCategory(product: Product): Category {
  const text = `${product.title} ${product.slug}`.toLowerCase();

  if (text.includes("hoodie")) {
    return "hoodies";
  }

  if (text.includes("jacket")) {
    return "jackets";
  }

  if (text.includes("shirt") || text.includes("tee") || text.includes("t-shirt") || text.includes("tshirt")) {
    return "t-shirts";
  }

  return "all";
}

export default function CatalogProductsClient({ products, initialCategory }: CatalogProductsClientProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>(normalizeCategory(initialCategory));

  useEffect(() => {
    setSelectedCategory(normalizeCategory(initialCategory));
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const category = getProductCategory(product);
      const title = product.title.toLowerCase();
      const color = product.color.toLowerCase();

      const matchesCategory = selectedCategory === "all" || category === selectedCategory;
      const matchesQuery = !normalizedQuery || title.includes(normalizedQuery) || color.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategory]);

  return (
    <>
      <div className="mb-4 rounded-2xl border-[3px] border-black bg-white p-3 md:mb-5 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isActive = selectedCategory === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedCategory(option.value)}
                className={`rounded-full border-2 px-3 py-1 text-xs font-semibold tracking-[0.12em] transition-colors md:px-4 md:py-1.5 ${
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-black/25 bg-white text-black hover:border-black"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border-[3px] border-black bg-white p-3 md:mb-8 md:p-4">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products by name or color"
          className="h-11 w-full rounded-xl border border-black/20 bg-[#f7f7f7] px-4 text-sm text-black outline-none placeholder:text-black/45 focus:border-black md:h-12 md:text-base"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border-[3px] border-black bg-white p-8 text-center">
          <p className="text-sm font-semibold tracking-[0.12em] text-black/60">NO PRODUCTS FOUND</p>
          <p className="mt-2 text-sm text-black/70">Try a different keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.slug}`}
              className="group rounded-2xl border-[3px] border-black bg-white p-3 transition-transform hover:-translate-y-1"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-black/10 bg-[#efefef]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover grayscale transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <h2 className="text-lg font-bold tracking-tight">{product.title}</h2>
              <p className="text-sm text-black/60">{product.color}</p>
              <p className="mt-2 text-sm font-semibold">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
