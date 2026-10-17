import { useEffect, useRef, useState } from 'react';
import { Link, type Go } from '../cards/Link';
import { photosOf, sheetOf, type Photo } from '../facts';
import { strings } from '../strings';
import type { Place, Region, Tree } from '../tree';
import '../styles/region.css';
import { sentences } from './sentence';

const t = strings.regionPage;
type Shot = Photo & { src: string };

const credit = (p: Shot) => (
  <a href={p.page} target="_blank" rel="noopener noreferrer">{p.artist}, {p.licence}</a>
);

/** A tile with the place's photo, or its name on a plain tile when it has none or the photo fails. */
function Tile({ place, go, photo, onBroken }: { place: Place; go: Go; photo?: Shot; onBroken: (src: string) => void }) {
  const why = sheetOf(place.id)?.why.text;
  return (
    <li className="rtile">
      <Link to={{ kind: 'place', id: place.id, page: true }} go={go}>
        <div className={`ph${photo ? '' : ' none'}`}>
          {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => onBroken(photo.src)} /> : <span>{place.name}</span>}
        </div>
        <span className="meta"><b>{place.name}</b><small>{place.kind}</small></span>
        {why && <span className="why">{sentences(why, 150)}</span>}
      </Link>
    </li>
  );
}

/** A study region as a page: a cover photo, the places as photo tiles, the photo credits. */
export function RegionPage({ tree, go, region }: { tree: Tree; go: Go; region: Region }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [region.id]);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const markBroken = (src: string) => setBroken((b) => new Set(b).add(src));
  const photoOf = (p: Place): Shot | undefined => photosOf(p.id).find((x) => !broken.has(x.src));

  const places = tree.placesInRegion(region.id);
  const learn = places.filter((p) => p.quiz !== 'none');
  const also = places.filter((p) => p.quiz === 'none');
  const shots = learn.map((p) => photoOf(p));
  // The cover is a photo no tile shows: a second photo of a place in course order, else the first place photo as before.
  const second = places.map((p) => photosOf(p.id).filter((x) => !broken.has(x.src))[1]).find(Boolean);
  const cover = second ?? places.map(photoOf).find(Boolean);
  const shown = shots.filter((s): s is Shot => !!s);
  const back = { kind: 'region' as const, id: region.id };
  const crumb = tree.breadcrumb(region.id, 'region');

  return (
    <div className="rpage" role="region" aria-label={region.name}>
      <Link className="rback" to={back} go={go}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        {t.backToMap}
      </Link>
      <header className={`rcover${cover ? '' : ' none'}`}>
        {cover && <img src={cover.src} alt={cover.alt} onError={() => markBroken(cover.src)} />}
        <div className="ttl">
          <nav className="kicker crumb" aria-label={strings.cards.whereThisSits}>
            {crumb.map((c, i) => <span key={c.id + i} aria-current={i === crumb.length - 1 ? 'page' : undefined}>{c.name}</span>)}
          </nav>
          <h1 ref={heading} tabIndex={-1}>{region.name}</h1>
        </div>
        {cover && <span className="pill">{t.coverCredit} {credit(cover)}</span>}
      </header>
      <div className="rintro">
        <p>{t.lede(places.length)}</p>
        <div className="count"><b>{learn.length}</b><span className="kicker">{t.placesToLearn}</span></div>
      </div>
      <ul className="rgrid" aria-label={t.grid}>
        {learn.map((p, i) => <Tile key={p.id} place={p} go={go} photo={shots[i]} onBroken={markBroken} />)}
      </ul>
      {shown.length > 0 && (
        <p className="rcredits">{t.credits} {shown.map((p, i) => <span key={p.src}>{i > 0 && '; '}{credit(p)}</span>)}</p>
      )}
      {also.length > 0 && (
        <section className="ralso">
          <h2>{t.alsoHere}</h2>
          <p>{t.alsoHereNote}</p>
          <ul>{also.map((p) => <li key={p.id}><Link to={{ kind: 'place', id: p.id, page: true }} go={go}>{p.name}<small>{p.kind}</small></Link></li>)}</ul>
        </section>
      )}
      <div className="rend">
        <Link className="btn primary" to={back} go={go}>{t.showOnMap(region.name)}</Link>
      </div>
    </div>
  );
}
