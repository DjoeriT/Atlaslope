import { useState } from 'react';
import { NameCover } from '../cards/Cover';
import { strings } from '../strings';
import type { Pic } from './helpers';

/** The page's photo mosaic, laid out for 1 to 5 photos so no frame is ever empty, with the credits as a "Photos:" line under it.
 * A photo that fails to load drops out and the layout closes up; with none left the place's name cover shows instead. */
export function Mosaic({ photos, name, color }: { photos: Pic[]; name: string; color: string }) {
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const shown = photos.filter((p) => !broken.has(p.src));
  if (shown.length === 0) return <NameCover name={name} color={color} className="pg-namecover" />;
  return (
    <>
      <div className="pg-mosaic" data-n={shown.length}>
        {shown.map((p) => (
          <figure key={p.src}>
            <img src={p.src} alt={p.alt} onError={() => setBroken(new Set(broken).add(p.src))} />
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
