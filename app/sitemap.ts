import { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://www.megadevs.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/new-era", "/works", "/history", "/palestine"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));
}
