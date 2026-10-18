import { PageTop } from './PageTop';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { scrollToSection, useJumpMarker, useSectionInView } from '../app/motion';
import { BrandMark } from '../app/TopBar';
import { cardShownBefore, noteCardKey } from '../cards/CardShell';
import { Link, type Go } from '../cards/Link';
import { selectionOf } from '../cards/nav';
import { OtherGrapes, SourceLine, SourceList } from '../cards/PlaceFacts';
import { SearchBox } from '../cards/SearchBox';
import { altitudeText, grapeLabel, guideOf, measuresOf, photosOf, regionMeasuresOf, sheetOf, spainMeasures, tasteLines, wsetLevelsOf, type Cite } from '../facts';
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

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} tabIndex={-1}>{title}</h2>
      {children}
    </section>
  );
}

/** The full page of a place (#place=<id>&page): photos, a jump bar, ruled sections whose facts carry short source tags, a Sources list, and an "at a glance" box. */
export function PlacePage({ tree, go, place, at, onTest }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const jumpBar = useRef<HTMLElement>(null);
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
  // A study region that holds only this place (Rioja) opens this same guide, so it is named without a link to itself.
  const ownRegion = !!region && tree.soleSameName(region.id)?.id === place.id;
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

  // Every fact carries a short source tag; the tags are gathered as the page draws, in reading order, and the Sources section at the
  // end lists each document once (owner card, 18 Oct 2026). The Sources section is drawn last, so it sees every tag above it.
  const cited: Cite[] = [];
  const src = (cites: Cite[]) => {
    cited.push(...cites);
    return <SourceLine cites={cites} short />;
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
    { id: 'sources', label: t.sections.sources, present: !!sheet || !!guide },
  ].filter((s) => s.present);

  // The jump bar's marker follows the reading position, and a tab glides the page to its section (owner point 8, 18 Oct 2026).
  const current = useSectionInView(sections.map((s) => s.id), pageRef, place.id);
  useJumpMarker(jumpBar, current);
  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const parent = isZone && place.parent ? tree.getPlace(place.parent) : undefined;
  const wsetLevels = wsetLevelsOf(place.id);
  const meta = [zones.length > 0 ? t.subZones(zones.length) : '', guide ? t.readMinutes(guide.minutes) : ''].filter(Boolean).join(' · ');
  // The comparison rows for the measured charts (owner point 10, 18 Oct 2026): a zone's appellation, the study region when it is more than
  // this one place, then Spain.
  const regionM = region && !isZone ? regionMeasuresOf(region.id) : undefined;
  const parentM = parent ? measuresOf(parent.id) : undefined;
  const compare = [
    ...(parent && parentM ? [{ label: parent.name, m: parentM }] : []),
    ...(regionM && measures && JSON.stringify(regionM) !== JSON.stringify(measures) ? [{ label: t.regionRow(region!.name), m: regionM }] : []),
    { label: t.allSpain, m: spainMeasures() },
  ];
  const altitudeCell = glanceCells(sheet, measures).find((c) => c.kind === 'altitude');
  // Each glance row names the section that holds its source (release 9 review: a fact keeps a visible way to its source).
  const glance: Array<[string, string, string]> = [
    [t.level, level, 'where'],
    ...(main.length > 0 ? [[t.mainGrapes, main.map((g) => g.grape ?? g.local).join(', '), 'grapes'] as [string, string, string]] : []),
    ...(kinds.length > 0 ? [[t.wineTypes, kinds.map((k, i) => (i === 0 ? k : k.toLowerCase())).join(', '), 'grapes'] as [string, string, string]] : []),
    ...(altitudeCell ? [[t.altitude, altitudeCell.big, 'land'] as [string, string, string]] : []),
    ...(zones.length > 0 ? [[t.zoneCount, String(zones.length), 'zones'] as [string, string, string]] : []),
  ];
  const toSection = (id: string) => scrollToSection(id);

  return (
    <div ref={pageRef} className="pg" role="region" aria-label={strings.place.page.pageLabel(place.name)}>
      <PageTop tree={tree} go={go} back={{ kind: 'place', id: place.id }} title={place.name} />
      <div className="pg-listing">
        <nav className="kicker crumb" aria-label={tc.whereThisSits}>
          {/* Only the levels above: the title under it names the place (owner, 18 Oct 2026: "Spain and Spain in one screen"). */}
          {trail.slice(0, -1).map((c, i) => <span key={c.id + i} className="step">{i > 0 && <span className="sep" aria-hidden="true">›</span>}<Link to={selectionOf(tree, c)} go={go}>{c.name}</Link></span>)}
        </nav>
        <h1 ref={heading} tabIndex={-1}>{place.name}</h1>
        <ul className="pg-badges" aria-label={t.sections.where}>
          <li className="lvl"><abbr title={isZone ? t.zoneOf(parent?.name ?? '') : t.kindNames[place.kind]}>{level}</abbr></li>
          {region && <li title={t.swsTitle(region.chapter ?? region.name)}>{ownRegion ? t.swsBadge(region.name) : <Link to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.swsBadge(region.name)}</Link>}</li>}
          {wsetLevels.length > 0 && <li title={t.wsetTitle(wsetLevels)}>{t.wsetBadge(wsetLevels)}</li>}
          {meta && <li className="meta">{meta}</li>}
        </ul>
        <Mosaic key={place.id} photos={photos} name={place.name} color={color} />

        <nav ref={jumpBar} className="pg-jump" aria-label={t.jumpLabel}>
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
                    {src(sheet.why.cite)}
                    {official && <p className="official">{official}</p>}
                  </>
                ) : <p className="pg-read">{official}</p>}
              </Section>
            )}

            {guide && (
              <Section id="terroir" title={guide.title}>
                <p className="pg-read">{guide.lede.text}</p>
                {src(guide.lede.cite)}
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
                      {src(ch.cite)}
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
                {src(sheet!.tastes!.cite)}
              </Section>
            )}

            {famous.length > 0 && (
              <Section id="styles" title={t.sections.styles}>
                <ul className="pg-styles">
                  {famous.map((f) => <li key={f.name}><strong>{f.name}</strong>{f.text.trim() && <span>{f.text.trim()}</span>}</li>)}
                </ul>
                {src(sheet!.famous!.cite)}
              </Section>
            )}

            {(main.length > 0 || others.length > 0 || wineTypes) && (
              <Section id="grapes" title={t.sections.grapes}>
                {main.length > 0 && (
                  <>
                    <h3 className="pg-h3">{t.mainGrapes}</h3>
                    <ul className="pg-grapes">{main.map((g) => <li key={g.local}>{grapeLabel(g)}</li>)}</ul>
                    {src(sheet!.grapes.cite)}
                  </>
                )}
                <dl className="pg-rows">
                  {others.length > 0 && (
                    <>
                      <dt>{sheet!.grapes.othersPartial ? t.otherGrapesPartial : t.otherGrapes}</dt>
                      <dd><OtherGrapes names={others} />{src(sheet!.grapes.othersCite)}</dd>
                    </>
                  )}
                  {wineTypes && (
                    <>
                      <dt>{t.wineTypes}</dt>
                      <dd>{wineTypes}{src(sheet!.styles.cite)}</dd>
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
                      {src(sheet!.climate.cite)}
                    </div>
                  )}
                  {koppen.length > 0 && (
                    <div>
                      <h3 className="pg-h3">{t.climateMeasured}</h3>
                      <ClimateBar name={place.name} shares={koppen} compare={compare.map((c) => ({ label: c.label, shares: c.m.koppen }))} />
                      {src(['koppen'])}
                      <p className="pg-note">{t.compareNote}</p>
                    </div>
                  )}
                  {soil && (
                    <div>
                      <h3 className="pg-h3">{t.soil}</h3>
                      <p>{soil}</p>
                      {src(sheet!.soil.cite)}
                    </div>
                  )}
                  {(writtenAltitude || measures) && (
                    <div>
                      <h3 className="pg-h3">{t.altitude}</h3>
                      {measures && <AltitudeRange name={place.name} altitude={measures.altitude} compare={compare.map((c) => ({ label: c.label, altitude: c.m.altitude }))} />}
                      {writtenAltitude && <p>{writtenAltitude}</p>}
                      {measures && <p>{altitudeText(measures.altitude)}</p>}
                      {src([...(writtenAltitude ? sheet!.altitude!.cite : []), ...(measures ? ['measures'] : [])])}
                    </div>
                  )}
                </div>
              </Section>
            )}

            {producers.length > 0 && (
              <Section id="producers" title={t.sections.producers}>
                <ul className="pg-names">{producers.map((p) => <li key={p.name}>{p.wine ? `${p.name} (${p.wine})` : p.name}</li>)}</ul>
                {src(sheet!.producers!.cite)}
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
                          {photo ? <Img key={photo.src} photo={photo} sizes="(max-width: 47.5em) 100vw, 18rem" alt="" lazy /> : <span className="zblank" style={{ background: color }} aria-hidden="true" />}
                          <b>{z.name}</b>
                        </Link>
                        {why && <><p>{why.text}</p>{src(why.cite)}</>}
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
                <dd>{level}{sheet && !isZone && src(['mapa-list'])}</dd>
                {region && !isZone && (<><dt>{t.studyRegion}</dt><dd>{ownRegion ? region.name : <Link to={{ kind: 'region', id: region.id, page: true }} go={go}>{region.name}</Link>}</dd></>)}
                {also.length > 0 && (
                  <>
                    <dt>{t.alsoWithin}</dt>
                    <dd><ul>{also.map((o) => <li key={o.id}><Link to={{ kind: 'place', id: o.id, page: true }} go={go}>{o.name}</Link></li>)}</ul></dd>
                  </>
                )}
              </dl>
              <div className="pg-next">
                {region && !ownRegion && <Link className="btn" to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.allPlacesInRegion}</Link>}
                {next && (
                  <Link className="nextlink" to={{ kind: 'region', id: next.id, page: true }} go={go}>
                    <span className="kicker">{t.nextInCourse}</span>
                    <b>{next.name} →</b>
                  </Link>
                )}
              </div>
            </Section>

            {cited.length > 0 && (
              <Section id="sources" title={t.sections.sources}>
                <SourceList cites={cited} />
              </Section>
            )}
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
