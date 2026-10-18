import { PageTop } from './PageTop';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { BrandMark } from '../app/TopBar';
import { cardShownBefore, noteCardKey } from '../cards/CardShell';
import { Link, type Go } from '../cards/Link';
import { selectionOf } from '../cards/nav';
import { OtherGrapes, SourceLine } from '../cards/PlaceFacts';
import { SearchBox } from '../cards/SearchBox';
import { altitudeText, grapeLabel, guideOf, measuresOf, photosOf, sheetOf, tasteLines } from '../facts';
import { regionColor } from '../map/regionColors';
import { strings } from '../strings';
import type { Place, Tree } from '../tree';
import { quizToHash, selectionToHash, type Selection } from '../url';
import { AltitudeRange, ClimateBar } from './Charts';
import { glanceCells, mosaicPics, nextRegion, swatchOf } from './helpers';
import { Mosaic } from './Mosaic';
import '../styles/pages.css';
import { Img } from '../cards/Img';

const t = strings.place.page;
const tf = strings.facts;
const tc = strings.cards;

interface Props {
  tree: Tree;
  go: Go;
  place: Place;
  /** The guide chapter to scroll to on opening ("Back to the guide"). */
  at?: string;
  /** Starts a review round of 10 on these places ("Test me"). */
  onTest(set: string[]): void;
}

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      {kicker && <p className="kicker pg-kicker">{kicker}</p>}
      <h2 id={`${id}-h`} tabIndex={-1}>{title}</h2>
      {children}
    </section>
  );
}

/** The full page of a place (#place=<id>&page): photos, a jump bar, ruled sections that each keep their source lines, and an "at a glance" box. */
export function PlacePage({ tree, go, place, at, onTest }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [current, setCurrent] = useState('');
  useEffect(() => {
    if (cardShownBefore()) heading.current?.focus({ preventScroll: true });
    noteCardKey('page');
  }, [place.id]);

  useEffect(() => {
    if (!at) return;
    document.getElementById(`terroir-${at}`)?.scrollIntoView({ block: 'start' });
    document.getElementById(`terroir-${at}-h`)?.focus({ preventScroll: true });
  }, [place.id, at]);

  const trail = tree.breadcrumb(place.id, 'place');
  const region = tree.getRegion(place.region);
  const also = tree.alsoWithin(place.id);
  const zones = tree.children(place.id, 'place') as Place[];
  const isZone = tree.levelName(place) === 'zone';
  const quizzed = place.quiz !== 'none';
  const sheet = quizzed ? sheetOf(place.id) : undefined;
  const measures = quizzed ? measuresOf(place.id) : undefined;
  const color = regionColor(place.region);
  const official = place.official && place.official !== place.name ? place.official : undefined;
  const level = isZone ? tc.zoneLevel : place.kind;

  const photos = mosaicPics(quizzed ? photosOf(place.id) : [], zones.flatMap((z) => photosOf(z.id).slice(0, 1)));
  const main = sheet?.grapes.main ?? [];
  const others = sheet?.grapes.others ?? [];
  const kinds = (sheet?.styles.kinds ?? []).map((k) => tf.styleKinds[k]);
  const wineTypes = sheet?.styles.text.trim() || kinds.join(', ');
  const tastes = sheet?.tastes?.text.trim();
  const famous = sheet?.famous?.styles ?? [];
  const climate = sheet?.climate.text.trim();
  const soil = sheet?.soil.text.trim();
  const writtenAltitude = sheet?.altitude?.text.trim();
  const koppen = measures?.koppen ?? [];
  const producers = sheet?.producers?.items ?? [];
  const next = nextRegion(tree, place.region);
  const guide = guideOf(place.id);
  const testSet = [place.id, ...zones.filter((z) => z.quiz !== 'none').map((z) => z.id)];
  const testMe = quizzed && (
    <div className="pg-testme">
      <div>
        <b>{t.testTitle(place.name)}</b>
        <span>{t.testText(place.name, testSet.length > 1)}</span>
      </div>
      <a className="btn accent" href={quizToHash({ sub: 'test', set: testSet })} onClick={(e) => { e.preventDefault(); onTest(testSet); }}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6" /><circle cx="12" cy="16.6" r=".6" fill="currentColor" /></svg>
        {t.testButton}
      </a>
    </div>
  );
  const pill = (chapter: string, index: number, label: string) => {
    const to: Selection = { kind: 'place', id: place.id, fly: { chapter, index } };
    return (
      <Link key={`${chapter}.${index}`} className="fly" to={to} go={go} label={t.flyLabel(label)}>
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
        <span><small>{t.onTheMap}</small>{label}</span>
      </Link>
    );
  };

  const sections = [
    { id: 'overview', label: t.sections.overview, present: !!sheet || !!official },
    { id: 'terroir', label: t.sections.terroir, present: !!guide },
    { id: 'taste', label: t.sections.taste, present: !!tastes },
    { id: 'styles', label: t.sections.styles, present: famous.length > 0 },
    { id: 'grapes', label: t.sections.grapes, present: main.length > 0 || others.length > 0 || !!wineTypes },
    { id: 'land', label: t.sections.land, present: !!climate || koppen.length > 0 || !!soil || !!writtenAltitude || !!measures },
    { id: 'producers', label: t.jump.producers, present: producers.length > 0 },
    { id: 'zones', label: t.sections.zones, present: zones.length > 0 },
    { id: 'where', label: t.sections.where, present: true },
  ].filter((s) => s.present);

  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
    document.getElementById(`${id}-h`)?.focus({ preventScroll: true });
    setCurrent(id);
  };

  const sub = [level, region ? t.subRegion(region.name) : '', zones.length > 0 ? t.subZones(zones.length) : ''].filter(Boolean).join(' · ');
  const altitudeCell = glanceCells(sheet, measures).find((c) => c.kind === 'altitude');
  // Each glance row names the section that holds its source (release 9 review: a fact keeps a visible way to its source).
  const glance: Array<[string, string, string]> = [
    [t.level, level, 'where'],
    ...(main.length > 0 ? [[t.mainGrapes, main.map((g) => g.grape ?? g.local).join(', '), 'grapes'] as [string, string, string]] : []),
    ...(kinds.length > 0 ? [[t.wineTypes, kinds.map((k, i) => (i === 0 ? k : k.toLowerCase())).join(', '), 'grapes'] as [string, string, string]] : []),
    ...(altitudeCell ? [[t.altitude, altitudeCell.big, 'land'] as [string, string, string]] : []),
    ...(zones.length > 0 ? [[t.zoneCount, String(zones.length), 'zones'] as [string, string, string]] : []),
  ];
  const toSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: 'start' });
    el?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  };

  return (
    <div className="pg" role="region" aria-label={strings.place.page.pageLabel(place.name)}>
      <PageTop tree={tree} go={go} back={{ kind: 'place', id: place.id }} title={place.name} />
      <div className="pg-listing">
        <nav className="kicker crumb" aria-label={tc.whereThisSits}>
          {trail.map((c, i) => (
            i === trail.length - 1
              ? <span key={c.id + i} aria-current="page">{c.name}{isZone ? '' : ` · ${place.kind}`}</span>
              : <span key={c.id + i} className="step"><Link to={selectionOf(tree, c)} go={go}>{c.name}</Link> ›</span>
          ))}
        </nav>
        <h1 ref={heading} tabIndex={-1}>{place.name}</h1>
        <p className="pg-sub">
          {sub}
          {guide && <>{' · '}<a href={selectionToHash({ kind: 'place', id: place.id, page: true })} onClick={jump('terroir')}>{t.terroirLink(guide.minutes)}</a></>}
        </p>
        <Mosaic key={place.id} photos={photos} name={place.name} color={color} />

        <nav className="pg-jump" aria-label={t.jumpLabel}>
          {sections.map((s) => (
            <a key={s.id} href={selectionToHash({ kind: 'place', id: place.id, page: true })} aria-current={current === s.id ? 'true' : undefined} onClick={jump(s.id)}>{s.label}</a>
          ))}
        </nav>

        <div className="pg-cols">
          <main>
            {(sheet || official) && (
              <Section id="overview" title={t.sections.overview}>
                {sheet ? (
                  <>
                    <p className="pg-read">{sheet.why.text}</p>
                    <SourceLine cites={sheet.why.cite} />
                    {official && <p className="official">{official}</p>}
                  </>
                ) : <p className="pg-read">{official}</p>}
              </Section>
            )}

            {guide && (
              <Section id="terroir" title={guide.title} kicker={t.terroirKicker(guide.minutes)}>
                <p className="pg-read pg-lede">{guide.lede.text}</p>
                <SourceLine cites={guide.lede.cite} />
                {guide.chapters.map((ch) => {
                  const own = ch.fly ?? [];
                  return (
                    <div className="pg-ch" id={`terroir-${ch.id}`} key={ch.id}>
                      <h3 id={`terroir-${ch.id}-h`} tabIndex={-1}>{ch.title}</h3>
                      {ch.paras.map((para, i) => <p key={i}>{para}</p>)}
                      {ch.cards && (
                        <div className="pg-zguide">
                          {ch.cards.map((c, i) => (
                            <div key={c.title}>
                              <b>{c.title}</b>
                              <p className="cl">{c.climate}</p>
                              <p>{c.wine}</p>
                              {pill(ch.id, own.length + i, c.fly.label)}
                            </div>
                          ))}
                        </div>
                      )}
                      {own.length > 0 && <div className="pg-flies">{own.map((f, i) => pill(ch.id, i, f.label))}</div>}
                      <SourceLine cites={ch.cite} />
                    </div>
                  );
                })}
                {testMe}
              </Section>
            )}

            {tastes && (
              <Section id="taste" title={t.sections.taste}>
                <div className="pg-cards">
                  {tasteLines(tastes).map((l, i) => {
                    const sw = swatchOf(l.label);
                    return (
                      <div key={i}>
                        {sw && <i className={`pg-sw ${sw}`} aria-hidden="true" />}
                        {l.label && <b>{l.label}</b>}
                        <p>{l.text}</p>
                      </div>
                    );
                  })}
                </div>
                <SourceLine cites={sheet!.tastes!.cite} />
              </Section>
            )}

            {famous.length > 0 && (
              <Section id="styles" title={t.sections.styles}>
                <ul className="pg-styles">
                  {famous.map((f) => <li key={f.name}><strong>{f.name}</strong>{f.text.trim() && <span>{f.text.trim()}</span>}</li>)}
                </ul>
                <SourceLine cites={sheet!.famous!.cite} />
              </Section>
            )}

            {(main.length > 0 || others.length > 0 || wineTypes) && (
              <Section id="grapes" title={t.sections.grapes}>
                {main.length > 0 && (
                  <>
                    <h3 className="pg-h3">{t.mainGrapes}</h3>
                    <ul className="pg-grapes">{main.map((g) => <li key={g.local}>{grapeLabel(g)}</li>)}</ul>
                    <SourceLine cites={sheet!.grapes.cite} />
                  </>
                )}
                <dl className="pg-rows">
                  {others.length > 0 && (
                    <>
                      <dt>{sheet!.grapes.othersPartial ? t.otherGrapesPartial : t.otherGrapes}</dt>
                      <dd><OtherGrapes names={others} /><SourceLine cites={sheet!.grapes.othersCite} /></dd>
                    </>
                  )}
                  {wineTypes && (
                    <>
                      <dt>{t.wineTypes}</dt>
                      <dd>{wineTypes}<SourceLine cites={sheet!.styles.cite} /></dd>
                    </>
                  )}
                </dl>
              </Section>
            )}

            {sections.some((s) => s.id === 'land') && (
              <Section id="land" title={t.sections.land}>
                <div className="pg-land">
                  {climate && (
                    <div>
                      <h3 className="pg-h3">{t.climateWritten}</h3>
                      <p>{climate}</p>
                      <SourceLine cites={sheet!.climate.cite} />
                    </div>
                  )}
                  {koppen.length > 0 && (
                    <div>
                      <h3 className="pg-h3">{t.climateMeasured}</h3>
                      <ClimateBar shares={koppen} />
                      <SourceLine cites={['koppen']} />
                    </div>
                  )}
                  {soil && (
                    <div>
                      <h3 className="pg-h3">{t.soil}</h3>
                      <p>{soil}</p>
                      <SourceLine cites={sheet!.soil.cite} />
                    </div>
                  )}
                  {(writtenAltitude || measures) && (
                    <div>
                      <h3 className="pg-h3">{t.altitude}</h3>
                      {measures && <AltitudeRange altitude={measures.altitude} />}
                      {writtenAltitude && <p>{writtenAltitude}</p>}
                      {measures && <p>{altitudeText(measures.altitude)}</p>}
                      <SourceLine cites={[...(writtenAltitude ? sheet!.altitude!.cite : []), ...(measures ? ['measures'] : [])]} />
                    </div>
                  )}
                </div>
              </Section>
            )}

            {producers.length > 0 && (
              <Section id="producers" title={t.sections.producers}>
                <ul className="pg-names">{producers.map((p) => <li key={p.name}>{p.wine ? `${p.name} (${p.wine})` : p.name}</li>)}</ul>
                <SourceLine cites={sheet!.producers!.cite} />
              </Section>
            )}

            {zones.length > 0 && (
              <Section id="zones" title={t.sections.zones}>
                <ul className="pg-zones">
                  {zones.map((z) => {
                    const photo = photosOf(z.id)[0];
                    const why = sheetOf(z.id)?.why;
                    return (
                      <li key={z.id}>
                        <Link className="zlink" to={{ kind: 'place', id: z.id, page: true }} go={go}>
                          {photo ? <Img photo={photo} sizes="(max-width: 47.5em) 100vw, 18rem" alt="" lazy /> : <span className="zblank" style={{ background: color }} aria-hidden="true" />}
                          <b>{z.name}</b>
                        </Link>
                        {why && <><p>{why.text}</p><SourceLine cites={why.cite} /></>}
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {!guide && testMe}

            <Section id="where" title={t.sections.where}>
              <dl className="pg-rows">
                <dt>{t.level}</dt>
                <dd>{level}{sheet && !isZone && <SourceLine cites={['mapa-list']} />}</dd>
                {region && !isZone && (<><dt>{t.studyRegion}</dt><dd><Link to={{ kind: 'region', id: region.id, page: true }} go={go}>{region.name}</Link></dd></>)}
                {also.length > 0 && (
                  <>
                    <dt>{t.alsoWithin}</dt>
                    <dd><ul>{also.map((o) => <li key={o.id}><Link to={{ kind: 'place', id: o.id, page: true }} go={go}>{o.name}</Link></li>)}</ul></dd>
                  </>
                )}
              </dl>
              <div className="pg-next">
                {region && <Link className="btn" to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.allPlacesInRegion}</Link>}
                {next && (
                  <Link className="nextlink" to={{ kind: 'region', id: next.id, page: true }} go={go}>
                    <span className="kicker">{t.nextInCourse}</span>
                    <b>{next.name} →</b>
                  </Link>
                )}
              </div>
            </Section>
          </main>

          <aside aria-labelledby="pg-glance-h">
            <div className="sticky">
              <h2 id="pg-glance-h">{t.glanceTitle(place.name)}</h2>
              <dl>{glance.map(([k, v, sec]) => (
                <div key={k}><dt>{k}</dt><dd>{v} <button type="button" className="srcbtn" onClick={() => toSection(sec)}>{t.sourceLink}</button></dd></div>
              ))}</dl>
              <Link className="btn primary" to={{ kind: 'place', id: place.id }} go={go}>{t.showOnMap(place.name)}</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
