import sitemap from "../app/sitemap";
import * as fs from "fs";
import * as path from "path";

const entries = sitemap();
console.log(`Total URLs in Sitemap: ${entries.length}`);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const entry of entries) {
  xml += `  <url>\n`;
  xml += `    <loc>${entry.url}</loc>\n`;
  if (entry.lastModified) {
    const d = entry.lastModified instanceof Date ? entry.lastModified.toISOString().split("T")[0] : entry.lastModified;
    xml += `    <lastmod>${d}</lastmod>\n`;
  }
  if (entry.changeFrequency) {
    xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
  }
  if (entry.priority !== undefined) {
    xml += `    <priority>${entry.priority.toFixed(2)}</priority>\n`;
  }
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

const outPath = path.join(process.cwd(), "public", "sitemap.xml");
fs.writeFileSync(outPath, xml, "utf-8");
console.log(`Successfully generated public/sitemap.xml (${(xml.length / 1024).toFixed(1)} KB)`);
