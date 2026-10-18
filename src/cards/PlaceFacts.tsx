import { useState, type ReactNode } from 'react';
import { altitudeText, grapeLabel, tasteLines, koppenText, sourceRefs, sources, type Cite, type Measures, type ShownPhoto, type Sheet } from '../facts';
import { strings } from '../strings';
import { Img } from './Img';

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
export function OtherGrapes({ names }: { names: string[] }) {
  const [open, setOpen] = useState(false);
  if (names.length <= SHORT_LIST) return <>{names.join(', ')}</>;
  const shown = SHORT_LIST - 2;
  // The button stays mounted when open, so keyboard focus is not lost.
  return (
    <>
      {names.slice(0, shown).join(', ')}
      {open && <>, {names.slice(shown).join(', ')}</>}{' '}
      <button type="button" className="more" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? t.fewerGrapes : t.moreGrapes(names.length - shown)}
      </button>
    </>
  );
}

interface FactRowsProps {
  sheet?: Sheet;
  measures?: Measures;
}

/** The rows after Level: main and other grapes, styles, famous styles, how it tastes, written climate, measured climate, altitude, soil,
 * famous producers. Empty rows are left out. */
export function FactRows({ sheet, measures }: FactRowsProps) {
  const main = sheet?.grapes.main ?? [];
  const others = sheet?.grapes.others ?? [];
  const kinds = (sheet?.styles.kinds ?? []).map((k) => t.styleKinds[k]).join(', ');
  const styles = sheet?.styles.text.trim() || kinds;
  const climate = sheet?.climate.text.trim();
  const soil = sheet?.soil.text.trim();
  const writtenAltitude = sheet?.altitude?.text.trim();
  const tastes = sheet?.tastes?.text.trim();
  const famous = sheet?.famous?.styles ?? [];
  const producers = sheet?.producers?.items ?? [];
  return (
    <>
      {main.length > 0 && <Row label={t.mainGrapes} cites={sheet!.grapes.cite}>{main.map(grapeLabel).join(', ')}</Row>}
      {others.length > 0 && <Row label={sheet!.grapes.othersPartial ? t.otherGrapesPartial : t.otherGrapes} cites={sheet!.grapes.othersCite}><OtherGrapes names={others} /></Row>}
      {styles && <Row label={t.styles} cites={sheet!.styles.cite}>{styles}</Row>}
      {famous.length > 0 && (
        <Row label={t.famousStyles} cites={sheet!.famous!.cite}>
          <ul className="named">{famous.map((f) => <li key={f.name}><strong>{f.name}</strong>{f.text.trim() && <>: {f.text.trim()}</>}</li>)}</ul>
        </Row>
      )}
      {tastes && (
        <Row label={t.tastes} cites={sheet!.tastes!.cite}>
          <ul className="named">{tasteLines(tastes).map((l, i) => <li key={i}>{l.label && <><strong>{l.label}</strong>: </>}{l.text}</li>)}</ul>
        </Row>
      )}
      {climate && <Row label={t.climate} cites={sheet!.climate.cite}>{climate}</Row>}
      {measures && measures.koppen.length > 0 && <Row label={t.koppen} cites={['koppen']}>{koppenText(measures.koppen)}</Row>}
      {(writtenAltitude || measures) && (
        <Row label={t.altitude} cites={[...(writtenAltitude ? sheet!.altitude!.cite : []), ...(measures ? ['measures'] : [])]}>
          {writtenAltitude && <span className="written">{writtenAltitude}</span>}
          {measures && <span className="measured">{altitudeText(measures.altitude)}</span>}
        </Row>
      )}
      {soil && <Row label={t.soil} cites={sheet!.soil.cite}>{soil}</Row>}
      {producers.length > 0 && (
        <Row label={t.producers} cites={sheet!.producers!.cite}>
          {producers.map((p) => (p.wine ? `${p.name} (${p.wine})` : p.name)).join(', ')}
        </Row>
      )}
    </>
  );
}

function PhotoFigure({ photo }: { photo: ShownPhoto }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <li>
      <figure className="photo">
        <Img photo={photo} sizes="12rem" lazy onError={() => setBroken(true)} />
        <figcaption className="src">
          {t.photoCredit} <a href={photo.page} target="_blank" rel="noopener noreferrer">{photo.artist}, {photo.licence}</a>
        </figcaption>
      </figure>
    </li>
  );
}

export function Photos({ photos }: { photos: ShownPhoto[] }) {
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
