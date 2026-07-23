import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import { Icon } from "@/components/icons";
import { COMPANY, legalDocs, legalNav } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Legal & Policies — ${COMPANY.tradingName}`,
  description:
    "Privacy Policy, Cookie Policy, Terms & Conditions, Complaints Procedure and Accessibility Statement for Phi Movers.",
  alternates: { canonical: `${COMPANY.site}/legal` },
};

export default function LegalHub() {
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
                Legal
              </li>
            </ol>
          </nav>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-content md:text-5xl">
            Legal &amp; policies
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            Everything about how we work, protect your data and put things
            right. If you can&apos;t find what you need, our team is one call
            away.
          </p>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {legalNav.map((l) => {
              const doc = legalDocs[l.slug];
              return (
                <Link
                  key={l.slug}
                  href={`/${l.slug}`}
                  className="group flex flex-col rounded-[24px] border border-line bg-surface p-6 transition-shadow hover:shadow-soft"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#9fe870]">
                    <Icon name={l.icon} className="h-6 w-6 text-[#163300]" size={24} />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-content group-hover:text-[#163300]">
                    {doc.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {doc.subtitle}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
                    Read
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 rounded-[24px] border border-line bg-surface p-6 text-sm text-muted md:p-8">
            <p className="font-bold text-content">{COMPANY.legalName}</p>
            <p className="mt-2">{COMPANY.address}</p>
            {(COMPANY.companyNo || COMPANY.vatNo) && (
              <p className="mt-1">
                {[
                  COMPANY.companyNo ? `Company No. ${COMPANY.companyNo}` : null,
                  COMPANY.vatNo ? `VAT ${COMPANY.vatNo}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <p className="mt-1">
              <a
                href={`mailto:${COMPANY.emailGeneral}`}
                className="font-semibold text-[#163300] hover:underline"
              >
                {COMPANY.emailGeneral}
              </a>{" "}
              ·{" "}
              <a
                href={COMPANY.phoneHref}
                className="font-semibold text-[#163300] hover:underline"
              >
                {COMPANY.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
