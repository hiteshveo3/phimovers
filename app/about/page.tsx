import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import Cta from "@/components/Cta";
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
  title: "About Phi Movers — London Removals Team",
  description:
    "Meet Phi Movers — a London-only removals company covering all 32 boroughs with fixed-price quotes, insured crews and stress-free moving days.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const values = [
  {
    title: "Fixed prices, no surprises",
    text: "You agree the quote before moving day — goods-in-transit and liability cover included as standard.",
  },
  {
    title: "London specialists only",
    text: "We know the boroughs, permits, stairs and loading bays — we don’t stretch outside the capital.",
  },
  {
    title: "Friendly, vetted crews",
    text: "Uniformed movers who protect floors, doors and furniture, then leave your new place ready to live in.",
  },
];

export default function AboutPage() {
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
                About
              </li>
            </ol>
          </nav>

          <span className="mt-6 inline-flex rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300]">
            London-only removals
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-content md:text-5xl">
            Stress-free moves across every London borough
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            Phi Movers is a local removals company built for London living —
            flats, houses, offices and single items. We quote clearly on
            WhatsApp or by phone, turn up on time, and treat your home with care.
          </p>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
                  <Icon name="check" className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-bold text-content">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 rounded-2xl border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="text-2xl font-extrabold text-content">
                How we work
              </h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <li>
                  <span className="font-semibold text-content">1. Tell us the job</span>{" "}
                  — addresses, rooms or photos on WhatsApp.
                </li>
                <li>
                  <span className="font-semibold text-content">2. Get a fixed quote</span>{" "}
                  — usually within about one working hour.
                </li>
                <li>
                  <span className="font-semibold text-content">3. We move you</span>{" "}
                  — insured crew, careful loading, clear communication.
                </li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-content">
                Talk to us
              </h2>
              <p className="mt-3 text-sm text-muted">
                Prefer a quick chat? WhatsApp, call or email — one inbox for the
                whole team.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn justify-center bg-[#9fe870] text-[#163300] hover:bg-[#86d957]"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={CALL_HREF}
                  className="btn justify-center border border-[#163300]/30 bg-transparent text-[#163300]"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {CALL_LABEL}
                </a>
                <a
                  href={EMAIL_HREF}
                  className="btn justify-center border border-line bg-cream text-[#163300]"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <Cta variant={2} btn={1} />
      </div>

      <Footer />
    </main>
  );
}
