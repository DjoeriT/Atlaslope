import { measuresOf, photosOf, sheetOf } from '../facts';
import { regionColor } from '../map/regionColors';
import { strings } from '../strings';
import type { Place, Region, Tree } from '../tree';
import { SPAIN, type Selection } from '../url';
import { CardShell } from './CardShell';
import { Link, type Go } from './Link';
import { FactRows, Photos, ReportLink, SourceLine } from './PlaceFacts';

const t = strings.cards;

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
      foot={<Link className="btn quiet" to={SPAIN} go={go}>{t.allOfSpain}</Link>}
    >
      <p className="lede">{t.regionLede(places.length)}</p>
      <ul className="tree">
        {places.map((p) => <Row key={p.id} to={{ kind: 'place', id: p.id }} go={go} name={p.name} detail={p.kind} color={regionColor(region.id)} />)}
      </ul>
    </CardShell>
  );
}

function PlaceLink({ place, go }: { place: Place; go: Go }) {
  return <Link to={{ kind: 'place', id: place.id }} go={go}>{place.name}</Link>;
}

/** The fact sheet (why line, rows with their sources, measured altitude and climate), photos, "Report a mistake", then where the place sits. */
export function PlaceCard({ tree, go, place }: Props & { place: Place }) {
  const trail = tree.breadcrumb(place.id, 'place');
  const up = trail[trail.length - 2];
  const region = tree.getRegion(place.region);
  const also = tree.alsoWithin(place.id);
  const zones = tree.children(place.id, 'place') as Place[];
  const isZone = tree.levelName(place) === 'zone';
  const quizzed = place.quiz !== 'none';
  const sheet = quizzed ? sheetOf(place.id) : undefined;
  const measures = quizzed ? measuresOf(place.id) : undefined;
  const photos = quizzed ? photosOf(place.id) : [];
  const where = (
    <>
      {region && !isZone && (<><dt>{t.studyRegion}</dt><dd><Link to={{ kind: 'region', id: region.id }} go={go}>{region.name}</Link></dd></>)}
      {also.length > 0 && (<><dt>{t.alsoWithin}</dt><dd><ul>{also.map((o) => <li key={o.id}><PlaceLink place={o} go={go} /></li>)}</ul></dd></>)}
    </>
  );
  const official = place.official && place.official !== place.name ? place.official : undefined;
  const level = <><dt>{t.level}</dt><dd>{isZone ? t.zoneLevel : place.kind}{sheet && !isZone && <SourceLine cites={['mapa-list']} />}</dd></>;
  return (
    <CardShell tree={tree} go={go} trail={trail} suffix={isZone ? undefined : place.kind} title={place.name} close={up ? { to: up } : undefined}>
      {sheet ? (
        <>
          <p className="lede">{sheet.why.text}</p>
          <SourceLine cites={sheet.why.cite} />
          {official && <p className="official">{official}</p>}
        </>
      ) : official && <p className="lede">{official}</p>}
      {quizzed ? (
        <>
          <dl className="facts">{level}<FactRows sheet={sheet} measures={measures} /></dl>
          <Photos photos={photos} />
          {sheet && <ReportLink id={place.id} name={place.name} />}
          <dl className="facts">{where}</dl>
        </>
      ) : (
        <dl className="facts">{level}{where}</dl>
      )}
      {zones.length > 0 && (
        <>
          <h2>{t.zones}</h2>
          <ul className="tree">
            {zones.map((z) => <Row key={z.id} to={{ kind: 'place', id: z.id }} go={go} name={z.name} detail={t.zoneLevel} color={regionColor(place.region)} />)}
          </ul>
        </>
      )}
      {place.boundary === 'to-fetch' && <p className="note">{t.noBoundary}</p>}
    </CardShell>
  );
}
