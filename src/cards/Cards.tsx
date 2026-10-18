import { measuresOf, photosOf, sheetOf } from '../facts';
import { Cover as CoverPhoto } from './Cover';
import { glanceCells } from '../pages/helpers';
import { hoverProps } from '../map/hover';
import { regionColor } from '../map/regionColors';
import { strings } from '../strings';
import type { Place, Region, Tree } from '../tree';
import { SPAIN, type Selection } from '../url';
import { CardShell } from './CardShell';
import { Link, type Go } from './Link';
import { SourceLine } from './PlaceFacts';
import { Cover } from './Cover';
import { Glance } from './Glance';
import { Img } from './Img';


const t = strings.cards;
const tp = strings.place;

interface Props {
  tree: Tree;
  go: Go;
}

/** The main grapes most often named first by a region's fact sheets, most common first. */
export function mainGrapes(placeIds: readonly string[], n = 3): string[] {
  const count = new Map<string, number>();
  for (const id of placeIds) {
    const g = sheetOf(id)?.grapes.main?.[0];
    if (g) count.set(g.local, (count.get(g.local) ?? 0) + 1);
  }
  return [...count].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name]) => name);
}

const firstPhoto = (ids: readonly string[]) => ids.map((id) => photosOf(id)[0]).find(Boolean);

interface TileRowProps {
  to: Selection;
  go: Go;
  name: string;
  detail: string;
  photoIds: readonly string[];
  places: () => readonly string[];
  sub?: boolean;
}

/** A row with a photo: the region or place and a short line. Study counts stay in Study (owner, 18 Oct 2026). */
function TileRow({ to, go, name, detail, photoIds, places, sub }: TileRowProps) {
  const photo = firstPhoto(photoIds);
  return (
    <li className={sub ? 'sub' : undefined} {...hoverProps(places)}>
      <Link to={to} go={go}>
        {photo ? <Img key={photo.src} photo={photo} sizes="3.6rem" alt="" lazy /> : <i aria-hidden="true">{name.slice(0, 1)}</i>}
        <span className="txt"><b>{name}</b><small>{detail}</small></span>
        <span className="go" aria-hidden="true">›</span>
      </Link>
    </li>
  );
}

export function SpainCard({ tree, go }: Props) {
  const country = tree.countries[0];
  const regions = tree.regionsOf(country.id);
  const all = regions.flatMap((r) => tree.placesInRegion(r.id));
  // Spain leads with its own cover, not the Rioja card's (site visual review, 18 Oct 2026).
  const covers = ['jerez', 'rias-baixas', 'rioja'].map((id) => photosOf(id)[0]).filter(Boolean);
  return (
    <CardShell
      tree={tree} go={go} trail={tree.breadcrumb(country.id, 'country')} title={country.name}
      cover={<div className="cover-short"><CoverPhoto name={country.name} color="#141414" photos={covers} /></div>}
    >
      <p className="lede">{t.spainLedeRich(all.length, regions.length)} <span className="hoverhint">{t.hoverRegion}</span></p>
      <h2>{t.regions}</h2>
      <ul className="tiles">
        {regions.map((r) => {
          const ids = tree.placesInRegion(r.id).map((p) => p.id);
          const grapes = mainGrapes(ids);
          const sole = tree.soleSameName(r.id);
          return (
            <TileRow
              key={r.id} to={sole ? { kind: 'place', id: sole.id } : { kind: 'region', id: r.id }} go={go} name={r.name} photoIds={ids} places={() => ids}
              detail={[sole ? sole.kind : t.placeCount(ids.length), grapes.join(', ')].filter(Boolean).join(' · ')}
            />
          );
        })}
      </ul>
    </CardShell>
  );
}

export function RegionCard({ tree, go, region }: Props & { region: Region }) {
  const places = tree.placesInRegion(region.id);
  const ids = places.map((p) => p.id);
  const grapes = mainGrapes(ids, 4);
  const cover = places.flatMap((p) => photosOf(p.id)).slice(0, 4);
  return (
    <CardShell
      tree={tree} go={go} trail={tree.breadcrumb(region.id, 'region')} title={region.name} close={{ to: tree.breadcrumb(region.id, 'region')[0] }}
      cover={<div className="cover-short"><CoverPhoto name={region.name} color="#141414" photos={cover} /></div>}
      foot={(
        <>
          <Link className="btn primary" to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.openPage(region.name)}</Link>
        </>
      )}
    >
      <p className="lede">{t.regionLedeRich(places.length)} <span className="hoverhint">{t.hoverPlace}</span></p>
      {grapes.length > 0 && (
        <>
          <h2>{t.mainGrapesHere}</h2>
          <ul className="chips plain">{grapes.map((g) => <li key={g}>{g}</li>)}</ul>
        </>
      )}
      <h2>{t.placesHeading}</h2>
      <ul className="tiles">
        {places.flatMap((p) => {
          const zones = tree.children(p.id, 'place') as Place[];
          return [
            <TileRow key={p.id} to={{ kind: 'place', id: p.id }} go={go} name={p.name} detail={p.kind} photoIds={[p.id]} places={() => [p.id]} />,
            ...zones.map((z) => <TileRow key={z.id} sub to={{ kind: 'place', id: z.id }} go={go} name={z.name} detail={t.zoneLevel} photoIds={[z.id]} places={() => [z.id]} />),
          ];
        })}
      </ul>
    </CardShell>
  );
}

function ZoneRow({ zone, go, color }: { zone: Place; go: Go; color: string }) {
  const photo = photosOf(zone.id)[0];
  return (
    <li {...hoverProps(() => [zone.id])}>
      <Link to={{ kind: 'place', id: zone.id }} go={go}>
        {photo ? <Img key={photo.src} photo={photo} sizes="3.4rem" alt="" lazy /> : <i style={{ background: color }} aria-hidden="true" />}
        <span><b>{zone.name}</b><small>{t.zoneLevel}</small></span>
        <span className="go" aria-hidden="true">›</span>
      </Link>
    </li>
  );
}

/** The place card as a teaser: cover photo, title, sub line, the opening sentence with its source, three facts, the zones and a way to the full page. */
export function PlaceCard({ tree, go, place }: Props & { place: Place }) {
  const trail = tree.breadcrumb(place.id, 'place');
  const up = trail[trail.length - 2];
  const region = tree.getRegion(place.region);
  const zones = tree.children(place.id, 'place') as Place[];
  const isZone = tree.levelName(place) === 'zone';
  const quizzed = place.quiz !== 'none';
  const sheet = quizzed ? sheetOf(place.id) : undefined;
  const measures = quizzed ? measuresOf(place.id) : undefined;
  const color = regionColor(place.region);
  const official = place.official && place.official !== place.name ? place.official : undefined;
  const famous = sheet?.famous?.styles ?? [];
  return (
    <CardShell
      tree={tree} go={go} trail={trail} suffix={isZone ? undefined : place.kind} title={place.name} close={up ? { to: up } : undefined}
      cover={<Cover key={place.id} name={place.name} color={color} photos={quizzed ? photosOf(place.id) : []} />}
      foot={<Link className="btn primary" to={{ kind: 'place', id: place.id, page: true }} go={go}>{t.openPage(place.name)}</Link>}
    >
      <p className="sub">{tp.subLine(isZone ? t.zoneLevel : place.kind, region?.name ?? '')}</p>
      {sheet ? (
        <>
          <p className="lede">{sheet.why.text}</p>
          <SourceLine cites={sheet.why.cite} />
          {official && <p className="official">{official}</p>}
        </>
      ) : official && <p className="lede">{official}</p>}
      <Glance cells={glanceCells(sheet, measures)} />
      {famous.length > 0 && (
        <>
          <h2>{tp.famousStyles}</h2>
          <ul className="chips">{famous.map((f) => <li key={f.name}>{f.name}</li>)}</ul>
        </>
      )}
      {zones.length > 0 && (
        <>
          <h2>{t.zones}</h2>
          <ul className="zrow">{zones.map((z) => <ZoneRow key={z.id} zone={z} go={go} color={color} />)}</ul>
        </>
      )}
      {place.boundary === 'to-fetch' && <p className="note">{t.noBoundary}</p>}
    </CardShell>
  );
}
