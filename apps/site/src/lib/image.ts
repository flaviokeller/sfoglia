import { getImage } from 'astro:assets';
import type { ResponsiveImage } from '@flaviocodes/sfoglia-ui';
import type { ImageMetadata } from 'astro';

/**
 * Runs Astro's image pipeline and returns plain <img> attributes. The Vue
 * components in `packages/ui` cannot use `<Image>` (it is Astro-only), so this
 * is the seam between the two: the site optimises, the component only renders.
 */
export async function resolveImage(
  image: ImageMetadata,
  options: { alt?: string | undefined; widths: number[]; sizes: string },
): Promise<ResponsiveImage> {
  const { alt, widths, sizes } = options;
  const optimised = await getImage({ src: image, widths, sizes });
  return {
    src: optimised.src,
    srcset: optimised.srcSet.attribute,
    sizes,
    width: Number(optimised.attributes.width) || image.width,
    height: Number(optimised.attributes.height) || image.height,
    alt: alt ?? '',
  };
}
