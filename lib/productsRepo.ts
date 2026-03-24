import { defaultProducts, type Product } from "@/app/catalog/products";
import { getSupabaseAdmin } from "./supabaseAdmin";

type ProductRow = {
  id: number;
  slug: string;
  title: string;
  color: string;
  price: number;
  image: string;
  description: string;
  created_at?: string;
};

function normalizeRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    color: row.color,
    price: row.price,
    image: row.image,
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
