import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbSchema, pageMetadata, schemaGraph, webPageSchema } from "../../../lib/seo";
import { resultList, results, type ResultSlug } from "../../../lib/jimothy-results";
import JsonLd from "../../json-ld";
import ResultClient from "./result-client";
import "../../quiz/quiz.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return resultList.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = results[slug as ResultSlug];
  if (!result) return {};
  return pageMetadata({
    path: `/results/${result.slug}`,
    title: `${result.name} | Which Jimothy Are You?`,
    description: result.seoDescription,
    keywords: [...result.keywords, "Jimothy personality quiz result"],
    image: { url: result.image, alt: result.name },
    socialTitle: `I got ${result.name}.`,
    socialDescription: result.shareLine,
  });
}

export default async function ResultPage({ params }: Props) {
  const { slug } = await params;
  const result = results[slug as ResultSlug];
  if (!result) notFound();
  const path = `/results/${result.slug}`;
  return <>
    <JsonLd schema={schemaGraph(
      webPageSchema({ path, name: `${result.name} | Which Jimothy Are You?`, description: result.seoDescription }),
      breadcrumbSchema([{ name: "Which Jimothy?", path: "/quiz" }, { name: result.name, path }]),
    )} />
    <ResultClient result={result} moreResults={resultList.filter((item) => item.slug !== result.slug).slice(0, 3)} />
  </>;
}
