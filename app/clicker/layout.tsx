import type { Metadata } from "next";
import { pageMetadata, schemaGraph, webApplicationSchema, webPageSchema } from "../../lib/seo";
import JimothyWorldNav from "../jimothy-world-nav";
import JsonLd from "../json-ld";

export const metadata: Metadata = pageMetadata({
  path: "/clicker",
  title: "Jimothy Clicker – Play the Viral Raccoon Game Free",
  description: "Tap Jimothy the raccoon, earn Trash Points, unlock auto dumpsters, and return to the Trash Dimension.",
});

export default function ClickerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>
    <JsonLd schema={schemaGraph(
      webPageSchema({ path: "/clicker", name: "Jimothy Clicker", description: "A free browser-based Jimothy raccoon clicker game." }),
      webApplicationSchema({ path: "/clicker", name: "Jimothy Clicker", description: "Tap Jimothy, earn Trash Points, and grow a trash empire.", category: "GameApplication", type: "VideoGame", browserRequirements: "Requires JavaScript." }),
    )} />
    <JimothyWorldNav active="clicker" />
    {children}
  </>;
}
