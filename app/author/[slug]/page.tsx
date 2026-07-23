import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Icon } from "@/components/icons";
import { img } from "@/lib/data";
import { authors, getAuthor, postsByAuthor } from "@/lib/blog";

const SITE = "https://phimovers.co.uk";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const author = getAuthor(params.slug);
  if (!author) return { title: "Author not found — Phi Movers" };
  return {
    title: `${author.name} — ${author.role} | Phi Movers`,
    description: author.bio,
    alternates: { canonical: `${SITE}/author/${author.slug}` },
  };
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthor(params.slug);
  if (!author) notFound();

  const authorPosts = postsByAuthor(author.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE}/author/${author.slug}`,
  };

  return (
    <main>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#163300]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-[#163300]">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-content" aria-current="page">
                {author.name}
              </li>
            </ol>
          </nav>

          {/* Author header */}
          <header className="mt-6 flex flex-col gap-6 rounded-[24px] border border-line bg-surface p-6 sm:flex-row sm:items-center md:p-8">
            <img
              src={author.avatar}
              alt={author.name}
              className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-[#9fe870]/50"
            />
            <div className="flex-1">
              <span className="inline-flex rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                {author.role}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-content md:text-3xl">
                {author.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {author.bio}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="box" className="h-4 w-4 text-[#163300]" />
                  {authorPosts.length} articles
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mapPin" className="h-4 w-4 text-[#163300]" />
                  All 32 London boroughs
                </span>
                <Link
                  href="/pricing"
                  className="btn h-9 bg-[#9fe870] px-4 text-[#163300] hover:bg-[#86d957]"
                >
                  Get a quote
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>

          {/* Posts */}
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-content">
              Articles by {author.name}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-soft"
                >
                  <img
                    src={img(p.coverSeed, 600, 360)}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="inline-flex w-fit rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                      {p.category} · {p.readMins} min read
                    </span>
                    <h3 className="mt-3 text-base font-bold leading-snug text-content group-hover:text-[#163300]">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
                      Read article
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
