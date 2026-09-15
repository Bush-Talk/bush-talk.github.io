interface SocialLink {
  label: string;
  url: string;
}

export interface FooterData {
  name: string;
  footerTagline: string;
  email: string;
  phone: string;
  phoneHref?: string;
  hours: string;
  locations: string[];
  acknowledgement: string;
  social?: SocialLink[];
}

interface Props {
  data: FooterData;
  year?: number;
  /** The preview has no working links, so it renders plain text instead. */
  linked?: boolean;
}

export default function SiteFooter({ data, year, linked = true }: Props) {
  const social = data.social ?? [];

  // A cleared field must not become <a href="mailto:">. Empty means omit.
  const mail = data.email
    ? linked
      ? <a href={`mailto:${data.email}`}>{data.email}</a>
      : data.email
    : null;
  const tel = data.phone
    ? linked
      ? <a href={`tel:${data.phoneHref || data.phone}`}>{data.phone}</a>
      : data.phone
    : null;

  const contact = [mail, tel, data.hours ? <span className="site-footer__muted">{data.hours}</span> : null]
    .filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">{data.name}</p>
          {data.footerTagline && <p className="site-footer__tag">{data.footerTagline}</p>}
        </div>

        {contact.length > 0 && (
          <div className="site-footer__group">
            <h2>Get in touch</h2>
            <ul>
              {contact.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.locations.length > 0 && (
          <div className="site-footer__group">
            <h2>Where we work</h2>
            <ul>
              {data.locations.map((place) => (
                <li className="site-footer__muted" key={place}>
                  {place}
                </li>
              ))}
            </ul>
          </div>
        )}

        {social.length > 0 && (
          <div className="site-footer__group">
            <h2>Follow along</h2>
            <ul>
              {social.map((item) => (
                <li key={item.label}>
                  {linked ? (
                    <a href={item.url} rel="me noopener">
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="shell site-footer__base">
        {data.acknowledgement && (
          <p className="site-footer__acknowledgement">{data.acknowledgement}</p>
        )}
        {year && <p className="site-footer__copy">© {year} {data.name}</p>}
      </div>
    </footer>
  );
}
