import { notFound } from "next/navigation";
import { jimothyPages, metadataForPage, pageForSlug } from "../jimothy-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jimothyPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = pageForSlug(slug);
  return page ? metadataForPage(page) : {};
}

export default async function JimothyInfoPage({ params }: Props) {
  const { slug } = await params;
  const page = pageForSlug(slug);
  if (!page) notFound();

  return <main className="info-page">
    <nav className="info-nav">
      <a className="brand" href="/"><span>JIMOTHY</span><small>THE RACCOON</small></a>
      <div><a href="/jimothy-memes">MEMES</a><a href="/quiz">TAKE THE QUIZ</a><a className="info-nav-cta" href="/">MAKE A MEME</a></div>
    </nav>

    <article>
      <header className="info-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="answer">{page.answer}</p>
        <p className="info-note">Updated July 2026 · Fan-made guide; wildlife should always be observed from a respectful distance.</p>
      </header>

      <section className="info-images" aria-label="Original Jimothy artwork">
        {page.images.map((image) => <figure className={`info-image ${image.tone}`} key={image.src}>
          <img src={image.src} alt={image.alt} />
          <figcaption>{image.caption}</figcaption>
        </figure>)}
      </section>

      <div className="info-body">
        <div className="info-copy">
          {page.sections.map((section) => <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>)}
        </div>
        <aside className="info-timeline">
          <p className="eyebrow">SHORT TIMELINE</p>
          <ol>{page.timeline.map((entry) => <li key={entry.date}><b>{entry.date}</b><span>{entry.detail}</span></li>)}</ol>
        </aside>
      </div>

      <section className="info-cta">
        <p className="eyebrow">KEEP THE LORE GOING</p>
        <h2>Which Jimothy are you today?</h2>
        <p>Take the tiny personality test, then make the raccoon meme your group chat deserves.</p>
        <div><a className="button-lime" href="/quiz">TAKE THE QUIZ</a><a className="button-outline" href="/">OPEN MEME GENERATOR</a></div>
      </section>

      <section className="info-faq" aria-labelledby="faq-heading">
        <p className="eyebrow">FAQ</p>
        <h2 id="faq-heading">More Jimothy questions, answered.</h2>
        <div>{page.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
      </section>
    </article>

    <footer className="info-footer"><a className="brand" href="/"><span>JIMOTHY</span><small>THE RACCOON</small></a><p>A fan-made meme tool. Respect the wildlife; enjoy the lore.</p></footer>
  </main>;
}
