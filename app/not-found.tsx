import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found — Phi Movers",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div className="bg-[#f4f5f2]">
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-[#163300]">
            404
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-content md:text-4xl">
            Page not found
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted">
            That link may be old or mistyped. Try one of these instead — or get
            a fixed quote on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="btn border border-line bg-surface px-4 py-2 text-sm text-content hover:bg-[#9fe870]/25"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact#quote"
              className="btn bg-[#9fe870] px-4 py-2 text-sm text-[#163300] hover:bg-[#86d957]"
            >
              Get a quote
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
