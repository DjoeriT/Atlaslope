import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';
import type { View } from '../url';
import { createMap, type MapController } from './createMap';
import type { Focus } from './focus';
import { afterMotion } from '../app/motion';
import { DEFAULT_MENU, type MenuState } from './layers';
import { MapMenu } from './MapMenu';
import { onHoverPlaces } from './hover';
import { CLIMATE_GROUPS } from './climate';
import { regionColor } from './regionColors';
import type { QuizView } from './quiz';
import './map.css';

const t = strings.map;

interface Props {
  /** What the open card wants the map to show. */
  focus: Focus;
  /** The camera from the address bar; the first card does not frame over it. */
  restored: View | null;
  /** Quiz mode when set: flat, north up, names as the quiz asks. Null is Explore. */
  quiz: QuizView | null;
  onPick(placeId: string): void;
  onView(view: View): void;
  /** The study regions, for the legend when places are coloured by region. */
  regions?: readonly { id: string; name: string }[];
}

/** The map element, the map menu with zoom, reset-view and compass buttons, and the imagery note. */
export function MapView({ focus, restored, quiz, onPick, onView, regions = [] }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const ctl = useRef<MapController | null>(null);
  const [menu, setMenu] = useState<MenuState>(DEFAULT_MENU);
  const [imageryFailed, setImageryFailed] = useState(false);
  const [dataFailed, setDataFailed] = useState(false);
  const [noteShown, setNoteShown] = useState(true);
  const [turned, setTurned] = useState(false);
  const calls = useRef({ onPick, onView });
  calls.current = { onPick, onView };
  const shown = useRef(false);

  useEffect(() => {
    let c: MapController;
    try {
      c = createMap(el.current as HTMLElement, DEFAULT_MENU, {
        onImageryFailed: () => setImageryFailed(true),
        onDataFailed: () => setDataFailed(true),
        onPick: (id) => calls.current.onPick(id),
        onView: (v) => calls.current.onView(v),
      }, restored);
    } catch {
      return; // no WebGL: the shell still works
    }
    ctl.current = c;
    const onTurn = () => setTurned(Math.abs(c.map.getBearing()) > 0.5);
    c.map.on('rotate', onTurn);
    onTurn(); // a link or reload can open the map already turned
    return () => { c.remove(); ctl.current = null; };
  }, []);

  useEffect(() => { ctl.current?.apply(menu, !imageryFailed); }, [menu, imageryFailed]);

  // The card is in the page by now, so the framing can leave room for it.
  // It flies once the card's own move has finished, so the two don't stutter against each other.
  useEffect(() => {
    const animate = shown.current;
    shown.current = true;
    let live = true;
    afterMotion(() => { if (live) ctl.current?.focus(focus, animate); });
    return () => { live = false; };
  }, [focus]);

  useEffect(() => { ctl.current?.quiz(quiz); }, [quiz]);

  // A card's row lights its places up; a new card starts with nothing lit (its rows were never left, so no mouseleave came).
  useEffect(() => onHoverPlaces((ids) => ctl.current?.hover(ids)), []);
  useEffect(() => { ctl.current?.hover(null); }, [focus]);

  const icon = (d: string) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d={d} /></svg>
  );
  return (
    <>
      <div id="map" ref={el} data-base={menu.satellite && !imageryFailed ? 'satellite' : 'atlas'} role="application" aria-label={quiz ? strings.quiz.mapLabel : strings.mapMountLabel} />
      <div className="bottomright">
        <MapMenu menu={menu} imageryFailed={imageryFailed} onChange={setMenu} />
        <div className="glass zoomset">
          <button className="iconbtn" aria-label={t.zoomIn} title={t.zoomIn} onClick={() => ctl.current?.map.zoomIn()}>{icon('M12 5v14M5 12h14')}</button>
          <button className="iconbtn" aria-label={t.zoomOut} title={t.zoomOut} onClick={() => ctl.current?.map.zoomOut()}>{icon('M5 12h14')}</button>
          {!quiz && (
            <button className="iconbtn" aria-label={t.resetView} title={t.resetView} onClick={() => ctl.current?.reset()}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /><circle cx="12" cy="12" r="2.2" /></svg>
            </button>
          )}
          {turned && (
            <button className="iconbtn" aria-label={t.north} title={t.north} onClick={() => ctl.current?.map.easeTo({ bearing: 0 })}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 5l3 7-3 7-3-7z" fill="currentColor" /></svg>
            </button>
          )}
        </div>
      </div>
      {!quiz && menu.boundaries && <Legend title={menu.colourBy === 'climate' ? t.legendTitle : t.legendRegions} rows={menu.colourBy === 'climate' ? CLIMATE_GROUPS : regions.map((r) => ({ id: r.id, label: r.name, color: regionColor(r.id) }))} />}
      {dataFailed && (
        <div className="glass imagery-note" role="alert">
          <span>{t.dataNote}</span>
          <button className="btn" onClick={() => location.reload()}>{t.reload}</button>
        </div>
      )}
      {!dataFailed && imageryFailed && noteShown && (
        <div className="glass imagery-note" role="status">
          <span>{t.imageryNote}</span>
          <button className="iconbtn" aria-label={t.dismissNote} title={t.dismissNote} onClick={() => setNoteShown(false)}>{icon('M6 6l12 12M18 6L6 18')}</button>
        </div>
      )}
    </>
  );
}

/** What the place colours mean. Swatches are drawn the way the map draws a place: a light fill with a solid edge.
 *  On a phone it folds into a small button so it doesn't cover the map; the list opens on a tap. */
function Legend({ title, rows }: { title: string; rows: readonly { id: string; label: string; note?: string; codes?: string[]; color: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass legend" role="group" aria-label={title} data-open={open || undefined}>
      <button className="legend-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="sw" aria-hidden="true">{rows.slice(0, 6).map((r) => <i key={r.id} style={{ ['--sw' as string]: r.color }} />)}</span>
        {title}
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <b>{title}</b>
      <ul>{rows.map((r) => (
        <li key={r.id} title={r.codes ? `Köppen ${r.codes.join(', ')}` : undefined}>
          <i style={{ ['--sw' as string]: r.color }} aria-hidden="true" />
          <span>{r.label}{r.note && <> <small>{r.note}</small></>}</span>
        </li>
      ))}</ul>
    </div>
  );
}
