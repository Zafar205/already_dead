"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const logoTextFont = localFont({
  src: "../../public/another_danger.otf",
  display: "swap",
});

const categories = [
  { label: "T-Shirts", href: "/catalog?category=t-shirts" },
  { label: "Jackets", href: "/catalog?category=jackets" },
  { label: "Hoodies", href: "/catalog?category=hoodies" },
];

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#f5f5f5]/95 backdrop-blur">
        <div className="mx-auto grid h-16 w-full max-w-[1800px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:h-20 md:px-6">
          <Link href="/" className={`${logoTextFont.className} text-[28px] leading-none tracking-tight text-black md:text-[38px]`}>
            Already Dead
          </Link>

          <nav className="hidden items-center justify-center gap-6 text-sm font-semibold tracking-[0.14em] text-black md:flex">
            {categories.map((item) => (
              <Link key={item.label} href={item.href} className="transition-opacity hover:opacity-60">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-full border-2 border-black p-2 text-black md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/catalog"
              className="hidden rounded-full border-2 border-black bg-black px-4 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white transition-all hover:bg-white hover:text-black md:inline-flex md:px-5 md:py-2 md:text-xs"
            >
              CATALOG
            </Link>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] md:hidden ${isMenuOpen ? "" : "pointer-events-none"}`}>
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close menu overlay"
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[82%] max-w-[320px] border-r-[3px] border-black bg-[#f5f5f5] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b-[2px] border-black px-4 py-4">
            <span className={`${logoTextFont.className} text-[24px] text-black`}>Already Dead</span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full border-2 border-black p-1.5"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col">
            {categories.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-black/20 px-5 py-4 text-base font-medium text-black"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/catalog"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-black/20 px-5 py-4 text-base font-medium text-black"
            >
              Catalog
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
