import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import CatalogShell from "./CatalogShell";
import { getAllProducts } from "@/lib/productsRepo";

export const metadata: Metadata = {
  title: "Merch Catalog | Dark Phantom Store",
  description: "Browse all currently available Dark Phantom merch.",
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
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
                <h2 className="text-lg font-bold uppercase tracking-tight">{product.title}</h2>
                <p className="text-sm text-black/60">{product.color}</p>
                <p className="mt-2 text-sm font-semibold">${product.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </CatalogShell>
  );
}
