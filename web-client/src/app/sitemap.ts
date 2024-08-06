import { MetadataRoute } from "next";

export async function generateSitemaps() {
  const totalUrls = 50;
  const urlsPerSitemap = 10;
  const numberOfSitemaps = Math.ceil(totalUrls / urlsPerSitemap);

  return Array.from({ length: numberOfSitemaps }, (_, index) => ({
    id: index,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  try {
    const urlsPerSitemap = 10;
    const start = id * urlsPerSitemap;
    const end = start + urlsPerSitemap;

    const sitemapBase: MetadataRoute.Sitemap =
      id === 0
        ? [
            {
              url: `https://mywesite.com.br`,
              lastModified: new Date().toISOString(),
            },
          ]
        : [];

    return [...sitemapBase];
  } catch (error) {
    console.error("Error in sitemap generation:", error);
    throw error;
  }
}
