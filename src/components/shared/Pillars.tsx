import type { Img } from './types';
import Picture from './Picture';

export interface Pillar {
  title: string;
  body: string;
  image?: Img;
}

export default function Pillars({ pillars }: { pillars: Pillar[] }) {
  if (!pillars.length) return null;

  return (
    <ol className="pillars">
      {pillars.map((pillar, index) => (
        <li className="pillar" key={pillar.title || index}>
          <Picture image={pillar.image} className="pillar__image" />
          <span className="pillar__index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3>{pillar.title}</h3>
          <p>{pillar.body}</p>
        </li>
      ))}
    </ol>
  );
}
