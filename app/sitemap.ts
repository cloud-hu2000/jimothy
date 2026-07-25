import type { MetadataRoute } from "next";
import { jimothyPages } from "./jimothy-pages";

const baseUrl = "https://jimothy.meme";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/quiz`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/clicker`, changeFrequency: "monthly", priority: 0.7 },
    ...jimothyPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
