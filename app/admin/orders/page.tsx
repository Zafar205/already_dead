import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import OrdersListClient from "./OrdersListClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await verifyAdminSessionToken(sessionToken))) {
    redirect("/admin/sign-in");
  }

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("id, created_at, status, total_amount, customer_name, customer_email, customer_phone, product_title")
    .order("created_at", { ascending: false });

  const orders =
    (data as Array<{
      id: string;
      created_at: string;
      status: string;
      total_amount: number;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      product_title: string;
    }>) ?? [];

  return <OrdersListClient initialOrders={orders} />;
}
