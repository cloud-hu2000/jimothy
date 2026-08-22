"use client";

/**
 * Renders a JSON-LD document into a script tag.
 *
 * `<` is escaped to `<` so a stray angle bracket inside any string value can
 * never close the script element early.
 */
export default function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
