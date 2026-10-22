// The "Read with the map" card (guide redesign, C3, owner 22 Oct 2026): the place's photo with a solid champagne bar under it that reads as a
// button. One link, so the whole photo is clickable; it opens the map tour. Only on guides that have a tour.
import type { MouseEvent } from 'react';
import type { Go } from '../cards/Link';
import type { ShownPhoto } from '../facts';
import { growFrom, reducedMotion } from '../story/unfold';
import { strings } from '../strings';
import { selectionToHash, type Selection } from '../url';
import { PHOTO_MAX_REM, Pic } from './Pic';

const t = strings.story.card;

const Glyph = () => (
  <svg className="mc-glyph" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M1.5 3.5 6.5 2v12.5l-5 1.5zM6.5 2l5 1.5v12.5l-5-1.5zM11.5 3.5 16.5 2v12.5l-5 1.5z" /></svg>
);

export function MapCard({ id, photo, minutes, stops, go }: { id: string; photo?: ShownPhoto; minutes: number; stops: number; go: Go }) {
  const to: Selection = { kind: 'place', id, page: true, story: true };
  const open = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const img = e.currentTarget.querySelector<HTMLImageElement>('.mc-img');
    if (reducedMotion() || !img) { go(to); return; }
    const release = await growFrom(img); // the photo grows to the full screen, then the map mode opens under it
    go(to);
    await release();
  };
  return (
    <a className="mapcard" href={selectionToHash(to)} onClick={open}>
      <span className="mc-ph">{photo && <Pic photo={photo} slot={PHOTO_MAX_REM} lazy={false} className="mc-img" />}</span>
      <span className="mc-bar">
        <Glyph />
        <span className="mc-txt"><span className="mc-t">{t.title}</span><span className="mc-s">{t.sub(minutes, stops)}</span></span>
        <span className="mc-go" aria-hidden="true">→</span>
      </span>
    </a>
  );
}
