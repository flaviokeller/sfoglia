/**
 * An image already resolved by the caller. Astro's image pipeline cannot run
 * inside a Vue component, so the site turns an `ImageMetadata` into these plain
 * attributes (see `apps/site/src/lib/image.ts`) and the component only renders
 * an <img>. Loading priority stays the component's call, not the caller's.
 */
export interface ResponsiveImage {
  src: string;
  alt?: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
}
