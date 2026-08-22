import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../../lib/blog";
import { pageMetadata } from "../../lib/seo";
import BlogShell from "./blog-shell";
import styles from "./blog.module.css";

export const metadata: Metadata = pageMetadata({ path: "/blog", title: "Jimothy Blog: Quiz, Memes & Clicker Guides", description: "Jimothy World’s field notes for finding your quiz result, making better memes, and building a Trash Point empire.", keywords: ["Jimothy blog", "Jimothy meme guide", "Jimothy clicker guide"] });

const indexPost = { ...blogPosts[0], title: "The Jimothy Field Notes", intro: "Small guides for bigger group-chat energy: find your form, caption the moment, then build the bin economy.", eyebrow: "JIMOTHY WORLD BLOG", heroImage: "/assets/jimothy-raccoon.png", heroAlt: "Jimothy the raccoon illustration" };

export default function BlogIndexPage() {
  return <BlogShell post={indexPost}><div className={styles.article}><section><h2>Start wherever the chaos is.</h2><div className={styles.quizResults}>{blogPosts.map((post, index) => <Link className={styles.result} href={`/blog/${post.slug}`} key={post.slug}><img src={post.heroImage} alt="" /><div><p className={styles.eyebrow}>GUIDE {String(index + 1).padStart(2, "0")} · {post.readTime}</p><h3>{post.title}</h3><p>{post.description}</p></div><span>READ →</span></Link>)}</div></section></div></BlogShell>;
}
