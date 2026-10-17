import { measuresOf, photosOf, sheetOf } from '../facts';
import { glanceCells } from '../pages/helpers';
import { regionColor } from '../map/regionColors';
import { strings } from '../strings';
import type { Place, Region, Tree } from '../tree';
import { SPAIN, type Selection } from '../url';
import { CardShell } from './CardShell';
import { Link, type Go } from './Link';
import { SourceLine } from './PlaceFacts';
import { Cover } from './Cover';
import { Glance } from './Glance';


const t = strings.cards;
const tp = strings.place;

interface Props {
  tree: Tree;
  go: Go;
}

interface RowProps {
  to: Selection;
  go: Go;
  name: string;
  detail: string;
  color: string;
}

function Row({ to, go, name, detail, color }: RowProps) {
  return (
    <li>
      <i style={{ background: color }} aria-hidden="true" />
      <Link to={to} go={go}><b>{name}</b><small>{detail}</small></Link>
      <span className="go" aria-hidden="true">›</span>
    </li>
  );
}

export function SpainCard({ tree, go }: Props) {
  const country = tree.countries[0];
  return (
    <CardShell tree={tree} go={go} trail={tree.breadcrumb(country.id, 'country')} title={country.name}>
      <p className="lede">{t.spainLede}</p>
      <ul className="tree">
        {tree.regionsOf(country.id).map((r) => (
          <Row key={r.id} to={{ kind: 'region', id: r.id }} go={go} name={r.name} detail={t.placeCount(tree.placesInRegion(r.id).length)} color={regionColor(r.id)} />
        ))}
      </ul>
    </CardShell>
  );
}

export function RegionCard({ tree, go, region }: Props & { region: Region }) {
  const places = tree.placesInRegion(region.id);
  return (
    <CardShell
      tree={tree} go={go} trail={tree.breadcrumb(region.id, 'region')} title={region.name}
      foot={(
        <>
          <Link className="btn primary" to={{ kind: 'region', id: region.id, page: true }} go={go}>{t.seeRegion}</Link>
          <Link className="btn quiet" to={SPAIN} go={go}>{t.allOfSpain}</Link>
        </>
      )}
    >
      <p className="lede">{t.regionLede(places.length)}</p>
      <ul className="tree">
        {places.map((p) => <Row key={p.id} to={{ kind: 'place', id: p.id }} go={go} name={p.name} detail={p.kind} color={regionColor(region.id)} />)}
      </ul>
    </CardShell>
  );
}

function ZoneRow({ zone, go, color }: { zone: Place; go: Go; color: string }) {
  const photo = photosOf(zone.id)[0];
  return (
    <li>
      <Link to={{ kind: 'place', id: zone.id }} go={go}>
        {photo ? <img src={photo.src} alt="" loading="lazy" /> : <i style={{ background: color }} aria-hidden="true" />}
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
      foot={<Link className="btn primary" to={{ kind: 'place', id: place.id, page: true }} go={go}>{tp.readFullPage}</Link>}
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
