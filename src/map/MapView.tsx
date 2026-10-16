import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';
import type { View } from '../url';
import { createMap, type MapController } from './createMap';
import type { Focus } from './focus';
import { DEFAULT_MENU, type MenuState } from './layers';
import { MapMenu } from './MapMenu';
import './map.css';

const t = strings.map;

interface Props {
  /** What the open card wants the map to show. */
  focus: Focus;
  /** The camera from the address bar; the first card does not frame over it. */
  restored: View | null;
  onPick(placeId: string): void;
  onView(view: View): void;
}

/** The map element, the map menu with zoom and compass buttons, and the imagery note. */
export function MapView({ focus, restored, onPick, onView }: Props) {
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
    c.map.on('rotate', () => setTurned(Math.abs(c.map.getBearing()) > 0.5));
    return () => { c.remove(); ctl.current = null; };
  }, []);

  useEffect(() => { ctl.current?.apply(menu, !imageryFailed); }, [menu, imageryFailed]);

  // The card is in the page by now, so the framing can leave room for it.
  useEffect(() => {
    ctl.current?.focus(focus, shown.current);
    shown.current = true;
  }, [focus]);

  const icon = (d: string) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d={d} /></svg>
  );
  return (
    <>
      <div id="map" ref={el} role="application" aria-label={strings.mapMountLabel} />
      <div className="bottomright">
        <MapMenu menu={menu} imageryFailed={imageryFailed} onChange={setMenu} />
        <div className="glass">
          <button className="iconbtn" aria-label={t.zoomIn} onClick={() => ctl.current?.map.zoomIn()}>{icon('M12 5v14M5 12h14')}</button>
          <button className="iconbtn" aria-label={t.zoomOut} onClick={() => ctl.current?.map.zoomOut()}>{icon('M5 12h14')}</button>
          {turned && (
            <button className="iconbtn" aria-label={t.north} onClick={() => ctl.current?.map.easeTo({ bearing: 0 })}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 5l3 7-3 7-3-7z" fill="currentColor" /></svg>
            </button>
          )}
        </div>
      </div>
      {dataFailed && (
        <div className="glass imagery-note" role="alert">
          <span>{t.dataNote}</span>
          <button className="btn" onClick={() => location.reload()}>{t.reload}</button>
        </div>
      )}
      {!dataFailed && imageryFailed && noteShown && (
        <div className="glass imagery-note" role="status">
          <span>{t.imageryNote}</span>
          <button className="iconbtn" aria-label={t.dismissNote} onClick={() => setNoteShown(false)}>{icon('M6 6l12 12M18 6L6 18')}</button>
        </div>
      )}
    </>
  );
}
