import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://burabih.org";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/zrak/sarajevo", changefreq: "daily", priority: "0.9" },
          { path: "/zrak/zenica", changefreq: "daily", priority: "0.9" },
          { path: "/zrak/tuzla", changefreq: "daily", priority: "0.9" },
          { path: "/zrak/mostar", changefreq: "daily", priority: "0.9" },
          { path: "/zrak/banja-luka", changefreq: "daily", priority: "0.9" },
          { path: "/vizija", changefreq: "monthly", priority: "0.8" },
          { path: "/skole", changefreq: "monthly", priority: "0.8" },
          { path: "/partner", changefreq: "monthly", priority: "0.7" },
          { path: "/en/partner", changefreq: "monthly", priority: "0.6" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
