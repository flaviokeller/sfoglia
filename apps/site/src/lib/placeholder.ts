/**
 * Inline SVG placeholder images for the styleguide.
 *
 * Lives in a .ts module rather than in `.astro` frontmatter on purpose: nested
 * template literals containing markup confuse the Astro compiler's TypeScript
 * extraction, which then mis-parses the rest of the file.
 *
 * Data URIs keep the styleguide self-contained — no network requests and no
 * binary fixture images committed to the repo.
 */
export function placeholderImage(label: string, hue: number): string {
  const svg = [
    // width/height are required, not decorative: without an intrinsic size the
    // browser falls back to a default and the lightbox renders the image tiny.
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">',
    `<rect width="800" height="600" fill="hsl(${hue} 45% 72%)"/>`,
    '<text x="400" y="315" font-family="sans-serif" font-size="56" ',
    `fill="hsl(${hue} 60% 25%)" text-anchor="middle">${label}</text>`,
    '</svg>',
  ].join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
