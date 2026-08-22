import type { ReactNode } from "react";
import Link from "next/link";
import type { BlogPost } from "../../lib/blog";
import { assetSize } from "../../lib/seo";
import styles from "./blog.module.css";

export default function BlogShell({ post, children }: { post: BlogPost; children: ReactNode }) {
  const size = assetSize(post.heroImage);
  return (
    <main className={`${styles.page} ${styles[post.accent]}`}>
      <nav className={styles.nav} aria-label="Jimothy World navigation">
        <Link className={styles.brand} href="/"><span>JIMOTHY</span><small>THE RACCOON</small></Link>
        <div><Link href="/blog">BLOG</Link><Link href="/quiz">QUIZ</Link><Link href="/clicker">CLICKER</Link><Link className={styles.navCta} href="/">MAKE A MEME</Link></div>
      </nav>

      <article>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{post.eyebrow}</p>
            <p className={styles.meta}>{post.publishedAt} <i>·</i> {post.readTime}</p>
            <h1>{post.title}</h1>
            <p>{post.intro}</p>
          </div>
          <figure><img src={post.heroImage} alt={post.heroAlt} width={size?.width} height={size?.height} /><figcaption>Fan-made Jimothy World guide.</figcaption></figure>
        </header>
        {children}
      </article>

      <footer className={styles.footer}><Link className={styles.brand} href="/"><span>JIMOTHY</span><small>THE RACCOON</small></Link><p>Fan-made tools, lore, and responsibly feral ideas.</p></footer>
    </main>
  );
}
