import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isMissingProductsTableError(message: string) {
  return (
    message.includes("Could not find the table 'public.products'") ||
    message.includes("relation \"products\" does not exist")
  );
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      if (isMissingProductsTableError(error.message)) {
        return NextResponse.json(
          { error: "Products table is missing. Run supabase/migrations/0002_products_admin.sql" },
          { status: 400 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
