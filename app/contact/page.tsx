import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import { Icon } from "@/components/icons";
import {
  CALL_HREF,
  CALL_LABEL,
  EMAIL,
  EMAIL_HREF,
  SITE_URL,
  WHATSAPP_HREF,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Phi Movers — WhatsApp, Call or Email",
  description:
    "Contact Phi Movers for a fixed-price London removals quote. WhatsApp, phone or email info@phimovers.co.uk — we usually reply within about one working hour.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

const channels = [
  {
    title: "WhatsApp",
    text: "Send addresses and a few photos — fastest way to get a fixed quote.",
    href: WHATSAPP_HREF,
    label: "Message us",
    icon: "whatsapp" as const,
    external: true,
    primary: true,
  },
  {
    title: "Phone",
    text: "Prefer to talk it through? We’re happy to help over a quick call.",
    href: CALL_HREF,
    label: CALL_LABEL,
    icon: "phone" as const,
    external: false,
    primary: false,
  },
  {
    title: "Email",
    text: "One inbox for quotes, bookings and support — we read every message.",
    href: EMAIL_HREF,
    label: EMAIL,
    icon: "mail" as const,
    external: false,
    primary: false,
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#163300]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-content" aria-current="page">
                Contact
              </li>
            </ol>
          </nav>

          <span className="mt-6 inline-flex rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300]">
            Usually reply within ~1 hour
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-content md:text-5xl">
            Contact Phi Movers
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            Get a fixed-price quote for house removals, man &amp; van, sofa
            delivery or office moves across all 32 London boroughs.
          </p>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className={
                  "flex flex-col rounded-2xl border border-line p-6 transition-colors hover:bg-cream " +
                  (c.primary ? "bg-[#9fe870] text-[#163300]" : "bg-surface")
                }
              >
                <span
                  className={
                    "grid h-11 w-11 place-items-center rounded-xl " +
                    (c.primary
                      ? "bg-[#163300] text-[#9fe870]"
                      : "bg-[#9fe870] text-[#163300]")
                  }
                >
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-bold">{c.title}</h2>
                <p
                  className={
                    "mt-2 flex-1 text-sm leading-relaxed " +
                    (c.primary ? "text-[#163300]/75" : "text-muted")
                  }
                >
                  {c.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold">
                  {c.label}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-surface p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-content">
              What to include for a faster quote
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
              {[
                "Pick-up and drop-off postcodes",
                "Property type and floor / lift access",
                "Rough inventory or room photos",
                "Preferred date or flexibility window",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Icon
                    name="check"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#163300]"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
