import type { Metadata } from "next";
import CatalogShell from "./CatalogShell";
import CatalogProductsClient from "./CatalogProductsClient";
import { getAllProducts } from "@/lib/productsRepo";

export const metadata: Metadata = {
  title: "Merch Catalog | Dark Phantom Store",
  description: "Browse all currently available Dark Phantom merch.",
};

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;
  const products = await getAllProducts();

  return (
    <CatalogShell>
      <main className="px-4 py-10 text-black md:px-6 md:py-14">
        <section className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 md:mb-10">
            <p className="text-xs font-semibold tracking-[0.24em] text-black/70">DARK PHANTOM STORE</p>
            <h1 className="text-4xl font-bold uppercase tracking-tight md:text-6xl">Merch Catalog</h1>
            <p className="max-w-2xl text-sm text-black/70 md:text-base">
              Explore the latest Dark Phantom drop. Open any item to view details and place your order.
            </p>
          </div>

          <CatalogProductsClient products={products} initialCategory={category} />
        </section>
      </main>
    </CatalogShell>
  );
}
