import type { Metadata } from "next";
import JimothyWorldNav from "../jimothy-world-nav";

export const metadata: Metadata = {
  title: "Jimothy Clicker – Play the Viral Raccoon Game Free",
  description: "Tap Jimothy the raccoon, earn Trash Points, unlock auto dumpsters, and return to the Trash Dimension.",
};

export default function ClickerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><JimothyWorldNav active="clicker" />{children}</>;
}
