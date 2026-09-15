import type { ReactNode } from 'react';
import type { Img } from './types';
import Picture from './Picture';

interface Props {
  title: string;
  when?: string;
  summary?: string;
  image?: Img;
  price?: string;
  duration?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** The rendered markdown body — Astro passes HTML, the preview passes widgetFor('body'). */
  children?: ReactNode;
}

export default function WorkshopCard({
  title,
  when,
  summary,
  image,
  price,
  duration,
  ctaLabel = 'Enquire',
  ctaHref,
  children,
}: Props) {
  const meta = [duration, price].filter(Boolean).join(' · ');

  return (
    <article className="workshop">
      <Picture image={image} className="workshop__image" />
      <h3>{title}</h3>
      {when && <p className="workshop__when">{when}</p>}
      <div className="workshop__body prose">
        {summary && <p>{summary}</p>}
        {children}
      </div>
      {meta && <p className="workshop__meta">{meta}</p>}
      {ctaHref ? (
        <a className="btn btn--secondary workshop__cta" href={ctaHref}>
          {ctaLabel}
        </a>
      ) : (
        <span className="btn btn--secondary workshop__cta">{ctaLabel}</span>
      )}
    </article>
  );
}
