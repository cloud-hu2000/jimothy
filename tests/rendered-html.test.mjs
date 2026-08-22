import assert from "node:assert/strict";
import test from "node:test";

const routes = [
  "/",
  "/quiz",
  "/clicker",
  "/blog",
  "/blog/which-jimothy-are-you-today",
  "/blog/jimothy-meme-template-caption-ideas",
  "/blog/how-to-play-jimothy-clicker",
  "/who-is-jimothy",
  "/is-jimothy-real",
  "/what-is-wrong-with-jimothy",
  "/jimothy-short-spine-syndrome",
  "/jimothy-memes",
  "/jimothy-as-a-baby",
  "/about-jimothy-world",
  "/results/sleepy-jimothy",
  "/results/angel-jimothy",
  "/results/cool-jimothy",
  "/results/chaotic-jimothy",
  "/results/king-jimothy",
];

async function render(path, accept = "text/html") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
}

test("all public routes server-render successfully with SEO basics", async () => {
  for (const path of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html/i, path);
    const html = await response.text();
    assert.match(html, /<title>[^<]+<\/title>/i, path);
    assert.match(html, /<meta name="description" content="[^"]+"/i, path);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://jimothy\\.meme${path === "/" ? "" : path}"`, "i"), path);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, path);
    assert.ok(jsonLdBlocks(html).length > 0, `missing JSON-LD for ${path}`);
  }
});

test("robots.txt points crawlers to the sitemap", async () => {
  const response = await render("/robots.txt", "text/plain");
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.match(body, /User-agent:\s*\*/i);
  assert.match(body, /Sitemap:\s*https:\/\/jimothy\.meme\/sitemap\.xml/i);
});

test("sitemap contains every indexable route without query strings", async () => {
  const response = await render("/sitemap.xml", "application/xml");
  assert.equal(response.status, 200);
  const body = await response.text();
  for (const path of routes) assert.match(body, new RegExp(`<loc>https://jimothy\\.meme${path === "/" ? "" : path}<\\/loc>`), path);
  assert.doesNotMatch(body, /<loc>[^<]*\?/i);
});

test("unknown content and result slugs return 404", async () => {
  assert.equal((await render("/not-a-real-jimothy-page")).status, 404);
  assert.equal((await render("/results/not-a-real-result")).status, 404);
});
