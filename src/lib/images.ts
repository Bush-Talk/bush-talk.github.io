import type { ImageMetadata } from 'astro';

/**
 * Resolves an image path stored in content (e.g. "/src/assets/uploads/foo.webp")
 * to the ImageMetadata that Astro's <Image> needs.
 *
 * Content stores plain strings because that's what the CMS writes. Astro needs
 * a real import to optimise anything, so every upload is eagerly globbed here
 * and looked up by path.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{jpeg,jpg,png,gif,webp,avif}',
  { eager: true },
);

export function resolveImage(src?: string): ImageMetadata | undefined {
  if (!src) return undefined;
  const key = src.startsWith('/') ? src : `/${src}`;
  return files[key]?.default;
}

/** True when the path points somewhere Astro can't process (an external URL). */
export function isExternal(src?: string): boolean {
  return Boolean(src && /^https?:\/\//.test(src));
}

/**
 * Turns a content image path into the plain `Img` the shared React components
 * take — running it through Astro's optimiser to get responsive variants.
 *
 * The site calls this at build time. The preview pane instead builds an Img
 * from Sveltia's getAsset(), so the components themselves never learn about
 * either pipeline.
 */
export async function toImg(
  src: string | undefined,
  alt: string,
  widths: number[] = [320, 480, 640, 960],
  sizes = '(max-width: 52rem) 100vw, 360px',
) {
  const resolved = resolveImage(src);

  // External URL or an unresolved path — hand it through untouched.
  if (!resolved) return src ? { src, alt } : undefined;

  const { getImage } = await import('astro:assets');
  const optimised = await getImage({
    src: resolved,
    widths: widths.filter((w) => w <= resolved.width),
    format: 'webp',
  });

  return {
    src: optimised.src,
    srcSet: optimised.srcSet.attribute || undefined,
    sizes,
    width: resolved.width,
    height: resolved.height,
    alt,
  };
}
