import { useEffect, useRef } from 'react';
import { photoByKey } from '../facts';
import photoCrops from '../home/photoCrops.json';
import { ROOT } from '../site';
import { strings } from '../strings';
import { storyCount } from '../story/ids';
import type { Tree } from '../tree';
import { ATLAS } from '../url';
import { CardShell } from './CardShell';
import { Cover as CoverPhoto } from './Cover';
import { Credit } from './Credit';
import { Img } from './Img';
import { Link, type Go } from './Link';
import { COUNTRY_PHOTO, COVER_PHOTO, TOUR_PLACE, coverCounts, liveCountries } from './atlasCover';

const t = strings.atlas;
const crops = photoCrops as Record<string, { focus: string }>;
const media = (file: string) => `${ROOT}atlas/${file}`;

/** A short muted loop of the real map. It plays only while on screen and never under reduced motion (the poster stays); the file is not
 *  fetched until it first scrolls near (preload none), so the map's own first load is not slowed. */
function Clip({ name, alt }: { name: string; alt: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    const v = video.current;
    if (!v || still || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) void v.play().catch(() => {}); else v.pause(); }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [still]);
  if (still) return <img src={media(`${name}-poster.webp`)} alt={alt} />;
  return (
    <video ref={video} muted loop playsInline preload="none" poster={media(`${name}-poster.webp`)} aria-label={alt}>
      <source src={media(`${name}.webm`)} type="video/webm" />
    </video>
  );
}

function Panel({ title, line, lead, children }: { title: string; line: string; lead?: boolean; children: React.ReactNode }) {
  return (
    <figure className={lead ? 'atlas-pn lead' : 'atlas-pn'}>
      {children}
      <figcaption><b>{title}</b><span>{line}</span></figcaption>
    </figure>
  );
}

/** The first card of the atlas: what it is and why to explore it, before any country (owner, 22 Oct 2026, E1). */
export function AtlasCard({ tree, go }: { tree: Tree; go: Go }) {
  const hero = photoByKey(COVER_PHOTO);
  const countries = liveCountries(tree);
  const tours = storyCount();
  const n = coverCounts(tree, tours);
  const tiles = countries.map((c) => ({ c, photo: COUNTRY_PHOTO[c.id] ? photoByKey(COUNTRY_PHOTO[c.id]) : undefined }));
  const shown = tiles.flatMap((x) => (x.photo ? [x.photo] : []));
  return (
    <CardShell
      tree={tree} go={go} trail={[{ level: 'atlas', id: ATLAS.id, name: t.crumb }]} title={t.title}
      cover={hero && (
        <div className="cover-short cover-atlas" style={{ ['--crop' as string]: crops[COVER_PHOTO]?.focus ?? '50% 50%' }}>
          <CoverPhoto name={t.title} color="#141414" photos={[hero]} />
        </div>
      )}
    >
      <p className="lede">{t.lede}</p>
      <Panel lead title={t.tourTitle} line={t.tourLine}><Clip name="atlas-tour" alt={t.tourAlt} /></Panel>
      <p className="atlas-tour-row">
        <Link className="btn primary" to={{ kind: 'place', id: TOUR_PLACE, page: true, story: true }} go={go}>{t.tourButton}</Link>
        <span className="atlas-quiet">{t.live(tours)}</span>
      </p>
      <Panel title={t.bordersTitle} line={t.bordersLine}><img src={media('atlas-borders.webp')} alt={t.bordersAlt} loading="lazy" /></Panel>
      <Panel title={t.climateTitle} line={t.climateLine}><img src={media('atlas-climate.webp')} alt={t.climateAlt} loading="lazy" /></Panel>
      <Panel title={t.slopesTitle} line={t.slopesLine}><Clip name="atlas-tilt" alt={t.slopesAlt} /></Panel>
      <Panel title={t.guideTitle} line={t.guideLine}><img src={media('atlas-guide.webp')} alt={t.guideAlt} loading="lazy" /></Panel>
      <p className="atlas-imagery">{t.imagery}</p>
      <h2>{t.countries}</h2>
      <ul className="atlas-countries">
        {tiles.map(({ c, photo }) => (
          <li key={c.id}>
            {photo && <span className="ph"><Img photo={photo} sizes="(max-width: 47.5em) 100vw, 25rem" alt="" lazy /></span>}
            <div className="row">
              <div><h3>{c.name}</h3><small>{t.countryCount(c.places, c.regions)}</small></div>
              <Link className="btn primary" to={{ kind: 'country', id: c.id }} go={go}>{t.openCountry(c.name)}</Link>
            </div>
          </li>
        ))}
      </ul>
      {shown.length > 0 && <p className="tile-credits">{strings.cards.tilePhotos} {shown.map((p, i) => <span key={p.src}>{i > 0 && '; '}<Credit photo={p} /></span>)}</p>}
      <p className="atlas-quiet atlas-totals">{t.totals(n.places, n.regions, n.tours)}</p>
    </CardShell>
  );
}
