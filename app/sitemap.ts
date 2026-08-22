import type { MetadataRoute } from "next";
import { resultList } from "../lib/jimothy-results";
import { blogPosts } from "../lib/blog";
import { absoluteUrl } from "../lib/seo";
import { jimothyPages } from "./jimothy-pages";

/**
 * Every indexable URL, exactly once, with no query strings. Share links such as
 * `/?template=crown&top=...` are deliberately absent: they are the same page as
 * `/`, which is why each route also declares a query-free canonical.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/quiz"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/clicker"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...jimothyPages.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...resultList.map((result) => ({
      url: absoluteUrl(`/results/${result.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
