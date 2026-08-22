import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  organizationSchema,
  pageMetadata,
  schemaGraph,
  siteUrl,
  websiteSchema,
} from "../lib/seo";
import JsonLd from "./json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The home route's metadata lives here because app/page.tsx is a client
 * component and cannot export `metadata`. Child routes override every field
 * they care about, including the canonical.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({
    path: "/",
    title: "Jimothy the Raccoon Meme Generator",
    description:
      "Create, download, and share original Jimothy the Raccoon memes with five transparent raccoon templates.",
    keywords: ["Jimothy the Raccoon", "Jimothy meme generator", "raccoon meme maker", "Jimothy memes"],
    socialDescription: "Give Jimothy a line. Download your meme as a PNG.",
  }),
  icons: {
    icon: "/favicon-raccoon.png",
    shortcut: "/favicon-raccoon.png",
    apple: "/favicon-raccoon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(s){s.dataset.zone='11376179',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))",
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Site-wide publisher identity. Route-level graphs reference these by @id. */}
        <JsonLd schema={schemaGraph(websiteSchema, organizationSchema)} />
        {children}
      </body>
    </html>
  );
}
