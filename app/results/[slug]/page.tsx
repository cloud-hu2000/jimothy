import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resultList, results, siteUrl, type ResultSlug } from "../../../lib/jimothy-results";
import ResultClient from "./result-client";
import "../../quiz/quiz.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return resultList.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const result = results[slug as ResultSlug]; if (!result) return {}; const url = `${siteUrl}/results/${result.slug}`; return { title: `${result.name} | Which Jimothy Are You?`, description: result.seoDescription, alternates: { canonical: url }, openGraph: { title: `I got ${result.name}.`, description: result.shareLine, type: "website", url, images: [{ url: result.image, alt: result.name }] }, twitter: { card: "summary_large_image", title: `I got ${result.name}.`, description: result.shareLine, images: [result.image] } }; }
export default async function ResultPage({ params }: Props) { const { slug } = await params; const result = results[slug as ResultSlug]; if (!result) notFound(); return <ResultClient result={result} moreResults={resultList.filter((item) => item.slug !== result.slug).slice(0, 3)} />; }
