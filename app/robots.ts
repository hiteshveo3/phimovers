import type { MetadataRoute } from "next";

const SITE = "https://phimovers.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/client", "/client/"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
