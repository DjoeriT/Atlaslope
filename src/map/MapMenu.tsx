import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';
import type { MenuState } from './layers';

const t = strings.map;

interface Props {
  menu: MenuState;
  /** Imagery is missing or failed: the satellite choice is shown but cannot be switched on. */
  imageryFailed: boolean;
  onChange(next: MenuState): void;
}

/** The one map menu: satellite, 3D relief, place boundaries, and what the place colours show (climate or study region). */
export function MapMenu({ menu, imageryFailed, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panel.current?.contains(target) && !button.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const toggle = (key: 'satellite' | 'relief' | 'boundaries') => onChange({ ...menu, [key]: !menu[key] });
  return (
    <>
      {open && (
        <div id="layers-menu" ref={panel} className="glass menu br" role="group" aria-label={t.menuTitle}>
          <h4>{t.menuTitle}</h4>
          <label>
            <input type="checkbox" checked={menu.satellite && !imageryFailed} disabled={imageryFailed} onChange={() => toggle('satellite')} />
            {t.satellite}
            {imageryFailed && <small>{t.satelliteUnavailable}</small>}
          </label>
          <label><input type="checkbox" checked={menu.relief} onChange={() => toggle('relief')} />{t.relief}</label>
          <label><input type="checkbox" checked={menu.boundaries} onChange={() => toggle('boundaries')} />{t.boundaries}</label>
          <fieldset className="colourby" disabled={!menu.boundaries}>
            <legend>{t.colourBy}</legend>
            <label><input type="radio" name="colourby" checked={menu.colourBy === 'climate'} onChange={() => onChange({ ...menu, colourBy: 'climate' })} />{t.byClimate}</label>
            <label><input type="radio" name="colourby" checked={menu.colourBy === 'region'} onChange={() => onChange({ ...menu, colourBy: 'region' })} />{t.byRegion}</label>
            {!menu.boundaries && <small className="hint">{t.colourByOff}</small>}
          </fieldset>
        </div>
      )}
      <div className="glass">
        <button ref={button} className="iconbtn" aria-label={t.menuButton} title={t.menuButton} aria-expanded={open} aria-controls="layers-menu" onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17l9 5 9-5" /></svg>
        </button>
      </div>
    </>
  );
}
