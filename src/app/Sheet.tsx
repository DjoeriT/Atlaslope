import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { strings } from '../strings';

// The card as a bottom sheet on phones (owner card, 17 Oct 2026: "Drag, 3 stops"). Peek shows the title and the main button over a
// full map, half adds the photo, full is for reading. Elsewhere the wrapper is display:contents and the card floats as before.
export type Stop = 'peek' | 'half' | 'full';
const STOPS: Stop[] = ['peek', 'half', 'full'];
const PHONE = '(max-width: 51.25em) and (orientation: portrait)';

function heightOf(stop: Stop): number {
  const vh = window.innerHeight;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  if (stop === 'peek') return Math.min(vh * 0.4, rem * 13.5);
  if (stop === 'half') return vh * 0.52;
  return vh - rem * 4.4;
}

interface Props {
  /** A new value (the open card) puts the sheet back to half. */
  resetKey: string;
  hidden?: boolean;
  children: ReactNode;
}

export function Sheet({ resetKey, hidden, children }: Props) {
  const [stop, setStop] = useState<Stop>('half');
  const [phone, setPhone] = useState(() => matchMedia(PHONE).matches);
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ y: number; h: number; t: number; moved: boolean } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  useEffect(() => { setStop('half'); }, [resetKey]);

  const height = drag ?? heightOf(stop);
  // The map's buttons and framing follow the sheet's top edge, as drawn (design check: a stop's planned height can differ mid-move).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!phone || hidden || !el) return;
    const set = () => document.documentElement.style.setProperty('--sheet-h', `${Math.round(el.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phone, hidden]);
  // At peek, what the sheet hides is out of the keyboard's reach too; the title stays readable.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll('.card .scroll, .card .body').forEach((n) => n.toggleAttribute('inert', phone && stop === 'peek'));
  });

  const onDown = useCallback((e: React.PointerEvent) => {
    start.current = { y: e.clientY, h: heightOf(stop), t: performance.now(), moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [stop]);
  const onMove = useCallback((e: React.PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const dy = e.clientY - s.y;
    if (Math.abs(dy) > 4) s.moved = true;
    if (s.moved) setDrag(Math.max(heightOf('peek') * 0.8, Math.min(heightOf('full'), s.h - dy)));
  }, []);
  const onUp = useCallback((e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    if (!s.moved) { setStop(stop === 'full' ? 'half' : stop === 'half' ? 'full' : 'half'); return; }
    const h = s.h - (e.clientY - s.y);
    const v = (s.y - e.clientY) / Math.max(1, performance.now() - s.t); // px per ms, up is positive
    const i = STOPS.indexOf(stop);
    let next: Stop;
    if (Math.abs(v) > 0.5) next = STOPS[Math.max(0, Math.min(2, i + (v > 0 ? 1 : -1)))];
    else next = STOPS.reduce((a, b) => (Math.abs(heightOf(b) - h) < Math.abs(heightOf(a) - h) ? b : a));
    setDrag(null);
    setStop(next);
  }, [stop]);
  const onKey = (e: React.KeyboardEvent) => {
    const i = STOPS.indexOf(stop);
    if (e.key === 'ArrowUp') { e.preventDefault(); setStop(STOPS[Math.min(2, i + 1)]); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setStop(STOPS[Math.max(0, i - 1)]); }
  };

  if (!phone) return <div className="sheet" hidden={hidden}>{children}</div>;
  return (
    <div
      ref={ref} className="sheet phone" data-stop={stop} data-drag={drag !== null || undefined} hidden={hidden}
      style={{ height: `${Math.round(height)}px` }}
    >
      <button
        type="button" className="grab" aria-expanded={stop !== 'peek'}
        onClick={(e) => { if (e.detail === 0) setStop(stop === 'peek' ? 'half' : stop === 'half' ? 'full' : 'peek'); }}
        aria-label={strings.sheet.label(strings.sheet.stops[stop])}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { start.current = null; setDrag(null); }} onKeyDown={onKey}
      ><i aria-hidden="true" /></button>
      {children}
    </div>
  );
}
