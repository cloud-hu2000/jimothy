import type { Metadata } from "next";

export type JimothyPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  answer: string;
  sections: { heading: string; paragraphs: string[] }[];
  timeline: { date: string; detail: string }[];
  faqs: { question: string; answer: string }[];
  images: { src: string; alt: string; caption: string; tone: string }[];
};

const sharedTimeline = [
  { date: "July 2026", detail: "A short video of the unusually round raccoon spreads from Seattle’s Ballard neighborhood." },
  { date: "Days later", detail: "People share sightings, fan art, jokes and questions about the animal’s distinctive shape." },
  { date: "Now", detail: "Jimothy remains a real wild animal first—and a fast-moving internet meme second." },
];

const sharedFaqs = [
  { question: "Should I try to find or feed Jimothy?", answer: "No. Give wild raccoons space, do not approach them, and follow local wildlife guidance if an animal appears injured or distressed." },
  { question: "Can I use Jimothy in a meme?", answer: "That is the internet’s favorite hobby. Make a respectful, original version with the Jimothy Meme Generator." },
];

export const jimothyPages: JimothyPage[] = [
  {
    slug: "who-is-jimothy",
    title: "Who Is Jimothy? The Real Seattle Raccoon Behind the Meme",
    description: "Jimothy is the unusually round wild raccoon from Seattle’s Ballard neighborhood whose July 2026 video sparked a wave of memes.",
    eyebrow: "THE QUICK ANSWER",
    answer: "Jimothy is a real wild raccoon from Seattle’s Ballard neighborhood. His unusually short, round appearance is widely thought to be linked to a rare spinal condition, and a brief video of him turned into an internet-wide meme in July 2026.",
    sections: [
      { heading: "A neighborhood raccoon became a main character", paragraphs: ["Jimothy did not arrive with a brand strategy, a manager, or a carefully cultivated persona. He was simply filmed moving through Ballard, looking unlike the long-bodied raccoon many people expected to see. That contrast—tiny torso, upright-looking legs, and a face that seemed almost too expressive—made people stop scrolling.", "The name came from the person who posted the early video. It is a nickname, not a tag or a scientific identity, but it stuck immediately. Within days, people were passing around clips, drawings, game-style edits, and increasingly dramatic descriptions of Seattle’s newest tiny celebrity."] },
      { heading: "Why people call him special", paragraphs: ["The most visible part of Jimothy’s story is his silhouette. Reports and wildlife commentary have described it as consistent with short spine syndrome or a similar congenital spinal difference. A video cannot substitute for a veterinary examination, so the careful wording is “suspected,” not a definitive public diagnosis.", "That distinction matters because Jimothy is not a costume character or an AI invention. He is a living urban raccoon. The best version of the meme treats his strange little gait as charming while remembering that wild animals deserve distance, calm, and a habitat that works for them."] },
    ],
    timeline: sharedTimeline,
    faqs: [{ question: "Is Jimothy a pet?", answer: "No. Jimothy is known as a wild raccoon seen around Ballard, not a pet character or a zoo animal." }, ...sharedFaqs],
    images: [
      { src: "/assets/jimothy-raccoon.png", alt: "Original illustrated Jimothy raccoon portrait", caption: "Meet the internet’s roundest resident.", tone: "lime" },
      { src: "/assets/jimothy-crown.png", alt: "Original crowned Jimothy illustration", caption: "A local sighting, then sudden royalty.", tone: "gold" },
      { src: "/assets/jimothy-sleepy.png", alt: "Original sleepy Jimothy illustration", caption: "No media training required.", tone: "coral" },
    ],
  },
  {
    slug: "is-jimothy-real",
    title: "Is Jimothy Real? Yes—Here’s What Is and Isn’t",
    description: "Yes, Jimothy is real: a wild Seattle raccoon. The confusion comes from how unusual he looks and the flood of AI-style fan edits.",
    eyebrow: "FACT CHECK",
    answer: "Yes, Jimothy is real. He is a wild raccoon filmed in Seattle’s Ballard neighborhood; the memes, fan art, and AI-style edits around him are what make the story feel unreal.",
    sections: [
      { heading: "The original animal is real", paragraphs: ["Jimothy’s viral moment began with video footage, not an image prompt. Local reporting and neighborhood sightings place the raccoon in Ballard, Seattle, where residents have continued to recognize the same compact body shape. His unusual proportions are exactly why many first viewers assumed the clip had to be generated.", "That skepticism is understandable. Social feeds are now packed with synthetic animals and digitally altered footage, and Jimothy’s silhouette reads more like a cartoon design than a typical raccoon. But the original sightings are of a real, free-roaming animal."] },
      { heading: "The internet versions are a different story", paragraphs: ["Once a real animal becomes a meme, it quickly collects fictional versions. Jimothy has been redrawn, placed into games, dressed up, and transformed by AI. Those creations can be funny, but they should not be confused with evidence about the actual raccoon.", "A useful rule: treat direct, local sightings and the original video as the Jimothy story; treat polished composites, fantasy costumes, and impossible adventures as fan-made lore. The real Jimothy does not need a sequel to be interesting."] },
    ],
    timeline: sharedTimeline,
    faqs: [{ question: "Why do people think Jimothy is AI?", answer: "His compressed, round silhouette looks implausible to viewers used to typical raccoon proportions, and fan edits spread alongside the original footage." }, ...sharedFaqs],
    images: [
      { src: "/assets/jimothy-raccoon-cropped.png", alt: "Original Jimothy raccoon portrait", caption: "Real raccoon. Wild proportions.", tone: "cream" },
      { src: "/assets/jimothy-headphones.png", alt: "Original illustrated Jimothy with headphones", caption: "The edit is fan fiction; the raccoon is real.", tone: "violet" },
      { src: "/assets/jimothy-party.png", alt: "Original illustrated party Jimothy", caption: "Internet fame moves fast.", tone: "coral" },
    ],
  },
  {
    slug: "what-is-wrong-with-jimothy",
    title: "What Is Wrong With Jimothy? A Careful Explanation",
    description: "Nothing is “wrong” with Jimothy as a meme subject—but his body shape appears consistent with a congenital spinal difference such as short spine syndrome.",
    eyebrow: "THE CAREFUL VERSION",
    answer: "Jimothy appears to have a congenital spinal difference, widely described as suspected short spine syndrome. It can make the spine shorter or more compressed, creating his unusually round body shape—but only an in-person wildlife veterinary assessment could confirm a diagnosis.",
    sections: [
      { heading: "Start with the wording", paragraphs: ["“What is wrong with Jimothy?” is the search people type when they see the video for the first time. A kinder, more accurate question is why he looks different. Jimothy’s compact torso, very short-looking neck, and distinctive gait have led observers to compare him with animals documented with short spine syndrome.", "The public does not have a full medical chart for a wild raccoon. That means the responsible answer separates what is visible from what is known: his body is visibly different; short spine syndrome is a plausible explanation; an online clip is not a clinical diagnosis."] },
      { heading: "What this can mean for a wild animal", paragraphs: ["Spinal differences can affect movement, posture, and the way an animal’s body develops. The impact varies greatly from animal to animal. Jimothy has been seen moving through an urban neighborhood, but a sighting alone cannot tell us whether he is comfortable, injured, hungry, or needs intervention.", "The practical response is simple: do not handle him, do not chase a better photo, and do not diagnose him from a distance. If a wild animal is visibly struggling, contact a licensed local wildlife rehabilitator or animal-control authority."] },
    ],
    timeline: sharedTimeline,
    faqs: [{ question: "Is short spine syndrome painful?", answer: "Its effects vary and cannot be determined from a clip. Only qualified wildlife professionals can assess an individual animal’s condition and welfare." }, ...sharedFaqs],
    images: [
      { src: "/assets/jimothy-saint.png", alt: "Original illustrated Jimothy", caption: "Different-looking is not a diagnosis.", tone: "cream" },
      { src: "/assets/jimothy-raccoon.png", alt: "Original Jimothy raccoon illustration", caption: "The visible clue: a compressed silhouette.", tone: "lime" },
      { src: "/assets/jimothy-sleepy.png", alt: "Original sleepy Jimothy illustration", caption: "Give wildlife room to be wild.", tone: "blue" },
    ],
  },
  {
    slug: "jimothy-short-spine-syndrome",
    title: "Jimothy and Short Spine Syndrome: What We Know",
    description: "Jimothy’s distinctive body shape is widely believed to be consistent with short spine syndrome, a rare congenital spinal difference in animals.",
    eyebrow: "CONTEXT, NOT A DIAGNOSIS",
    answer: "Jimothy is widely believed to have short spine syndrome, a rare congenital condition in which vertebrae may be shortened, compressed, or fused. His appearance is consistent with it, but the wild raccoon has not received a publicly confirmed clinical diagnosis.",
    sections: [
      { heading: "What short spine syndrome describes", paragraphs: ["Short spine syndrome is a term used for a rare developmental difference affecting the vertebral column. Animals documented with the condition can have a shortened back, a compact or barrel-shaped trunk, a very short-looking neck, and altered posture. It is most often discussed in dogs, while reports in wild animals are far less common.", "The condition’s appearance can be dramatic because the animal’s limbs may look long relative to a compressed torso. That visual mismatch is a major reason Jimothy has become so recognizable online."] },
      { heading: "Why Jimothy is described cautiously", paragraphs: ["A named condition can be useful context, but it is not a label to apply with certainty from social media. Wildlife experts typically need direct examination, imaging, or other evidence to distinguish among congenital variation, injury, and other causes of an unusual gait or shape.", "For Jimothy, “suspected short spine syndrome” is the most honest shorthand. It explains the public discussion without pretending that meme viewers—or this page—can replace wildlife medicine."] },
    ],
    timeline: sharedTimeline,
    faqs: [{ question: "Can raccoons have short spine syndrome?", answer: "It is discussed much more often in dogs, but congenital spinal differences can occur across animals. Jimothy’s exact condition has not been publicly confirmed by a clinical exam." }, ...sharedFaqs],
    images: [
      { src: "/assets/jimothy-raccoon-cropped.png", alt: "Original compact Jimothy illustration", caption: "A shape that started a thousand questions.", tone: "blue" },
      { src: "/assets/jimothy-bowtie.png", alt: "Original formal Jimothy illustration", caption: "Context beats speculation.", tone: "coral" },
      { src: "/assets/jimothy-summer.png", alt: "Original summer Jimothy illustration", caption: "The diagnosis remains unconfirmed publicly.", tone: "gold" },
    ],
  },
  {
    slug: "jimothy-memes",
    title: "Jimothy Memes: Why the Seattle Raccoon Took Over",
    description: "Jimothy memes turn a real Seattle raccoon’s unforgettable shape into fan art, captions, game crossovers, and affectionate nonsense.",
    eyebrow: "MEME LORE",
    answer: "Jimothy memes are affectionate internet jokes, edits, and fan art inspired by a real, unusually round raccoon from Seattle. His unforgettable silhouette made him instantly recognizable—and easy to put into almost any joke.",
    sections: [
      { heading: "Why this meme works", paragraphs: ["A great animal meme needs a clear visual hook. Jimothy has one: he looks like a raccoon designed by someone who was told to make the torso 40 percent shorter. That recognizable outline lets a tiny image carry a big joke, even before a caption is added.", "Then there is the name. “Jimothy” sounds oddly formal for a raccoon caught doing ordinary raccoon things, which gives every edit an extra layer of mock grandeur. The internet did the rest: crowns, soundtracks, heroic titles, game crossovers, and a lot of respectful trash-talk."] },
      { heading: "Keep the joke on the meme, not the animal", paragraphs: ["The best Jimothy memes celebrate the absurdity of sudden celebrity, not an animal’s possible disability. Make him king of the alley, a Monday-morning mood, or a tiny legend with huge confidence. Avoid encouraging people to approach, feed, or stress a wild raccoon for content.", "Original captions travel further than reposts. Start with a moment people recognize, pick a mood, and give Jimothy the line nobody else thought of. The generator below has blank, high-resolution templates ready for it."] },
    ],
    timeline: sharedTimeline,
    faqs: [{ question: "What are good Jimothy meme captions?", answer: "Try a familiar situation with outsized confidence: “me opening the fridge for the fifth time” or “when the meeting could have been an email.”" }, ...sharedFaqs],
    images: [
      { src: "/assets/jimothy-party.png", alt: "Original party Jimothy meme template", caption: "Celebration mode: activated.", tone: "coral" },
      { src: "/assets/jimothy-crown.png", alt: "Original crowned Jimothy meme template", caption: "King of the trash kingdom.", tone: "gold" },
      { src: "/assets/jimothy-headphones.png", alt: "Original Jimothy with headphones meme template", caption: "Lo-fi, no-fi, all Jimothy.", tone: "violet" },
    ],
  },
  {
    slug: "jimothy-as-a-baby",
    title: "Jimothy as a Baby: What the Older Photos Suggest",
    description: "Older community photos believed to show Jimothy as a baby suggest his compact shape was present early, but online identifications cannot be verified with certainty.",
    eyebrow: "EARLY LORE",
    answer: "Photos believed to show Jimothy as a baby have circulated through the Seattle community, suggesting his compact shape may have been present early in life. They are community-sourced images, however, so the identity cannot be confirmed with complete certainty from the internet alone.",
    sections: [
      { heading: "Why baby Jimothy became a big question", paragraphs: ["Once viewers learned that Jimothy was a real animal, they naturally wanted a before-and-after story. Older photos shared by Ballard residents appear to show a young raccoon with a similarly short, rounded body. For many fans, they make the viral adult sighting feel less like a one-off mystery and more like a tiny neighborhood legend.", "But wildlife identification is harder than it looks. Raccoons change as they grow, images lose context as they are reposted, and several animals can live in the same area. It is fair to say the photos are believed to be Jimothy—not that every post is definitive proof."] },
      { heading: "A story that should stay gentle", paragraphs: ["The appeal of a baby photo is obvious: people want to see the early version of a creature they have already adopted emotionally. The useful takeaway is not to turn that curiosity into a search party. Young wildlife especially needs distance from people, pets, and casual handling.", "Jimothy’s story is at its best when the internet keeps the boundary clear: enjoy the old images, celebrate the odd little silhouette, and leave the actual raccoon free to live an ordinary raccoon life."] },
    ],
    timeline: [{ date: "Earlier years", detail: "Community photos believed to show a young Jimothy begin circulating alongside newer sightings." }, ...sharedTimeline.slice(0, 2)],
    faqs: [{ question: "Are the baby photos definitely Jimothy?", answer: "They are generally described as community-sourced photos believed to show him, rather than formally verified identification." }, ...sharedFaqs],
    images: [
      { src: "/assets/jimothy-sleepy.png", alt: "Original young-looking sleepy Jimothy illustration", caption: "Tiny from the beginning, allegedly.", tone: "cream" },
      { src: "/assets/jimothy-summer.png", alt: "Original summer Jimothy illustration", caption: "A neighborhood memory becomes lore.", tone: "gold" },
      { src: "/assets/jimothy-saint.png", alt: "Original illustrated Jimothy", caption: "Community photos deserve careful context.", tone: "lime" },
    ],
  },
];

export function pageForSlug(slug: string) {
  return jimothyPages.find((page) => page.slug === slug);
}

export function metadataForPage(page: JimothyPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.description, type: "article", images: [{ url: "/og.png", width: 1200, height: 630, alt: page.title }] },
  };
}
