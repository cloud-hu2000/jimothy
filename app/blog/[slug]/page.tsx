import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPostForSlug, blogPosts } from "../../../lib/blog";
import { articleSchema, breadcrumbSchema, faqSchema, pageMetadata, schemaGraph, webPageSchema } from "../../../lib/seo";
import JsonLd from "../../json-ld";
import BlogShell from "../blog-shell";
import styles from "../blog.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPostForSlug((await params).slug);
  return post ? pageMetadata({ path: `/blog/${post.slug}`, title: post.title, description: post.description, keywords: post.keywords, ogType: "article" }) : {};
}

const quizResults = [
  ["Sleepy Jimothy", "/assets/jimothy-sleepy-transparent.png", "For the person who treats a soft hoodie and a cancelled plan as essential infrastructure.", "/results/sleepy-jimothy"],
  ["Angel Jimothy", "/assets/jimothy-saint-transparent.png", "For the quietly kind organizer who arrives with snacks, a charger, and a sensible exit plan.", "/results/angel-jimothy"],
  ["Cool Jimothy", "/assets/jimothy-summer-transparent.png", "For the person who looks unbothered because they have already made the moment look cinematic.", "/results/cool-jimothy"],
  ["Chaotic Jimothy", "/assets/jimothy-raccoon-cropped.png", "For the curious instigator who turns a normal Tuesday into the story everyone retells.", "/results/chaotic-jimothy"],
  ["King Jimothy", "/assets/jimothy-crown.png", "For the main-character presence who knows a dramatic entrance is sometimes public service.", "/results/king-jimothy"],
] as const;

const captions = [
  { name: "Party Jimothy", mood: "For good news, fake good news, and a suspiciously confident Thursday.", lines: ["me after replying to one email", "the group chat when someone says ‘small announcement’", "arriving five minutes late with absolutely no context", "when the playlist finally understands the assignment", "me celebrating a problem I created", "the last snack at the function has chosen me"] },
  { name: "Lo-fi Jimothy", mood: "For low battery, low stakes, and very intentional avoidance.", lines: ["me listening to the same song until the situation improves", "currently unavailable for unnecessary drama", "when the deadline is tomorrow but the vibe is today", "soft launching my decision to do nothing", "me pretending the laundry cannot see me", "the sound of one tab open and zero plans"] },
  { name: "Formal Jimothy", mood: "For polite chaos, calendar invitations, and professionally delivered nonsense.", lines: ["respectfully, I have made things worse", "per my last emotional email", "me requesting a meeting about the meeting", "kind regards from the bottom of the group project", "please see attached: my final straw", "circling back to say absolutely not"] },
  { name: "King Jimothy", mood: "For disproportionate confidence and tiny victories with large production value.", lines: ["I did one chore. Address me accordingly.", "be honest: was that iconic?", "the parking spot was waiting for me", "me entering a room I was already invited to", "the budget said no but the crown said yes", "you may begin applauding now"] },
  { name: "Cool Jimothy", mood: "For the friend who was never worried, allegedly.", lines: ["I had it handled the entire time", "me leaving before the plot gets complicated", "when the outfit solves the problem", "I do not chase the bus. The bus understands.", "quietly becoming the best part of the plan", "no notes. Just sunglasses."] },
] as const;

function QuizGuide() {
  return <div className={styles.article}>
    <section className={styles.answer}><b>THE FAST ANSWER</b><p>The Jimothy quiz has five possible forms. Your result is less a permanent personality diagnosis and more a highly scientific reading of the energy you brought to today.</p></section>
    <section><h2>Find the form that already feels suspiciously familiar.</h2><div className={styles.quizResults}>{quizResults.map(([name, image, description, href]) => <Link className={styles.result} href={href} key={name}><img src={image} alt="" /><div><h3>{name}</h3><p>{description}</p></div><span>MEET →</span></Link>)}</div></section>
    <section className={styles.quizNote}><h2>One seven-question detour. One true form.</h2><p>The quiz works best when you answer for your current mood, not the polished version of yourself who owns a planner. There are no bad outcomes—only different approaches to snacks, timing, and avoidable chaos.</p><Link className={styles.button} href="/quiz">TAKE THE JIMOTHY QUIZ →</Link></section>
    <section className={styles.faq}><p>QUIZ QUESTIONS</p><h2>Before you pick an answer.</h2>{blogPosts[0].faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
  </div>;
}

function CaptionGuide() {
  return <div className={styles.article}>
    <section className={styles.captionIntro}><h2>A tiny formula for a caption with legs.</h2><p>Jimothy captions are strongest when they make a familiar feeling sound much more important than it is. Keep the setup recognizable, stay specific, and let the raccoon carry the unreasonable confidence.</p><div className={styles.method}><div><b>01 · START REAL</b><span>Pick a moment your friend has actually had.</span></div><div><b>02 · TURN IT UP</b><span>Give the moment royal or catastrophic stakes.</span></div><div><b>03 · KEEP IT SHORT</b><span>Let the image finish the joke.</span></div></div></section>
    {captions.map((group) => <section className={styles.captionSection} key={group.name}><div className={styles.captionHeading}><h2>{group.name}</h2><p>{group.mood}</p></div><div className={styles.captionGrid}>{group.lines.map((line, index) => <div className={styles.caption} key={line}><b>{String(index + 1).padStart(2, "0")}</b><p>“{line}”</p></div>)}</div></section>)}
    <section className={styles.captionCta}><h2>Pick a Jimothy. Add the line. Release it into the chat.</h2><p>These are starting points, not rules. Swap in your roommate’s habit, your team’s running joke, or the exact brand of weekday nonsense that only your group understands.</p><Link className={styles.button} href="/">OPEN THE MEME GENERATOR →</Link></section>
    <section className={styles.faq}><p>TEMPLATE QUESTIONS</p><h2>Make the bit land.</h2>{blogPosts[1].faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
  </div>;
}

function ClickerGuide() {
  return <div className={styles.article}><div className={styles.gameLayout}><aside className={styles.gameToc}><p>YOUR ROUTE</p><a href="#first-taps">01 · Start the run</a><a href="#upgrades">02 · Build passive income</a><a href="#skins">03 · Pick a look</a><a href="#return">04 · Return stronger</a></aside><div className={styles.gameContent}>
    <section className={styles.step} id="first-taps"><div className={styles.stepHeader}><b>01</b><h2>Start the run: tap, then spend.</h2></div><p>Each tap earns Trash Points. Early on, tapping is your engine; use it to buy the first available upgrade rather than holding points for a distant cosmetic. Every purchased upgrade adds passive income, which keeps working while the game remains open.</p><p>Your tap value also grows with Trash Dimension returns and after every eight total upgrade levels. The first job is simple: turn manual effort into automatic bins.</p></section>
    <section className={styles.step} id="upgrades"><div className={styles.stepHeader}><b>02</b><h2>Build the night shift.</h2></div><p>Upgrade costs rise by 18% per level. That means the best early rhythm is to keep buying affordable production instead of waiting for one far-off item. The higher-cost upgrades are powerful, but their job is to take over once the early bins have started earning.</p><table className={styles.upgradeTable}><thead><tr><th>UPGRADE</th><th>FIRST COST</th><th>PASSIVE INCOME</th></tr></thead><tbody><tr><td>Dumpster Dive</td><td>30 TP</td><td>+1 / sec</td></tr><tr><td>Seattle Salmon</td><td>200 TP</td><td>+6 / sec</td></tr><tr><td>Space Needle Signal</td><td>1,250 TP</td><td>+32 / sec</td></tr><tr><td>Ballard Park Crew</td><td>7,500 TP</td><td>+160 / sec</td></tr></tbody></table><div className={styles.tip}><b>EARLY-GAME RULE</b><p>If an upgrade is within reach and will add passive income, it is usually more useful than saving every point for a skin. Build the bins first; flex later.</p></div></section>
    <section className={styles.step} id="skins"><div className={styles.stepHeader}><b>03</b><h2>Unlock the look after the loop is working.</h2></div><p>Classic Jimothy is ready from the beginning. Sleepy Jimothy costs 750 TP, Saint Jimothy costs 6,000 TP, and Hot Jimothy Summer costs 25,000 TP. Skins change the look of your raccoon, while upgrades are what raise your passive point income.</p><p>Progress—including unlocked skins, points, upgrades, and dimensions—saves in this browser on this device. A different browser or device starts with its own save.</p></section>
    <section className={styles.step} id="return"><div className={styles.stepHeader}><b>04</b><h2>At 100K, return stronger.</h2></div><p>At 100,000 Trash Points, you can return to the Trash Dimension. This resets the current run’s points and upgrades, then grants a permanent 20% boost to passive income for each return. It is the moment where a fresh run starts feeling much less fresh—and much more efficient.</p><p>Before you reset, make sure you are happy to trade the current run for the permanent boost. Your skins remain yours, and the next empire has a head start.</p><Link className={styles.button} href="/clicker">PLAY JIMOTHY CLICKER →</Link></section>
  </div></div><section className={styles.faq}><p>CLICKER QUESTIONS</p><h2>One more thing before you tap.</h2>{blogPosts[2].faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section></div>;
}

export default async function BlogPostPage({ params }: Props) {
  const post = blogPostForSlug((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const content = post.slug === "which-jimothy-are-you-today" ? <QuizGuide /> : post.slug === "jimothy-meme-template-caption-ideas" ? <CaptionGuide /> : <ClickerGuide />;
  return <><JsonLd schema={schemaGraph(webPageSchema({ path, name: post.title, description: post.description }), articleSchema({ path, headline: post.title, description: post.description, images: [post.heroImage], datePublished: "2026-08-22", dateModified: "2026-08-22" }), breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path }]), faqSchema(path, post.faqs))} /><BlogShell post={post}>{content}</BlogShell></>;
}
