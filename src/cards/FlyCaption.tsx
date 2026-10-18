import { useEffect, useRef } from 'react';
import type { FlyTarget } from '../facts';
import { strings } from '../strings';
import type { Place } from '../tree';
import type { Selection } from '../url';
import type { Go } from './Link';
import { Link } from './Link';
import { SourceLine } from './PlaceFacts';

const t = strings.place.fly;

interface Props {
  /** The place whose guide the pill is in. */
  place: Place;
  /** The chapter the pill was in, for "Back to the guide". */
  chapter: string;
  target: FlyTarget;
  go: Go;
  /** Closes to the place's card and leaves the camera where the fly-there put it. */
  onClose(): void;
}

/** The card shown in place of the place card after a guide's fly-there: what the map is showing, its source, and the way back. */
export function FlyCaption({ place, chapter, target, go, onClose }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), [target]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Escape meant for the search box or another field is not a close (release 10 review).
      const field = e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]');
      if (e.key === 'Escape' && !e.defaultPrevented && !field) { e.preventDefault(); onClose(); } // the app's own Escape then stands down
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const back: Selection = { kind: 'place', id: place.id, page: true, at: chapter };
  return (
    <section className="card glass flycap" aria-labelledby="flycap-h">
      <button type="button" className="iconbtn close" aria-label={t.close} title={t.close} onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <div className="body">
        <p className="kicker">{t.kicker(place.name)}</p>
        <h1 id="flycap-h" ref={heading} tabIndex={-1}>{target.label}</h1>
        <p className="cap">{target.caption}</p>
        <SourceLine cites={target.cite} />
        <Link className="btn primary" to={back} go={go}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          {t.back}
        </Link>
      </div>
    </section>
  );
}
