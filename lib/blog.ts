export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  publishedAt: string;
  readTime: string;
  keywords: string[];
  heroImage: string;
  heroAlt: string;
  accent: "lime" | "coral" | "blue";
  faqs: { question: string; answer: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "which-jimothy-are-you-today",
    title: "Which Jimothy Are You Today? Meet Every Quiz Result",
    description: "Wondering which Jimothy you are today? Meet all five possible quiz results, then take the seven-question Jimothy personality quiz.",
    eyebrow: "THE QUIZ FIELD GUIDE",
    intro: "Some days you are organized, serene, and holding everybody else’s snack. Other days you are standing beside an open fridge at 3:07 a.m. asking whether this could become a story. There is a Jimothy for both moods.",
    publishedAt: "August 22, 2026",
    readTime: "4 min read",
    keywords: ["which jimothy are you", "which jimothy are you today", "jimothy quiz"],
    heroImage: "/assets/jimothy-summer.png",
    heroAlt: "Cool Jimothy illustration for the Which Jimothy Are You Today guide",
    accent: "lime",
    faqs: [
      { question: "How many results are in the Jimothy quiz?", answer: "There are five results: Sleepy, Angel, Cool, Chaotic, and King Jimothy." },
      { question: "Can I share my Jimothy result?", answer: "Yes. Every result has a shareable line and a downloadable card for the group chat." },
    ],
  },
  {
    slug: "jimothy-meme-template-caption-ideas",
    title: "Jimothy Meme Template: 30 Caption Ideas for Every Mood",
    description: "Use these 30 Jimothy meme caption ideas with five free Jimothy meme templates, from sleepy weekday energy to full trash-king confidence.",
    eyebrow: "THE CAPTION VAULT",
    intro: "A good meme template gives you the expression. A good caption gives it a reason to exist in someone’s group chat. Pick the Jimothy with the right energy, steal a line below, then make it yours.",
    publishedAt: "August 22, 2026",
    readTime: "6 min read",
    keywords: ["jimothy meme template", "jimothy meme captions", "jimothy meme generator"],
    heroImage: "/assets/jimothy-party.png",
    heroAlt: "Party Jimothy meme template illustration",
    accent: "coral",
    faqs: [
      { question: "Can I download a Jimothy meme template for free?", answer: "Yes. The Jimothy Meme Generator lets you choose a template, add your own caption, and download the finished meme as a PNG." },
      { question: "What makes a Jimothy caption work?", answer: "Use a familiar situation, keep the wording short, and give an ordinary moment unreasonably serious confidence." },
    ],
  },
  {
    slug: "how-to-play-jimothy-clicker",
    title: "How to Play Jimothy Clicker: Upgrades, Skins & the Trash Dimension",
    description: "A practical Jimothy Clicker guide: earn Trash Points, choose upgrades, unlock skins, and return to the Trash Dimension at 100K points.",
    eyebrow: "THE BIN ECONOMY",
    intro: "Jimothy Clicker begins as one raccoon and one extremely committed tap. A few upgrades later, the bins are earning while you stare thoughtfully into the Seattle night. This guide gets you from first tap to your first Trash Dimension return.",
    publishedAt: "August 22, 2026",
    readTime: "5 min read",
    keywords: ["jimothy the raccoon game", "jimothy clicker", "how to play jimothy clicker"],
    heroImage: "/assets/jimothy-raccoon-cropped.png",
    heroAlt: "Classic Jimothy artwork for the Jimothy Clicker guide",
    accent: "blue",
    faqs: [
      { question: "Does Jimothy Clicker save my progress?", answer: "Yes. Your points, upgrades, skins, and Trash Dimension progress save automatically in the browser on your device." },
      { question: "What happens at 100K Trash Points?", answer: "You can return to the Trash Dimension, resetting the current run and gaining a permanent 20% passive-income bonus." },
    ],
  },
];

export function blogPostForSlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
