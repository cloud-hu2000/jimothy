import type { Metadata } from "next";
import QuizClient from "./quiz-client";
import "./quiz.css";

export const metadata: Metadata = {
  title: "Which Jimothy Are You? Take the Viral Raccoon Personality Quiz",
  description: "Answer 7 chaotic questions and discover your true Jimothy form. Share or download your viral raccoon result card.",
  keywords: ["Which Jimothy Are You", "Jimothy quiz", "raccoon personality quiz", "viral meme quiz"],
  openGraph: {
    title: "Which Jimothy Are You?",
    description: "Answer 7 chaotic questions and discover your true Jimothy form.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Which Jimothy Are You?" }],
  },
  twitter: { card: "summary_large_image", title: "Which Jimothy Are You?", description: "Answer 7 chaotic questions and discover your true Jimothy form." },
};

export default function QuizPage() { return <QuizClient />; }
