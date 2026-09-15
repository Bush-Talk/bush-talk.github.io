interface Props {
  quote: string;
  author?: string;
  role?: string;
}

export default function Quote({ quote, author, role }: Props) {
  return (
    <figure className="quote">
      <blockquote>{quote}</blockquote>
      <figcaption>
        {author && <span className="quote__author">{author}</span>}
        {role && <span className="quote__role">{role}</span>}
      </figcaption>
    </figure>
  );
}
