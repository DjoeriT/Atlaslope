import { useState } from 'react';
import { strings } from '../strings';
import type { Pic } from '../pages/helpers';
import { Img } from './Img';
import { Credit, oneEach } from './Credit';
import { Lightbox } from '../pages/Lightbox';

const t = strings.place;

/** What a place with no photo shows instead: its name on paper, with its region colour as a thin rule. Never a broken image. */
export function NameCover({ name, color, className = '' }: { name: string; color: string; className?: string }) {
  return (
    <div className={`namecover ${className}`} style={{ ['--rule' as string]: color }} aria-hidden="true">
      <span>{name}</span>
    </div>
  );
}

interface Props {
  name: string;
  color: string;
  photos: Pic[];
}

/** The card's cover (16:11): one photo, or with more a hero and up to two beside it, no arrows and no dots (owner point 3, 18 Oct 2026:
 * the arrows were too loud). No text on the photos (owner point 4, "way smaller", "of all images"): the credits are one small line under
 * the cover, always visible, as the licences ask (PR #92 review). A tap opens all photos full screen, the one view with arrows. */
export function Cover({ name, color, photos }: Props) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.filter((p) => !broken.has(p.src));
  if (shown.length === 0) return <div className="cover"><NameCover name={name} color={color} /></div>;
  const frames = shown.slice(0, 3);
  return (
    <>
    <div className="cover" data-n={frames.length}>
      {frames.map((p, i) => (
        <figure key={p.src}>
          <button type="button" className="ph" aria-label={t.openPhoto(p.alt, i + 1, shown.length)} onClick={() => setOpen(i)}>
            <Img photo={p} sizes={i === 0 ? (frames.length === 1 ? '(max-width: 47.5em) 100vw, 25rem' : '(max-width: 47.5em) 67vw, 17rem') : '(max-width: 47.5em) 33vw, 8.5rem'} lazy={i > 0} onError={() => setBroken(new Set(broken).add(p.src))} />
          </button>
        </figure>
      ))}
    </div>
    <p className="cover-credits">
      {t.page.photosLine}{' '}
      {oneEach(frames).map((p, i) => <span key={p.src}>{i > 0 && '; '}<Credit photo={p} /></span>)}
    </p>
    {open !== null && <Lightbox photos={shown} start={open} name={name} onClose={() => setOpen(null)} />}
    </>
  );
}
