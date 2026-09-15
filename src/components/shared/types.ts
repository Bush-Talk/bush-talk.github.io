/**
 * Props for components rendered in BOTH the site and the CMS preview pane.
 *
 * They are deliberately plain data. The site resolves images through Astro's
 * build-time optimiser; the preview resolves them through Sveltia's getAsset().
 * Neither concern belongs inside the component, so both hand it a finished
 * Img and the component just renders an <img>.
 */
export interface Img {
  src: string;
  /** Present only on the site — Astro's responsive variants. */
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt: string;
}
