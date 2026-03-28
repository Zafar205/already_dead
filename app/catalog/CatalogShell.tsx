import Link from "next/link";
import TopNav from "../components/TopNav";

type CatalogShellProps = {
  children: React.ReactNode;
};

export default function CatalogShell({ children }: CatalogShellProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <TopNav />

      {children}

      <footer className="w-full px-4 pb-6 md:px-6">
        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h4 className="text-sm font-bold tracking-wider">DARK PHANTOM STORE</h4>
            <p className="mt-3 text-sm text-black/65">
              Official merch for Dark Phantom. Built around limited drops and creator-inspired streetwear.
            </p>
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h4 className="text-sm font-bold tracking-wider">QUICK LINKS</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/catalog" className="hover:underline">
                Merch
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h4 className="text-sm font-bold tracking-wider">DROP ALERTS</h4>
            <p className="mt-3 text-sm text-black/65">Get updates on new Dark Phantom drops and limited restocks.</p>
            <div className="mt-4 border-b-2 border-black/20 pb-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/45"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
