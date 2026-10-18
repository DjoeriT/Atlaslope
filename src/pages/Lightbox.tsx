import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Credit } from '../cards/Credit';
import { Img } from '../cards/Img';
import { strings } from '../strings';
import type { Pic } from './helpers';
import '../styles/lightbox.css';

const t = strings.place;

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

/** All of a place's photos full screen, one at a time: the only place with previous and next arrows (owner point 3, 18 Oct 2026),
 * a "2 / 5" counter and the credit under the photo. Arrow keys step, Escape or a click outside the photo closes. */
export function Lightbox({ photos, start, name, onClose }: { photos: Pic[]; start: number; name: string; onClose(): void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(start);
  const n = photos.length;
  const step = (d: number) => setI((at) => (at + d + n) % n);
  useEffect(() => {
    // Focus goes back to the photo that opened the viewer when it closes (PR #92 review).
    const opener = document.activeElement as HTMLElement | null;
    const d = dialog.current;
    if (d && !d.open) d.showModal?.();
    return () => {
      d?.close?.();
      opener?.focus?.({ preventScroll: true });
    };
  }, []);
  const photo = photos[Math.min(i, n - 1)];
  // In a portal, and its clicks and keys stop here, so the card and the app's Escape never see them (PR #92 review).
  return createPortal(
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={t.photosOf(name)}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => {
        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (el === e.currentTarget || el.tagName === 'FIGURE') onClose(); // a click beside the photo closes
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      }}
    >
      <figure>
        <Img key={photo.src} photo={photo} sizes="100vw" />
        <figcaption aria-live="polite">
          <span className="count">{t.photoCount(i + 1, n)}</span>
          <span className="alt">{photo.alt}</span>
          <span><Credit photo={photo} /></span>
        </figcaption>
      </figure>
      {n > 1 && (
        <>
          <button type="button" className="round nav prev" aria-label={t.previousPhoto} title={t.previousPhoto} onClick={() => step(-1)}><Chevron dir="prev" /></button>
          <button type="button" className="round nav next" aria-label={t.nextPhoto(((i + 1) % n) + 1, n)} title={t.nextPhoto(((i + 1) % n) + 1, n)} onClick={() => step(1)}><Chevron dir="next" /></button>
        </>
      )}
      <button type="button" className="round close" aria-label={t.closePhotos} title={t.closePhotos} onClick={onClose}>
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </dialog>,
    document.body,
  );
}
