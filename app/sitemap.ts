import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://megadevs.vercel.app/",
      lastModified: new Date(),
    },
    {
      url: "https://www.megadevs.site/",
      lastModified: new Date(),
    },
  ];
}
