import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminAuth";
import SignInForm from "./SignInForm";

export default async function AdminSignInPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (verifyAdminSessionToken(sessionToken)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 md:px-6 md:py-14">
      <section className="mx-auto flex w-full max-w-6xl justify-center">
        <SignInForm />
      </section>
    </main>
  );
}
