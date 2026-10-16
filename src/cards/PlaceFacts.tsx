import { useState, type ReactNode } from 'react';
import { altitudeText, grapeLabel, koppenText, sourceRefs, sources, type Cite, type Measures, type Photo, type Sheet } from '../facts';
import { strings } from '../strings';

const t = strings.facts;

/** The line under a row: source title, page, and the year when the source is old, each source a link that opens in a new tab. */
export function SourceLine({ cites }: { cites: Cite[] }) {
  const refs = sourceRefs(cites, sources);
  if (refs.length === 0) return null;
  return (
    <span className="src">
      {refs.map((r, i) => (
        <span key={r.id}>
          {i > 0 && '; '}
          <a href={r.url} target="_blank" rel="noopener noreferrer">{[r.title, r.pages, r.year].filter(Boolean).join(', ')}</a>
        </span>
      ))}
    </span>
  );
}

function Row({ label, cites, children }: { label: string; cites: Cite[]; children: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}<SourceLine cites={cites} /></dd>
    </>
  );
}

const SHORT_LIST = 8;

/** Long allowed lists (the Canary Islands allow 30 grapes) show the first few and a button for the rest. */
function OtherGrapes({ names }: { names: string[] }) {
  const [open, setOpen] = useState(false);
  if (names.length <= SHORT_LIST || open) return <>{names.join(', ')}</>;
  return (
    <>
      {names.slice(0, SHORT_LIST - 2).join(', ')}{' '}
      <button type="button" className="more" aria-expanded="false" onClick={() => setOpen(true)}>{t.moreGrapes(names.length - (SHORT_LIST - 2))}</button>
    </>
  );
}

interface FactRowsProps {
  sheet?: Sheet;
  measures?: Measures;
}

/** The rows after Level: main and other grapes, styles, written climate, measured climate, altitude, soil. Empty rows are left out. */
export function FactRows({ sheet, measures }: FactRowsProps) {
  const main = sheet?.grapes.main ?? [];
  const others = sheet?.grapes.others ?? [];
  const kinds = (sheet?.styles.kinds ?? []).map((k) => t.styleKinds[k]).join(', ');
  const styles = sheet?.styles.text.trim() || kinds;
  const climate = sheet?.climate.text.trim();
  const soil = sheet?.soil.text.trim();
  const writtenAltitude = sheet?.altitude?.text.trim();
  return (
    <>
      {main.length > 0 && <Row label={t.mainGrapes} cites={sheet!.grapes.cite}>{main.map(grapeLabel).join(', ')}</Row>}
      {others.length > 0 && <Row label={sheet!.grapes.othersPartial ? t.otherGrapesPartial : t.otherGrapes} cites={sheet!.grapes.othersCite}><OtherGrapes names={others} /></Row>}
      {styles && <Row label={t.styles} cites={sheet!.styles.cite}>{styles}</Row>}
      {climate && <Row label={t.climate} cites={sheet!.climate.cite}>{climate}</Row>}
      {measures && measures.koppen.length > 0 && <Row label={t.koppen} cites={['koppen']}>{koppenText(measures.koppen)}</Row>}
      {(writtenAltitude || measures) && (
        <Row label={t.altitude} cites={[...(writtenAltitude ? sheet!.altitude!.cite : []), ...(measures ? ['measures'] : [])]}>
          {writtenAltitude && <span className="written">{writtenAltitude}</span>}
          {measures && <span className="measured">{altitudeText(measures.altitude)}</span>}
        </Row>
      )}
      {soil && <Row label={t.soil} cites={sheet!.soil.cite}>{soil}</Row>}
    </>
  );
}

function PhotoFigure({ photo }: { photo: Photo & { src: string } }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <li>
      <figure className="photo">
        <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => setBroken(true)} />
        <figcaption className="src">
          {t.photoCredit} <a href={photo.page} target="_blank" rel="noopener noreferrer">{photo.artist}, {photo.licence}</a>
        </figcaption>
      </figure>
    </li>
  );
}

export function Photos({ photos }: { photos: Array<Photo & { src: string }> }) {
  if (photos.length === 0) return null;
  return <ul className="photos" aria-label={t.photos}>{photos.map((p) => <PhotoFigure key={p.src} photo={p} />)}</ul>;
}

/** A prefilled email naming the place; hidden until the owner has chosen the address. */
export function ReportLink({ id, name }: { id: string; name: string }) {
  const address = t.reportAddress;
  if (address === '') return null;
  const href = `mailto:${address}?subject=${encodeURIComponent(t.reportSubject(name))}&body=${encodeURIComponent(t.reportBody(name, id))}`;
  return <p className="report"><a className="btn quiet" href={href}>{t.reportLink}</a></p>;
}
