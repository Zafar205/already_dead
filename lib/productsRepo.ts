import { defaultProducts, type Product } from "@/app/catalog/products";
import { getSupabaseAdmin } from "./supabaseAdmin";

type ProductRow = {
  id: number;
  slug: string;
  title: string;
  color: string;
  price: number;
  image: string | null;
  description: string;
  created_at?: string;
};

const FALLBACK_PRODUCT_IMAGE = "/product_1.jpeg";

function normalizeProductImage(image: string | null | undefined): string {
  if (typeof image !== "string") {
    return FALLBACK_PRODUCT_IMAGE;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      // Ensure malformed absolute URLs never reach next/image.
      new URL(trimmed);
      return trimmed;
    } catch {
      return FALLBACK_PRODUCT_IMAGE;
    }
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\.?\//, "")}`;
}

function normalizeRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    color: row.color,
    price: row.price,
    image: normalizeProductImage(row.image),
    description: row.description,
  };
}

export async function getAllProducts() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, title, color, price, image, description, created_at")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultProducts;
    }

    return (data as ProductRow[]).map(normalizeRow);
  } catch {
    return defaultProducts;
  }
}

export async function getProductBySlugFromStore(slug: string) {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug);
}
