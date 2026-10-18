import { useState } from 'react';
import { NameCover } from '../cards/Cover';
import { strings } from '../strings';
import type { Pic } from './helpers';
import { Img } from '../cards/Img';
import { Credit, oneEach } from '../cards/Credit';
import { Lightbox } from './Lightbox';

const t = strings.place;

/** How wide each frame is (pages.css: a 76rem page, the hero 2 parts of 3, the side photos 1; a phone shows only the hero, full width,
 * so the side photos are lazy and never load there). */
function slotSizes(n: number, i: number): string {
  if (n === 1) return '(min-width: 76rem) 72rem, 100vw';
  if (i === 0) return '(max-width: 47.5em) 100vw, (min-width: 76rem) 48rem, 66vw';
  return '(min-width: 76rem) 24rem, 34vw';
}

/** The guide's photo header (owner point 3, 18 Oct 2026): one hero, and with more photos two beside it, never more than three frames, no
 * arrows. Any photo, or "All N photos", opens the full-screen viewer, the one place with arrows. A photo that fails to load drops out and
 * the layout closes up; with none left the place's name cover shows instead. The credits stay a small "Photos:" line under it. */
export function Mosaic({ photos, name, color }: { photos: Pic[]; name: string; color: string }) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.filter((p) => !broken.has(p.src));
  if (shown.length === 0) return <NameCover name={name} color={color} className="pg-namecover" />;
  const frames = shown.slice(0, 3);
  return (
    <>
      <div className="pg-mosaic" data-n={frames.length}>
        {frames.map((p, i) => (
          <figure key={p.src}>
            <button type="button" className="ph" aria-label={t.openPhoto(p.alt, i + 1, shown.length)} onClick={() => setOpen(i)}>
              <Img photo={p} sizes={slotSizes(frames.length, i)} lazy={i > 0} onError={() => setBroken(new Set(broken).add(p.src))} />
            </button>
          </figure>
        ))}
        {shown.length > 1 && (
          <button type="button" className="all" onClick={() => setOpen(0)}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
            {t.allPhotos(shown.length)}
          </button>
        )}
      </div>
      <p className="pg-credits">
        {strings.place.page.photosLine}{' '}
        {oneEach(shown).map((p, i) => (
          <span key={p.src}>
            {i > 0 && '; '}
            <Credit photo={p} />
          </span>
        ))}
      </p>
      {open !== null && <Lightbox photos={shown} start={open} name={name} onClose={() => setOpen(null)} />}
    </>
  );
}
