import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/BlogSidebar";
import BlogToc from "@/components/blog/BlogToc";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";
import ShareRow from "@/components/blog/ShareRow";
import SoftImage from "@/components/SoftImage";
import { Icon } from "@/components/icons";
import {
  authors,
  blogCover,
  getPost,
  posts,
  relatedPosts,
} from "@/lib/blog";
import { getArticle } from "@/lib/blogArticles";

const SITE = "https://phimovers.co.uk";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article not found — Phi Movers" };
  const url = `${SITE}/blog/${post.slug}`;
  const cover = blogCover(post);
  return {
    title: `${post.title} — Phi Movers`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: cover, width: 1280, height: 640, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [cover],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const article = getArticle(post.slug);
  if (!article) notFound();

  const url = `${SITE}/blog/${post.slug}`;
  const cover = blogCover(post);
  const related = relatedPosts(post.slug);
  const author = authors[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [cover.startsWith("http") ? cover : `${SITE}${cover}`],
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: author.name,
      url: `${SITE}/author/${author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Phi Movers",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
  };

  return (
    <main>
      <ReadingProgress />
      <Navbar />
      <BackToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-8 md:py-12">
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
                {post.category}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <header>
                <Link
                  href="/blog"
                  className="inline-flex rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300] transition-colors hover:bg-[#86d957]"
                >
                  {post.category}
                </Link>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content md:text-4xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  <Link
                    href={`/author/${author.slug}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[#163300]"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-[#9fe870]/60"
                    />
                    <span className="font-semibold text-content">
                      {author.name}
                    </span>
                  </Link>
                  <Link
                    href={`/blog?date=${post.date}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-[#163300]"
                    title={`Published ${post.date}`}
                  >
                    <Icon name="calendar" className="h-4 w-4" />
                    <time dateTime={post.date}>{post.dateLabel}</time>
                  </Link>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="clock" className="h-4 w-4" />
                    {post.readMins} min read
                  </span>
                </div>
              </header>

              <SoftImage
                src={cover}
                alt={post.title}
                icon="box"
                className="mt-6 aspect-[2/1] w-full rounded-[24px]"
                imgClassName="mt-6 aspect-[2/1] w-full rounded-[24px] object-cover"
              />

              <div className="mt-5 border-y border-line py-3">
                <ShareRow url={url} title={post.title} />
              </div>

              <div className="mt-6 space-y-4">
                <BlogToc items={article.toc} />
                {article.body}

                <div className="border-t border-line pt-5">
                  <ShareRow url={url} title={post.title} />
                </div>

                <div className="mt-6 flex items-start gap-4 rounded-2xl border border-line bg-surface p-5">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#9fe870]/50"
                  />
                  <div>
                    <Link
                      href={`/author/${author.slug}`}
                      className="text-sm font-bold text-content transition-colors hover:text-[#163300]"
                    >
                      {author.name}
                    </Link>
                    <p className="text-xs font-semibold text-[#163300]">
                      {author.role}
                    </p>
                    <p className="mt-1 text-sm text-muted">{author.bio}</p>
                  </div>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              <BlogSidebar sticky />
            </div>
          </div>

          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-content">
                More from the blog
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#163300] hover:underline"
              >
                View all
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface"
                >
                  <SoftImage
                    src={blogCover(r)}
                    alt={r.title}
                    icon="box"
                    className="aspect-[16/9] w-full"
                    imgClassName="aspect-[16/9] w-full object-cover"
                  />
                  <div className="p-5">
                    <span className="inline-flex rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                      {r.category} · {r.readMins} min read
                    </span>
                    <h3 className="mt-3 text-base font-bold leading-snug text-content group-hover:text-[#163300]">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </main>
  );
}
