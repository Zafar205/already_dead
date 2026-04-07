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
            <h4 className="text-sm font-bold tracking-wider">FOLLOW + SUPPORT</h4>
            <p className="mt-3 text-sm text-black/65">
              Connect with Dark Phantom on social and reach support directly.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
              <a
                href="https://x.com/DRKPhantom2013"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-black px-3 py-2 transition-colors hover:bg-black hover:text-white"
              >
                X / Twitter
              </a>
              <a
                href="https://www.instagram.com/darkphantom2013/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-black px-3 py-2 transition-colors hover:bg-black hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://www.threads.com/@darkphantom2013?xmt=AQF0yGRwTZF-J6Zv4-MvxBEk5hDVdYuvja_MMm8MmBD_rMs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-black px-3 py-2 transition-colors hover:bg-black hover:text-white"
              >
                Threads
              </a>
              <a
                href="https://discord.gg/JhwDQMBcXE"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-black px-3 py-2 transition-colors hover:bg-black hover:text-white"
              >
                Discord Server
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
