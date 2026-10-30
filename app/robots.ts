import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Private areas stay out of search; everything else is open, including to AI crawlers.
// "/auth/" keeps its slash so it does not also block /author pages.
const PRIVATE = ["/admin", "/client", "/track", "/auth/", "/api/", "/_next/data/"];
const AI_CRAWLERS = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "Google-Extended", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
