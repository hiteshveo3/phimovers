import Link from "next/link";
import { Icon } from "./icons";
import { CALL_HREF, CALL_LABEL, WHATSAPP_HREF } from "@/lib/contact";

export const ctaLabels: Record<number, string> = {
  1: "Forest panel",
  2: "Bright green panel",
  3: "Split left/right",
  4: "Full-bleed bold",
  5: "Cream + green accent",
  6: "Call-first",
  7: "Dark gradient glow",
  8: "Stat + CTA",
  9: "Minimal underline",
  10: "Boxed blobs",
};

const TITLE = "Ready to book your stress-free move?";
const SUB =
  "Start your free quote in under a minute — we usually reply within about one working hour. No obligation, no hidden fees.";
const PHONE_LABEL = CALL_LABEL;

// Button colour schemes for the bright-green panel (variant 2)
export const ctaButtonLabels: Record<number, string> = {
  1: "Forest + glass",
  2: "Black solid + outline",
  3: "White solid + outline",
  4: "Forest + white solid",
  5: "Black + white solid",
  6: "Forest + ghost link",
  7: "White + forest solid",
  8: "Forest + soft tint",
  9: "Black (green text) + outline",
  10: "Forest gradient + glass",
};

export function ctaButtons(n: number): { primary: string; secondary: string } {
  switch (n) {
    case 2:
      return {
        primary: "bg-black text-white hover:bg-black/85",
        secondary: "border border-black/25 text-black hover:bg-black/10",
      };
    case 3:
      return {
        primary: "bg-white text-[#163300] hover:bg-white/90",
        secondary: "border border-[#163300]/25 text-[#163300] hover:bg-white/40",
      };
    case 4:
      return {
        primary: "bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]",
        secondary: "bg-white text-[#163300] hover:bg-white/90",
      };
    case 5:
      return {
        primary: "bg-black text-white hover:bg-black/85",
        secondary: "bg-white text-[#163300] hover:bg-white/90",
      };
    case 6:
      return {
        primary: "bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]",
        secondary:
          "text-[#163300] underline underline-offset-4 hover:opacity-70",
      };
    case 7:
      return {
        primary: "bg-white text-[#163300] hover:bg-white/90",
        secondary: "bg-[#163300] text-white hover:bg-[#0e2400]",
      };
    case 8:
      return {
        primary: "bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]",
        secondary: "bg-[#163300]/10 text-[#163300] hover:bg-[#163300]/20",
      };
    case 9:
      return {
        primary: "bg-black text-[#9fe870] hover:bg-black/85",
        secondary: "border border-black/25 text-black hover:bg-black/10",
      };
    case 10:
      return {
        primary:
          "bg-gradient-to-r from-[#163300] to-[#1e4600] text-[#9fe870] hover:opacity-90",
        secondary:
          "bg-white/20 text-[#163300] backdrop-blur-sm hover:bg-white/40",
      };
    case 1:
    default:
      return {
        primary: "bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]",
        secondary:
          "bg-white/30 text-[#163300] backdrop-blur-sm hover:bg-white/45",
      };
  }
}

function Cta({ variant = 1, btn = 1 }: { variant?: number; btn?: number }) {
  const b = ctaButtons(btn);
  switch (variant) {
    /* 2 — Bright green panel, dark text */
    case 2:
      return (
        <section className="container-page">
          <div className="rounded-[28px] bg-[#9fe870] px-6 py-14 text-center text-[#163300] md:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              {TITLE}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#163300]/80">
              {SUB}
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="/contact#quote"
                className={"btn w-full px-6 sm:w-auto " + b.primary}
              >
                Get my free quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </a>
              <a
                href={CALL_HREF}
                className={"btn w-full px-6 sm:w-auto " + b.secondary}
              >
                <Icon name="phone" className="h-4 w-4" />
                {PHONE_LABEL}
              </a>
            </div>
          </div>
        </section>
      );

    /* 3 — Split: text left, action card right (forest) */
    case 3:
      return (
        <section className="container-page">
          <div className="grid items-center gap-8 rounded-[28px] bg-[#163300] px-6 py-12 md:grid-cols-2 md:px-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {TITLE}
              </h2>
              <p className="mt-4 max-w-md text-sm text-white/70">{SUB}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-[#9fe870]">
                Start in under a minute
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href={WHATSAPP_HREF} className="btn-accent w-full px-6">
                  Get my free quote
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <a
                  href={CALL_HREF}
                  className="btn w-full border border-white/20 px-6 text-white hover:bg-white/10"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  Call {PHONE_LABEL}
                </a>
              </div>
            </div>
          </div>
        </section>
      );

    /* 4 — Full-bleed bold forest band */
    case 4:
      return (
        <section className="bg-[#163300]">
          <div className="container-page py-20 text-center">
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
              Your next move starts{" "}
              <span className="text-[#9fe870]">here.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-white/70 md:text-base">
              {SUB}
            </p>
            <Link
              href={WHATSAPP_HREF}
              className="btn-accent mx-auto mt-8 px-8 py-4 text-base"
            >
              Get my free quote
              <Icon name="arrowRight" className="h-5 w-5" />
            </Link>
          </div>
        </section>
      );

    /* 5 — Cream card with green accent border */
    case 5:
      return (
        <section className="container-page">
          <div className="rounded-[28px] border-2 border-[#9fe870] bg-cream px-6 py-14 text-center md:px-12">
            <span className="chip border-[#163300]/15 bg-[#9fe870]/25 text-[#163300]">
              Free survey & quote
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-content md:text-4xl">
              {TITLE}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted">{SUB}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={WHATSAPP_HREF} className="btn-accent px-6">
                Get my free quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={CALL_HREF} className="btn-light px-6">
                <Icon name="phone" className="h-4 w-4" />
                {PHONE_LABEL}
              </a>
            </div>
          </div>
        </section>
      );

    /* 6 — Call-first, phone is the hero */
    case 6:
      return (
        <section className="container-page">
          <div className="flex flex-col items-center gap-6 rounded-[28px] bg-[#163300] px-6 py-14 text-center md:flex-row md:justify-between md:px-12 md:text-left">
            <div>
              <p className="text-sm font-semibold text-[#9fe870]">
                Talk to a real mover
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Call us for an instant quote
              </h2>
            </div>
            <a
              href={CALL_HREF}
              className="group flex items-center gap-4 rounded-2xl bg-[#9fe870] px-7 py-5 text-[#163300] transition-transform hover:scale-[1.02]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#163300] text-[#9fe870]">
                <Icon name="phone" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#163300]/70">
                  Free phone line
                </span>
                <span className="block text-2xl font-extrabold">
                  {PHONE_LABEL}
                </span>
              </span>
            </a>
          </div>
        </section>
      );

    /* 7 — Dark gradient with glow blobs */
    case 7:
      return (
        <section className="container-page">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1e4600] via-[#163300] to-[#081b00] px-6 py-16 text-center md:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#9fe870]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 -z-10 h-72 w-72 rounded-full bg-[#9fe870]/15 blur-3xl"
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              {TITLE}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">{SUB}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={WHATSAPP_HREF} className="btn-accent px-6">
                Get my free quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a
                href={CALL_HREF}
                className="btn border border-white/20 px-6 text-white hover:bg-white/10"
              >
                <Icon name="phone" className="h-4 w-4" />
                {PHONE_LABEL}
              </a>
            </div>
          </div>
        </section>
      );

    /* 8 — Stat + CTA */
    case 8:
      return (
        <section className="container-page">
          <div className="grid items-center gap-8 rounded-[28px] bg-[#9fe870] px-6 py-12 text-[#163300] md:grid-cols-[1.2fr_1fr] md:px-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {TITLE}
              </h2>
              <p className="mt-4 max-w-md text-sm text-[#163300]/80">{SUB}</p>
              <Link
                href={WHATSAPP_HREF}
                className="btn mt-7 bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400]"
              >
                Get my free quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-[#163300]/15 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              {[
                ["12k+", "Moves done"],
                ["4.9", "Avg rating"],
                ["100%", "Insured"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold">{n}</div>
                  <div className="mt-1 text-xs text-[#163300]/70">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    /* 9 — Minimal, underline accent */
    case 9:
      return (
        <section className="section">
          <div className="container-page text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-content md:text-4xl">
              Ready to book your{" "}
              <span className="relative whitespace-nowrap">
                stress-free move
                <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#9fe870]" />
              </span>
              ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted">{SUB}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={WHATSAPP_HREF} className="btn-accent px-6">
                Get my free quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={CALL_HREF} className="btn-light px-6">
                <Icon name="phone" className="h-4 w-4" />
                {PHONE_LABEL}
              </a>
            </div>
          </div>
        </section>
      );

    /* 10 — Boxed bright green with blobs + rounded corners */
    case 10:
      return (
        <section className="container-page">
          <div className="relative isolate overflow-hidden rounded-[32px] bg-[#9fe870] px-6 py-16 text-center text-[#163300] md:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-white/50 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-16 -z-10 h-64 w-64 rounded-full bg-[#163300]/15 blur-3xl"
            />
            <span className="inline-flex items-center gap-2 rounded-pill bg-[#163300] px-4 py-1.5 text-xs font-bold text-[#9fe870]">
              <Icon name="mapPin" className="h-3.5 w-3.5" />
              Covering all 32 London boroughs
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              {TITLE}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#163300]/80">
              {SUB}
            </p>
            <Link
              href={WHATSAPP_HREF}
              className="btn mx-auto mt-8 bg-[#163300] px-8 py-4 text-base text-[#9fe870] hover:bg-[#0e2400]"
            >
              Get my free quote
              <Icon name="arrowRight" className="h-5 w-5" />
            </Link>
          </div>
        </section>
      );

    /* 1 — Forest panel (default) */
    case 1:
    default:
      return (
        <section className="container-page">
          <div className="rounded-[28px] bg-[#163300] px-6 py-14 text-center md:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              {TITLE}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">{SUB}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={WHATSAPP_HREF} className="btn-accent px-6">
                Get my free quote
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a
                href={CALL_HREF}
                className="btn border border-white/20 px-6 text-white hover:bg-white/10"
              >
                <Icon name="phone" className="h-4 w-4" />
                {PHONE_LABEL}
              </a>
            </div>
          </div>
        </section>
      );
  }
}

export default Cta;
