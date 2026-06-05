import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      "https://megadevs.vercel.app/sitemap.xml",
      "https://www.megadevs.site/sitemap.xml",
    ],
  };
}
