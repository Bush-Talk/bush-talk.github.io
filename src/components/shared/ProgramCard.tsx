import type { Img } from './types';
import Picture from './Picture';

interface Props {
  href?: string;
  title: string;
  summary: string;
  image?: Img;
  price?: string;
  duration?: string;
}

export default function ProgramCard({ href, title, summary, image, price, duration }: Props) {
  const meta = [duration, price].filter(Boolean).join(' · ');

  const inner = (
    <>
      <div className="card__media">
        <Picture image={image} placeholderClass="card__placeholder" />
      </div>
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__summary">{summary}</p>
        {meta && <p className="card__meta">{meta}</p>}
        <span className="card__cue" aria-hidden="true">
          Read more →
        </span>
      </div>
    </>
  );

  return (
    <article className="card">
      {/* The preview has nowhere to navigate to, so it renders without the link. */}
      {href ? (
        <a className="card__link" href={href}>
          {inner}
        </a>
      ) : (
        <div className="card__link">{inner}</div>
      )}
    </article>
  );
}
