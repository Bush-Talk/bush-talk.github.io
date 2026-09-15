import type { Img } from './types';

interface Props {
  image?: Img;
  className?: string;
  /** Rendered when there's no image — keeps card layouts from collapsing. */
  placeholderClass?: string;
  loading?: 'lazy' | 'eager';
}

export default function Picture({ image, className, placeholderClass, loading = 'lazy' }: Props) {
  if (!image?.src) {
    return placeholderClass ? <div className={placeholderClass} aria-hidden="true" /> : null;
  }

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
}
