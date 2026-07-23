import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogList from "@/components/blog/BlogList";
import { posts, blogCategories } from "@/lib/blog";

const TITLE = "The Phi Movers blog";
const DESCRIPTION =
  "Practical moving guides, packing tips and London removal advice from Phi Movers — covering all 32 boroughs.";

export const metadata: Metadata = {
  title: `Blog — moving tips & London removal guides | Phi Movers`,
  description: DESCRIPTION,
  alternates: { canonical: "https://phimovers.co.uk/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://phimovers.co.uk/blog",
    type: "website",
  },
};

export default function BlogIndexPage({
  searchParams,
}: {
  searchParams?: { date?: string };
}) {
  const initialDate =
    typeof searchParams?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date)
      ? searchParams.date
      : undefined;

  return (
    <main>
      <Navbar />

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          <header className="max-w-2xl">
            <span className="inline-flex rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300]">
              Moving tips & guides
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content md:text-4xl">
              {TITLE}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {DESCRIPTION}
            </p>
          </header>

          <div className="mt-8">
            <BlogList
              posts={posts}
              categories={blogCategories}
              initialDate={initialDate}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
