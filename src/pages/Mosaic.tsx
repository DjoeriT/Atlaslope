import { useState } from 'react';
import { NameCover } from '../cards/Cover';
import { strings } from '../strings';
import type { Pic } from './helpers';
import { Img } from '../cards/Img';

/** How wide each frame of the mosaic is (pages.css: a 76rem page, the first photo 2 parts of 3 (up to 3 photos) or of 4, the others 1;
 * a phone shows only the first, full width, so the others are lazy and never load there). */
function slotSizes(n: number, i: number): string {
  if (n === 1) return '(min-width: 76rem) 72rem, 100vw';
  if (i === 0) return n <= 3 ? '(max-width: 47.5em) 100vw, (min-width: 76rem) 48rem, 66vw' : '(max-width: 47.5em) 100vw, (min-width: 76rem) 36rem, 50vw';
  return n <= 3 ? '(min-width: 76rem) 24rem, 34vw' : '(min-width: 76rem) 18rem, 25vw';
}

/** The page's photo mosaic, laid out for 1 to 5 photos so no frame is ever empty, with the credits as a "Photos:" line under it.
 * A photo that fails to load drops out and the layout closes up; with none left the place's name cover shows instead. */
export function Mosaic({ photos, name, color }: { photos: Pic[]; name: string; color: string }) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const shown = photos.filter((p) => !broken.has(p.src));
  if (shown.length === 0) return <NameCover name={name} color={color} className="pg-namecover" />;
  return (
    <>
      <div className="pg-mosaic" data-n={shown.length}>
        {shown.map((p, i) => (
          <figure key={p.src}>
            <Img photo={p} sizes={slotSizes(shown.length, i)} lazy={i > 0} onError={() => setBroken(new Set(broken).add(p.src))} />
          </figure>
        ))}
      </div>
      <p className="pg-credits">
        {strings.place.page.photosLine}{' '}
        {shown.map((p, i) => (
          <span key={p.src}>
            {i > 0 && '; '}
            <a href={p.page} target="_blank" rel="noopener noreferrer">{p.artist}, {p.licence}</a>
          </span>
        ))}
      </p>
    </>
  );
}
