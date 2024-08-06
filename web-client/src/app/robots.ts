import { MetadataRoute } from "next";
import { generateSitemaps } from "./sitemap";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const getSubsetSitemap = await generateSitemaps();
  const sitemapUrls = getSubsetSitemap.map(
    ({ id }) => `https://mywesite.com/sitemap/${id}.xml`,
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrls,
  };
}
