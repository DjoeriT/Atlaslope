import { useEffect, useState } from 'react';
import { strings } from '../strings';

const KEY = 'atlaslope-first-run';
const t = strings.firstRun;

function alreadySeen(): boolean {
  try { return localStorage.getItem(KEY) === 'seen'; } catch { return false; }
}

/** Shown once per browser: a small note on how to move the map, over the map's top edge. The home page now does the welcome, so the
 * atlas opens straight on the map (site visual review, 18 Oct 2026); the note goes at the first touch of the map, or with its close
 * button, and is remembered. It takes no focus, so no ring shows unless the keyboard reaches it. */
export function FirstRun() {
  const [visible, setVisible] = useState(() => !alreadySeen());

  useEffect(() => {
    if (!visible) return;
    const dismiss = () => {
      try { localStorage.setItem(KEY, 'seen'); } catch { /* storage blocked: it shows again next visit */ }
      setVisible(false);
    };
    const onMap = (e: Event) => { if ((e.target as Element | null)?.closest?.('.maplibregl-canvas-container, .gesture-hint .x')) dismiss(); };
    window.addEventListener('pointerdown', onMap, true);
    window.addEventListener('wheel', onMap, { capture: true, passive: true });
    window.addEventListener('click', onMap, true);
    return () => {
      window.removeEventListener('pointerdown', onMap, true);
      window.removeEventListener('wheel', onMap, true);
      window.removeEventListener('click', onMap, true);
    };
  }, [visible]);
  if (!visible) return null;

  return (
    <aside className="gesture-hint glass" aria-label={t.label}>
      <ul>
        {t.hints.map((parts) => (
          <li key={parts[0]}>
            {parts.map((text, i) => (i % 2 === 0 ? <b key={i}>{text}</b> : text))}
          </li>
        ))}
      </ul>
      <button type="button" className="x" aria-label={t.close}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </aside>
  );
}
