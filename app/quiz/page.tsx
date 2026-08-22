import type { Metadata } from "next";
import { pageMetadata, schemaGraph, webApplicationSchema, webPageSchema } from "../../lib/seo";
import JsonLd from "../json-ld";
import QuizClient from "./quiz-client";
import "./quiz.css";

export const metadata: Metadata = pageMetadata({
  path: "/quiz",
  title: "Which Jimothy Are You? Take the Viral Raccoon Personality Quiz",
  description: "Answer 7 chaotic questions and discover your true Jimothy form. Share or download a result card made for the group chat.",
  keywords: ["Which Jimothy Are You", "Jimothy quiz", "raccoon personality quiz", "viral meme quiz"],
  image: { url: "/og.png", alt: "Which Jimothy Are You?" },
  socialTitle: "Which Jimothy Are You?",
  socialDescription: "Answer 7 chaotic questions and discover your true Jimothy form.",
});

export default function QuizPage() {
  return <>
    <JsonLd schema={schemaGraph(
      webPageSchema({ path: "/quiz", name: "Which Jimothy Are You?", description: "A shareable raccoon personality quiz." }),
      webApplicationSchema({ path: "/quiz", name: "Which Jimothy Are You?", description: "Answer seven questions to discover your Jimothy personality result.", category: "EntertainmentApplication", browserRequirements: "Requires JavaScript." }),
    )} />
    <QuizClient />
  </>;
}
