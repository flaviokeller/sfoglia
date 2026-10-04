import type { ResponsiveImage } from '../types';

/** An inline SVG stands in for a photo, so stories need no image files. */
export function placeholderImage(
  hue: number,
  alt: string,
  width = 1200,
  height = 900,
): ResponsiveImage {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="hsl(${hue} 30% 70%)"/></svg>`;
  return { src: `data:image/svg+xml,${encodeURIComponent(svg)}`, width, height, alt };
}
