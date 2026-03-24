import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type CreateProductBody = {
  title?: string;
  color?: string;
  price?: number;
  image?: string;
  description?: string;
};

function isMissingProductsTableError(message: string) {
  return (
    message.includes("Could not find the table 'public.products'") ||
    message.includes("relation \"products\" does not exist")
  );
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, title, color, price, image, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingProductsTableError(error.message)) {
        return NextResponse.json({
          products: [],
          setupRequired: true,
          error: "Products table is missing. Run supabase/migrations/0002_products_admin.sql",
        });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateProductBody;

    if (!body.title || !body.color || typeof body.price !== "number" || !body.image || !body.description) {
      return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
    }

    const slug = toSlug(body.title);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug,
        title: body.title,
        color: body.color,
        price: body.price,
        image: body.image,
        description: body.description,
      })
      .select("id, slug, title, color, price, image, description, created_at")
      .single();

    if (error) {
      if (isMissingProductsTableError(error.message)) {
        return NextResponse.json(
          { error: "Products table is missing. Run supabase/migrations/0002_products_admin.sql" },
          { status: 400 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
