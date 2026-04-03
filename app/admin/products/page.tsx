import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminAuth";
import { getAllProducts } from "@/lib/productsRepo";
import ProductsListClient from "./ProductsListClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await verifyAdminSessionToken(sessionToken))) {
    redirect("/admin/sign-in");
  }

  const products = await getAllProducts();

  return <ProductsListClient initialProducts={products} />;
}
