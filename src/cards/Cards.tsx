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
import { Credit } from './Credit';
import type { ShownPhoto } from '../facts';
import { placeLine, regionLine, spainLine, type TileLine } from '../facts/tiles';


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

/** The first form of a two-language name («Bizkaiko Txakolina / Txakolí de Bizkaia»), as on the map; the card title keeps both. */
const firstName = (name: string) => name.split(' / ')[0];

const firstPhoto = (ids: readonly string[]) => ids.map((id) => photosOf(id)[0]).find(Boolean);

interface TileProps {
  to: Selection;
  go: Go;
  name: string;
  /** Small label above the name: the place count or the place's kind. */
  label: string;
  /** The headline from content/tiles.json; a place without a fact sheet has none yet. */
  line?: string;
  photoIds: readonly string[];
  places: () => readonly string[];
}

/** A photo card: the region or place, a small label and its headline (owner points 15 and 16, 18 Oct 2026). Study counts stay in Study. */
function Tile({ to, go, name, label, line, photoIds, places }: TileProps) {
  const photo = firstPhoto(photoIds);
  return (
    <li {...hoverProps(places)}>
      <Link to={to} go={go} title={line ? `${name}: ${line}` : t.openPage(name)}>
        <span className="ph">{photo ? <Img key={photo.src} photo={photo} sizes="(max-width: 47.5em) 50vw, 15rem" alt="" lazy /> : <i aria-hidden="true">{name.slice(0, 1)}</i>}</span>
        <span className="txt"><b>{firstName(name)}</b><small>{label}</small>{line && <em>{line}</em>}</span>
      </Link>
    </li>
  );
}

/** The credits of the tile photos, in one line under the tiles: never text on a photo (Review/visual-style.md "Photos", 18 Oct 2026). */
function TileCredits({ photoIds }: { photoIds: readonly (readonly string[])[] }) {
  const shown = photoIds.map(firstPhoto).filter((p): p is ShownPhoto => !!p);
  if (shown.length === 0) return null;
  return <p className="tile-credits">{t.tilePhotos} {shown.map((p, i) => <span key={p.src}>{i > 0 && '; '}<Credit photo={p} /></span>)}</p>;
}

/** Tiles in two columns; with an odd count the first one runs full width, so no tile sits alone. */
const tileClass = (n: number) => (n % 2 === 1 ? 'tiles lead' : 'tiles');

/** A country or region lede from content/tiles.json; the old count line where none is written yet. It names the places whose official
 *  documents it restates, each a link to that place's card, where the cited line sits (one short trail, not a row of document tags). */
function Lede({ tree, go, line, fallback, hint }: { tree: Tree; go: Go; line?: TileLine; fallback: string; hint: string }) {
  if (!line?.lede) return <p className="lede">{fallback} <span className="hoverhint">{hint}</span></p>;
  const from = (line.from ?? []).map((id) => tree.getPlace(id)).filter((p): p is Place => !!p);
  return (
    <>
      <p className="lede">{line.lede}</p>
      <p className="ledesrc">
        {from.length > 0 && (
          <>{t.ledeFrom} {from.map((p, i) => (
            <span key={p.id}>{i > 0 && (i === from.length - 1 ? t.ledeAnd : ', ')}<Link to={{ kind: 'place', id: p.id }} go={go}>{firstName(p.name)}</Link></span>
          ))}. </>
        )}
        <span className="hoverhint">{hint}</span>
      </p>
    </>
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
      <Lede tree={tree} go={go} line={spainLine()} fallback={t.spainLedeRich(all.length, regions.length)} hint={t.hoverRegion} />
      <h2>{t.regions}</h2>
      <ul className={tileClass(regions.length)}>
        {regions.map((r) => {
          const ids = tree.placesInRegion(r.id).map((p) => p.id);
          const sole = tree.soleSameName(r.id);
          return (
            <Tile
              key={r.id} to={sole ? { kind: 'place', id: sole.id } : { kind: 'region', id: r.id }} go={go} name={r.name} photoIds={ids} places={() => ids}
              label={sole ? sole.kind : t.placeCount(ids.length)} line={regionLine(r.id)?.title}
            />
          );
        })}
      </ul>
      <TileCredits photoIds={regions.map((r) => tree.placesInRegion(r.id).map((p) => p.id))} />
    </CardShell>
  );
}

export function RegionCard({ tree, go, region }: Props & { region: Region }) {
  const places = tree.placesInRegion(region.id);
  const ids = places.map((p) => p.id);
  const grapes = mainGrapes(ids, 4);
  const cover = places.flatMap((p) => photosOf(p.id)).slice(0, 4);
  const rows = places.flatMap((p) => [{ p, zone: false }, ...(tree.children(p.id, 'place') as Place[]).map((z) => ({ p: z, zone: true }))]);
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
      <Lede tree={tree} go={go} line={regionLine(region.id)} fallback={t.regionLedeRich(places.length)} hint={t.hoverPlace} />
      {grapes.length > 0 && (
        <>
          <h2>{t.mainGrapesHere}</h2>
          <ul className="chips plain">{grapes.map((g) => <li key={g}>{g}</li>)}</ul>
        </>
      )}
      <h2>{t.placesHeading}</h2>
      <ul className={tileClass(rows.length)}>
        {rows.map(({ p, zone }) => (
          <Tile key={p.id} to={{ kind: 'place', id: p.id }} go={go} name={p.name} label={zone ? t.zoneLevel : p.kind} line={placeLine(p.id)?.title} photoIds={[p.id]} places={() => [p.id]} />
        ))}
      </ul>
      <TileCredits photoIds={rows.map(({ p }) => [p.id])} />
    </CardShell>
  );
}

function ZoneRow({ zone, go, color }: { zone: Place; go: Go; color: string }) {
  const photo = photosOf(zone.id)[0];
  return (
    <li {...hoverProps(() => [zone.id])}>
      <Link to={{ kind: 'place', id: zone.id }} go={go} title={t.openPage(zone.name)}>
        {photo ? <Img key={photo.src} photo={photo} sizes="3.4rem" alt="" lazy /> : <i style={{ background: color }} aria-hidden="true" />}
        <span><b>{zone.name}</b><small>{placeLine(zone.id)?.title ?? t.zoneLevel}</small></span>
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
