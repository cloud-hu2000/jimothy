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
  title: "Jimothy Clicker – Play the Viral Raccoon Game Free",
  description: "Play Jimothy Clicker free: tap the viral raccoon, earn Trash Points, unlock upgrades and return to the Trash Dimension.",
  keywords: ["Jimothy Clicker", "viral raccoon game", "free clicker game", "raccoon clicker", "idle game"],
  openGraph: {
    title: "Jimothy Clicker – Play the Viral Raccoon Game Free",
    description: "Tap the viral raccoon, build a trash empire, and unlock the next dimension.",
    type: "website",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
