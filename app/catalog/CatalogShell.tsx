import Link from "next/link";
import { Heart, Search, User } from "lucide-react";

type CatalogShellProps = {
  children: React.ReactNode;
};

export default function CatalogShell({ children }: CatalogShellProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <header className="flex h-14 border-b-[3px] border-black bg-white md:h-16">
        <Link
          href="/catalog"
          className="flex flex-1 items-center border-r-[3px] border-black px-3 md:px-6"
        >
          <span className="truncate text-xs font-bold tracking-wider md:text-sm md:tracking-widest">
            CATALOG
          </span>
        </Link>
        <Link
          href="/"
          className="relative flex flex-[0.9] items-center justify-center overflow-hidden border-r-[3px] border-black md:flex-[2]"
        >
          <img src="/already_dead.jpeg" alt="Already Dead" className="h-8 w-auto object-contain md:h-12" />
        </Link>
        <div className="flex flex-1 items-center justify-end gap-3 px-3 text-xs font-semibold tracking-wide md:gap-6 md:px-6 md:text-sm">
          <Search className="h-4 w-4 cursor-pointer md:h-5 md:w-5" strokeWidth={2.5} />
          <Heart className="h-4 w-4 cursor-pointer md:h-5 md:w-5" strokeWidth={2.5} />
          <User className="h-4 w-4 cursor-pointer md:h-5 md:w-5" strokeWidth={2.5} />
          <span className="ml-1 cursor-pointer md:ml-2">CART (0)</span>
        </div>
      </header>

      {children}

      <footer className="w-full px-4 pb-6 md:px-6">
        <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h4 className="text-sm font-bold tracking-wider">ALREADY DEAD</h4>
            <p className="mt-3 text-sm text-black/65">
              Brutalist custom products. Built from limited drops and one-off pieces.
            </p>
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h4 className="text-sm font-bold tracking-wider">NAVIGATION</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/catalog" className="hover:underline">
                Catalog
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h4 className="text-sm font-bold tracking-wider">NEWSLETTER</h4>
            <p className="mt-3 text-sm text-black/65">Get updates on new drops and custom releases.</p>
            <div className="mt-4 border-b-2 border-black/20 pb-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/45"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
