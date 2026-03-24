import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanelClient from "./AdminPanelClient";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminAuth";
import { getAllProducts } from "@/lib/productsRepo";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(sessionToken)) {
    redirect("/admin/sign-in");
  }

  const products = await getAllProducts();

  let orders: Array<{
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    product_title: string;
  }> = [];

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("orders")
      .select(
        "id, created_at, status, total_amount, customer_name, customer_email, customer_phone, product_title",
      )
      .order("created_at", { ascending: false });

    orders = (data ?? []) as typeof orders;
  } catch {
    orders = [];
  }

  return <AdminPanelClient initialProducts={products} initialOrders={orders} />;
}
