import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogShell from "../CatalogShell";
import CheckoutForm from "./CheckoutForm";
import { getAllProducts, getProductBySlugFromStore } from "@/lib/productsRepo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromStore(slug);

  if (!product) {
    return {
      title: "Product Not Found | Already Dead Store",
    };
  }

  return {
    title: `${product.title} | Already Dead Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugFromStore(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const suggestedProducts = allProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <CatalogShell>
      <main className="px-4 py-10 text-black md:px-6 md:py-14">
        <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-[3px] border-black bg-white">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover grayscale"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-black/60"> Already Dead / MERCH</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{product.title}</h1>
            <p className="mt-3 text-sm text-black/70">Color: {product.color}</p>
            <p className="mt-1 text-xl font-bold">${product.price}</p>

            <p className="mt-6 max-w-xl text-sm leading-6 text-black/80 md:text-base">{product.description}</p>

            <CheckoutForm productSlug={product.slug} productTitle={product.title} />

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-full border-2 border-black px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-black hover:text-white"
              >
                Back to merch
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-6xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">More Already Dead Picks</h2>
            <Link href="/catalog" className="text-xs font-semibold uppercase tracking-[0.16em] hover:underline">
              View all merch
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/catalog/${item.slug}`}
                className="group rounded-2xl border-[3px] border-black bg-white p-3 transition-transform hover:-translate-y-1"
              >
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-black/10 bg-[#efefef]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover grayscale transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
                <p className="text-sm text-black/60">{item.color}</p>
                <p className="mt-2 text-sm font-semibold">${item.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </CatalogShell>
  );
}
