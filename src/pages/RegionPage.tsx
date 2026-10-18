import { PageTop } from './PageTop';
import { useEffect, useRef, useState } from 'react';
import { Link, type Go } from '../cards/Link';
import { photosOf, sheetOf, type ShownPhoto } from '../facts';
import { strings } from '../strings';
import type { Place, Region, Tree } from '../tree';
import '../styles/region.css';
import { sentences } from './sentence';
import { Img } from '../cards/Img';
import { Credit } from '../cards/Credit';

const t = strings.regionPage;
type Shot = ShownPhoto;

const credit = (p: Shot) => <Credit photo={p} />;

/** A tile with the place's photo, or its name on a plain tile when it has none or the photo fails. */
function Tile({ place, go, photo, onBroken }: { place: Place; go: Go; photo?: Shot; onBroken: (src: string) => void }) {
  const why = sheetOf(place.id)?.why.text;
  return (
    <li className="rtile">
      <Link to={{ kind: 'place', id: place.id, page: true }} go={go}>
        <div className={`ph${photo ? '' : ' none'}`}>
          {photo ? <Img key={photo.src} photo={photo} sizes="(max-width: 47.5em) 100vw, (max-width: 68.75em) 50vw, 24rem" lazy onError={() => onBroken(photo.src)} /> : <span>{place.name}</span>}
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
      <PageTop tree={tree} go={go} back={back} title={region.name} />
      <header className={`rcover${cover ? '' : ' none'}`}>
        {cover && <Img key={cover.src} photo={cover} sizes="100vw" onError={() => markBroken(cover.src)} />}
        <div className="ttl">
          <nav className="kicker crumb" aria-label={strings.cards.whereThisSits}>
            {crumb.map((c, i) => <span key={c.id + i} aria-current={i === crumb.length - 1 ? 'page' : undefined}>{c.name}</span>)}
          </nav>
          <h1 ref={heading} tabIndex={-1}>{region.name}</h1>
        </div>
        {cover && <span className="pill">{credit(cover)}</span>}
      </header>
      <div className="rintro">
        <p>{t.lede(places.length)}</p>
        <div className="count"><b>{learn.length}</b><span className="kicker">{t.placesToLearn(learn.length)}</span></div>
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
