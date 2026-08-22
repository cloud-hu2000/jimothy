/**
 * Shared SEO primitives: canonical URLs, Open Graph defaults, and JSON-LD builders.
 *
 * Every route imports its canonical and structured data from here so that the
 * rendered HTML, the sitemap, and the schema graph can never drift apart.
 */

export const siteUrl = "https://jimothy.meme";
export const siteName = "Jimothy World";

/** Intrinsic size of the shared social card in public/og-world-v2.png. */
export const defaultOgImage = {
  url: "/og-world-v2.png",
  width: 1731,
  height: 909,
  alt: "Jimothy World: the raccoon meme generator, personality quiz, and clicker game",
} as const;

/**
 * Intrinsic pixel sizes of every raster asset referenced by an <img> tag, so
 * markup can declare width/height and the browser can reserve space before the
 * bytes arrive. Regenerate with `node tools/png-size.mjs`.
 */
export const assetSizes: Record<string, { width: number; height: number }> = {
  "/assets/clicker-alley-night-v2.png": { width: 1672, height: 941 },
  "/assets/jimothy-bowtie.png": { width: 1254, height: 1254 },
  "/assets/jimothy-crown.png": { width: 1254, height: 1254 },
  "/assets/jimothy-headphones.png": { width: 1254, height: 1254 },
  "/assets/jimothy-party.png": { width: 1254, height: 1254 },
  "/assets/jimothy-raccoon-cropped.png": { width: 1158, height: 912 },
  "/assets/jimothy-raccoon.png": { width: 1254, height: 1254 },
  "/assets/jimothy-saint-transparent.png": { width: 1254, height: 1254 },
  "/assets/jimothy-saint.png": { width: 1254, height: 1254 },
  "/assets/jimothy-sleepy-transparent.png": { width: 1254, height: 1254 },
  "/assets/jimothy-sleepy.png": { width: 1254, height: 1254 },
  "/assets/jimothy-summer-transparent.png": { width: 1254, height: 1254 },
  "/assets/jimothy-summer.png": { width: 1254, height: 1254 },
  "/assets/jimothy-sunglasses.png": { width: 1254, height: 1254 },
  "/favicon-raccoon.png": { width: 256, height: 256 },
  "/og-meme-generator.png": { width: 1730, height: 909 },
  "/og-world-v2.png": { width: 1731, height: 909 },
  "/og-world.png": { width: 1729, height: 910 },
  "/og.png": { width: 1731, height: 909 },
};

/** Intrinsic size for a public asset path, or undefined for unknown paths. */
export function assetSize(src: string) {
  return assetSizes[src];
}

type OgImageInput = { url?: string; alt?: string };

/**
 * An Open Graph image entry whose declared width/height match the file on disk.
 * Hardcoding 1200x630 here would misreport every card, since the real cards are
 * 1731x909.
 */
export function ogImage({ url = defaultOgImage.url, alt = defaultOgImage.alt }: OgImageInput = {}) {
  const size = assetSizes[url];
  return { url, alt, ...(size ? { width: size.width, height: size.height } : {}) };
}

/** Joins a site-relative path onto the production origin, stripping any query string. */
export function absoluteUrl(path = "/") {
  const [pathname] = path.split(/[?#]/);
  if (pathname === "/" || pathname === "") return siteUrl;
  return `${siteUrl}/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

/** The publisher node every other schema node points at via @id. */
export const organizationSchema = {
  "@type": "Organization",
  "@id": organizationId,
  name: siteName,
  url: siteUrl,
  description:
    "A fan-made collection of Jimothy the Raccoon tools: a meme generator, a personality quiz, and a clicker game.",
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/favicon-raccoon.png"),
    width: 256,
    height: 256,
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": websiteId,
  name: siteName,
  alternateName: "Jimothy the Raccoon",
  url: siteUrl,
  inLanguage: "en",
  publisher: { "@id": organizationId },
};

/** Wraps nodes in a single @graph document so one script tag can carry the page's schema. */
export function schemaGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export { organizationId, websiteId };

type WebPageInput = {
  path: string;
  name: string;
  description: string;
  /** Set for the schema types that carry their own primary entity (Quiz, VideoGame, ...). */
  type?: string;
};

/** A WebPage node bound to the site's WebSite and Organization nodes. */
export function webPageSchema({ path, name, description, type = "WebPage" }: WebPageInput) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(defaultOgImage.url),
    },
  };
}

/** BreadcrumbList for a trail of [name, path] pairs, starting at the home page. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(trail[trail.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

type AppInput = {
  path: string;
  name: string;
  description: string;
  category: string;
  /** "WebApplication" for tools, "VideoGame" for the clicker. */
  type?: string;
  /** Only the canvas-backed pages should claim a canvas requirement. */
  browserRequirements?: string;
};

/** A free, browser-based app or game node. */
export function webApplicationSchema({
  path,
  name,
  description,
  category,
  type = "WebApplication",
  browserRequirements = "Requires JavaScript.",
}: AppInput) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#app`,
    name,
    url: absoluteUrl(path),
    description,
    applicationCategory: category,
    operatingSystem: "Any (web browser)",
    browserRequirements,
    isAccessibleForFree: true,
    inLanguage: "en",
    publisher: { "@id": organizationId },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

/** Article node for the lore pages, tied to the shared publisher. */
export function articleSchema({
  path,
  headline,
  description,
  images,
  datePublished,
  dateModified,
}: {
  path: string;
  headline: string;
  description: string;
  images: string[];
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline,
    description,
    inLanguage: "en",
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    mainEntityOfPage: { "@id": `${absoluteUrl(path)}#webpage` },
    image: images.map((image) => absoluteUrl(image)),
    author: { "@id": organizationId },
    publisher: { "@id": organizationId },
  };
}

/** FAQPage node; only emit this when the questions are genuinely visible on the page. */
export function faqSchema(path: string, faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

type PageMetaInput = {
  /** Site-relative route; becomes the query-free canonical. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  /** Social-card overrides; defaults to the shared Jimothy World card. */
  image?: OgImageInput;
  /** Social-card copy, when it should read differently from the page title. */
  socialTitle?: string;
  socialDescription?: string;
  ogType?: "website" | "article";
};

/**
 * Title, description, canonical, Open Graph, and Twitter metadata from one call.
 *
 * The canonical is always the query-free route. That matters most on `/`, which
 * accepts `?template=&top=&bottom=&size=&background=` share links: without a
 * canonical every shared meme would be an indexable duplicate of the home page.
 */
export function pageMetadata({
  path,
  title,
  description,
  keywords,
  image,
  socialTitle = title,
  socialDescription = description,
  ogType = "website",
}: PageMetaInput) {
  const card = ogImage(image);
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      type: ogType,
      url: absoluteUrl(path),
      siteName,
      images: [card],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: socialTitle,
      description: socialDescription,
      images: [card.url],
    },
  };
}
