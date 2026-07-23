import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import BackToTop from "@/components/blog/BackToTop";
import { Icon } from "@/components/icons";
import {
  COMPANY,
  legalNav,
  type LegalBlock,
  type LegalDoc,
} from "@/lib/legal";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="mt-6 text-base font-bold text-content">{block.text}</h3>
      );
    case "ul":
      return (
        <ul className="mt-3 space-y-2.5">
          {block.items.map((it) => (
            <li key={it} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#9fe870]/25 text-[#163300]">
                <Icon name="check" className="h-3.5 w-3.5" size={14} strokeWidth={2.4} />
              </span>
              <span
                className="text-[15px] leading-relaxed text-content/80"
                dangerouslySetInnerHTML={{ __html: it }}
              />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#163300]/10 bg-[#9fe870]/25 p-4">
          <Icon
            name="info"
            className="mt-0.5 h-5 w-5 shrink-0 text-[#163300]"
          />
          <p
            className="text-[15px] leading-relaxed text-[#163300]"
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
        </div>
      );
    case "p":
    default:
      return (
        <p
          className="mt-3 text-[15px] leading-relaxed text-content/80"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      );
  }
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main>
      <Navbar />
      <BackToTop />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#163300]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/legal" className="hover:text-[#163300]">
                  Legal
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-content" aria-current="page">
                {doc.title}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#9fe870]">
              <Icon name={doc.icon} className="h-6 w-6 text-[#163300]" size={26} />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-content md:text-4xl">
                {doc.title}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-muted">
                {doc.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3 py-1 font-semibold text-content">
              <Icon name="calendar" className="h-3.5 w-3.5 text-[#163300]" />
              Last updated: {doc.updated}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3 py-1 font-semibold text-content">
              <Icon name="shield" className="h-3.5 w-3.5 text-[#163300]" />
              {COMPANY.legalName}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
            {/* TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-[84px]">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  On this page
                </p>
                <nav className="mt-4 space-y-1">
                  {doc.sections.map((s, i) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-content/70 transition-colors hover:bg-[#9fe870]/20 hover:text-content"
                    >
                      <span className="text-[#163300]">{i + 1}.</span> {s.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
                  <p className="text-sm font-bold text-content">
                    Questions?
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Contact our team about this policy.
                  </p>
                  <a
                    href={`mailto:${COMPANY.emailPrivacy}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#163300] hover:underline"
                  >
                    <Icon name="mail" className="h-4 w-4" />
                    {COMPANY.emailPrivacy}
                  </a>
                </div>
              </div>
            </aside>

            {/* Article */}
            <article>
              <div className="rounded-[24px] border border-line bg-surface p-6 md:p-9">
                {doc.sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className={
                      "scroll-mt-24 " +
                      (i > 0 ? "mt-10 border-t border-line pt-8" : "")
                    }
                  >
                    <h2 className="flex items-baseline gap-2 text-xl font-bold tracking-tight text-content md:text-2xl">
                      <span className="text-[#163300]">{i + 1}.</span>
                      {s.title}
                    </h2>
                    {s.blocks.map((b, j) => (
                      <Block key={j} block={b} />
                    ))}
                  </section>
                ))}
              </div>

              {/* Contact callout */}
              <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-[#163300] p-6 text-white sm:flex-row sm:items-center md:p-8">
                <div>
                  <p className="text-lg font-extrabold text-[#9fe870]">
                    Need to talk to a human?
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Our London team is happy to help with any questions about
                    this policy or your move.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <a
                    href={`mailto:${COMPANY.emailGeneral}`}
                    className="btn justify-center bg-[#9fe870] px-6 text-[#163300] hover:bg-[#86d957]"
                  >
                    <Icon name="mail" className="h-4 w-4" />
                    Email us
                  </a>
                  <a
                    href={COMPANY.phoneHref}
                    className="btn justify-center bg-white/10 px-6 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    {COMPANY.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Related policies */}
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  More legal pages
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {legalNav
                    .filter((l) => l.slug !== doc.slug)
                    .map((l) => (
                      <Link
                        key={l.slug}
                        href={`/${l.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-medium text-content transition-colors hover:border-[#9fe870] hover:text-[#163300]"
                      >
                        <Icon name={l.icon} className="h-4 w-4 text-[#163300]" />
                        {l.label}
                      </Link>
                    ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
