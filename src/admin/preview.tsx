/**
 * CMS preview templates.
 *
 * These import the SAME components the site renders, so the preview pane and
 * the live page can't drift. The components are plain React and take plain
 * data; the only thing that differs is where images come from — Astro's build
 * optimiser on the site, Sveltia's getAsset() here.
 *
 * Compiled with the classic JSX runtime against Sveltia's own React globals
 * (`h` / `rf`), so no second copy of React ends up on the page. See
 * vite.preview.config.mjs.
 */

import '../styles/global.css';

import ProgramCard from '../components/shared/ProgramCard';
import WorkshopCard from '../components/shared/WorkshopCard';
import Quote from '../components/shared/Quote';
import Pillars from '../components/shared/Pillars';
import SiteFooter from '../components/shared/SiteFooter';
import type { Img } from '../components/shared/types';

declare const window: any;

const CMS = window.CMS;

if (!CMS) {
  console.warn('[bushtalk] Sveltia CMS not found; preview templates not registered.');
}

/** Entries are a plain object in Sveltia and an Immutable Map in Decap. */
const field = (entry: any, name: string) => {
  if (!entry) return undefined;
  if (typeof entry.getIn === 'function') return entry.getIn(['data', name]);
  return entry.data?.[name];
};

const list = (value: any): any[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value.toJS === 'function') return value.toJS();
  if (typeof value.toArray === 'function') return value.toArray();
  return [];
};

const get = (obj: any, key: string) =>
  obj && typeof obj.get === 'function' ? obj.get(key) : obj?.[key];

/** Resolve a CMS media path to something the preview iframe can actually load. */
const toImg = (getAsset: any, path?: string, alt = ''): Img | undefined => {
  if (!path) return undefined;
  try {
    const asset = getAsset?.(path);
    const src = typeof asset === 'string' ? asset : (asset?.toString?.() ?? path);
    return { src, alt };
  } catch {
    return { src: path, alt };
  }
};

const joined = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' · ');

/** Wraps a card in a mock of the grid it actually sits in. */
const InContext = ({ label, children, ghosts = 2 }: any) => (
  <div className="bt-context">
    <p className="bt-context__label">{label}</p>
    <div className="bt-context__grid">
      <div className="bt-context__real">{children}</div>
      {Array.from({ length: ghosts }, (_, i) => (
        <div className="bt-context__ghost" key={i} aria-hidden="true">
          <span className="bt-ghost-line bt-ghost-line--head" />
          <span className="bt-ghost-line" />
          <span className="bt-ghost-line" />
          <span className="bt-ghost-line bt-ghost-line--short" />
        </div>
      ))}
    </div>
  </div>
);

const Facts = ({ rows }: any) => {
  const present = rows.filter((r: any) => r.value);
  if (!present.length) return null;
  return (
    <dl className="bt-facts">
      {present.map((r: any) => (
        <div className="bt-facts__row" key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
};

// --- programs ---------------------------------------------------------------

CMS?.registerPreviewTemplate('programs', ({ entry, widgetFor, getAsset }: any) => {
  const f = (n: string) => field(entry, n);
  const includes = list(f('includes')).filter(Boolean);

  return (
    <div className="bt-preview">
      <InContext label="As it appears on the Programs page">
        <ProgramCard
          title={f('title') || 'Untitled program'}
          summary={f('summary') || ''}
          image={toImg(getAsset, f('image'), f('imageAlt') || '')}
          price={f('price')}
          duration={f('duration')}
        />
      </InContext>

      <div className="bt-aside">
        <Facts
          rows={[
            { label: 'Duration', value: f('duration') },
            { label: 'Cost', value: f('price') },
            { label: 'Who it suits', value: f('audience') },
          ]}
        />
        {includes.length > 0 && (
          <div className="bt-includes">
            <h2>What's included</h2>
            <ul>
              {includes.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bt-body">{widgetFor('body')}</div>
    </div>
  );
});

// --- weaving workshops ------------------------------------------------------

CMS?.registerPreviewTemplate('workshops', ({ entry, widgetFor, getAsset }: any) => {
  const f = (n: string) => field(entry, n);
  const when = [joined(f('dateLabel'), f('time')), f('location')].filter(Boolean).join('. ');

  return (
    <div className="bt-preview">
      <InContext label="As it appears on the Weaving Workshops page">
        <WorkshopCard
          title={f('title') || 'Untitled workshop'}
          when={when}
          summary={f('summary')}
          image={toImg(getAsset, f('image'), f('imageAlt') || '')}
          price={f('price')}
          duration={f('duration')}
          ctaLabel={f('bookingUrl') ? 'Book now' : 'Enquire'}
        >
          {widgetFor('body')}
        </WorkshopCard>
      </InContext>
    </div>
  );
});

// --- reviews ----------------------------------------------------------------

const CATEGORY: Record<string, string> = {
  principals: 'From the principals',
  teachers: 'From the teachers',
  kids: 'From the kids',
  participants: 'From participants',
};

CMS?.registerPreviewTemplate('testimonials', ({ entry }: any) => {
  const f = (n: string) => field(entry, n);
  const quote = f('quote');

  if (!quote) {
    return (
      <div className="bt-preview">
        <p className="bt-empty">Nothing to preview yet — add a quote to see it here.</p>
      </div>
    );
  }

  const words = String(quote).trim().split(/\s+/).length;

  return (
    <div className="bt-preview">
      <p className="bt-eyebrow">{CATEGORY[f('category')] || 'Review'}</p>
      {f('featured') && <p className="bt-badge">Shown on the home page</p>}
      <InContext label="As it appears in the Reviews grid">
        <Quote quote={quote} author={f('author')} role={f('role')} />
      </InContext>
      {words > 80 && (
        <p className="bt-warn">
          That's {words} words. Long quotes stretch their column well past the others — worth
          checking on the live site, or trimming.
        </p>
      )}
    </div>
  );
});

// --- free-form pages --------------------------------------------------------

CMS?.registerPreviewTemplate('pages', ({ entry, widgetFor, getAsset }: any) => {
  const f = (n: string) => field(entry, n);
  const img = toImg(getAsset, f('image'), f('imageAlt') || '');

  return (
    <div className="bt-preview">
      <h1>{f('title') || 'Untitled page'}</h1>
      {f('description') && <p className="bt-lede">{f('description')}</p>}
      {img && <img className="bt-page-image" src={img.src} alt={img.alt} />}
      <div className="bt-body">{widgetFor('body')}</div>
    </div>
  );
});

// --- home page (settings/home) ----------------------------------------------

CMS?.registerPreviewTemplate('home', ({ entry, getAsset }: any) => {
  const f = (n: string) => field(entry, n);
  const cta = (v: any, variant: string) => {
    const label = get(v, 'label');
    return label ? <span className={`btn btn--${variant}`}>{label}</span> : null;
  };

  const pillars = list(f('pillars')).map((p: any) => ({
    title: get(p, 'title') || 'Untitled',
    body: get(p, 'body') || '',
    image: toImg(getAsset, get(p, 'image'), get(p, 'imageAlt') || ''),
  }));

  return (
    <div className="bt-preview bt-home">
      <section className="bt-home__hero">
        {f('heroEyebrow') && <p className="bt-eyebrow">{f('heroEyebrow')}</p>}
        <h1>{f('heroHeading') || 'Main heading'}</h1>
        {f('heroSubheading') && <p className="bt-home__sub">{f('heroSubheading')}</p>}
        {f('heroText') && <p className="bt-lede">{f('heroText')}</p>}
        <p className="btn-row">
          {cta(f('primaryCta'), 'primary')}
          {cta(f('secondaryCta'), 'secondary')}
        </p>
      </section>

      <section className="bt-home__section">
        <h2>{f('pillarsHeading') || 'Section heading'}</h2>
        {f('pillarsIntro') && <p className="bt-lede">{f('pillarsIntro')}</p>}
        <Pillars pillars={pillars} />
      </section>

      <section className="bt-home__section bt-home__section--warm">
        <h2>{f('programsHeading') || 'Programs heading'}</h2>
        {f('programsIntro') && <p className="bt-lede">{f('programsIntro')}</p>}
        <p className="bt-note">Program cards are pulled in automatically.</p>
      </section>

      <section className="bt-home__section">
        <h2>{f('featureHeading') || 'Feature heading'}</h2>
        {f('featureText') && <p>{f('featureText')}</p>}
        <p className="btn-row">{cta(f('featureCta'), 'secondary')}</p>
      </section>

      <section className="bt-home__section bt-home__section--bark">
        <h2>{f('closingHeading') || 'Closing heading'}</h2>
        {f('closingText') && <p className="bt-lede">{f('closingText')}</p>}
        <p className="btn-row">{cta(f('closingCta'), 'primary')}</p>
      </section>
    </div>
  );
});

// --- contact & footer (settings/site) ---------------------------------------

CMS?.registerPreviewTemplate('site', ({ entry }: any) => {
  const f = (n: string) => field(entry, n);

  const data = {
    name: f('name') || 'Site name',
    footerTagline: f('footerTagline') || '',
    email: f('email') || '',
    phone: f('phone') || '',
    phoneHref: f('phoneHref'),
    hours: f('hours') || '',
    locations: list(f('locations')).filter(Boolean),
    acknowledgement: f('acknowledgement') || '',
    social: list(f('social')).map((s: any) => ({
      label: get(s, 'label') || '',
      url: get(s, 'url') || '#',
    })),
  };

  return (
    <div className="bt-preview">
      <p className="bt-context__label">As it appears in the footer, on every page</p>
      {/* linked={false} — the preview iframe has nowhere to navigate. */}
      <SiteFooter data={data} linked={false} />
      <p className="bt-note">
        Site name, tagline and description also affect the header, browser tab and Google results.
      </p>
    </div>
  );
});

console.info('[bushtalk] preview templates registered (sharing site components)');
