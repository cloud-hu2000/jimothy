import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jimothy.meme"),
  title: "Jimothy the Raccoon Meme Generator",
  description: "Create, download, and share original Jimothy the Raccoon memes with five transparent raccoon templates.",
  keywords: ["Jimothy the Raccoon", "Jimothy meme generator", "raccoon meme maker", "Jimothy memes"],
  openGraph: {
    title: "Jimothy the Raccoon Meme Generator",
    description: "Give Jimothy a line. Download your meme as a PNG.",
    type: "website",
    images: [{ url: "/og-world-v2.png", width: 1200, height: 630, alt: "Jimothy World: memes, quizzes, and clicker" }],
  },
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
        {children}
      </body>
    </html>
  );
}
