import { useState } from 'react';
import { strings } from '../strings';
import type { Pic } from '../pages/helpers';
import { Img } from './Img';

const t = strings.place;

/** What a place with no photo shows instead: its name on paper, with its region colour as a thin rule. Never a broken image. */
export function NameCover({ name, color, className = '' }: { name: string; color: string; className?: string }) {
  return (
    <div className={`namecover ${className}`} style={{ ['--rule' as string]: color }} aria-hidden="true">
      <span>{name}</span>
    </div>
  );
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

interface Props {
  name: string;
  color: string;
  photos: Pic[];
}

/** The card's cover photo (16:11) with previous and next when there are two or more, dots, and the credit as a pill on the photo. */
export function Cover({ name, color, photos }: Props) {
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const shown = photos.filter((p) => !broken.has(p.src));
  if (shown.length === 0) return <div className="cover"><NameCover name={name} color={color} /></div>;
  const at = Math.min(i, shown.length - 1);
  const photo = shown[at];
  const many = shown.length > 1;
  const step = (d: number) => setI((at + d + shown.length) % shown.length);
  return (
    <div className="cover">
      <Img key={photo.src} photo={photo} sizes="(max-width: 47.5em) 100vw, 25rem" onError={() => setBroken(new Set(broken).add(photo.src))} />
      {many && (
        <>
          <button type="button" className="round nav prev" aria-label={t.previousPhoto} onClick={() => step(-1)}><Chevron dir="prev" /></button>
          <button type="button" className="round nav next" aria-label={t.nextPhoto(((at + 1) % shown.length) + 1, shown.length)} onClick={() => step(1)}><Chevron dir="next" /></button>
          <div className="dots" aria-hidden="true">{shown.map((p, k) => <i key={p.src} className={k === at ? 'on' : undefined} />)}</div>
        </>
      )}
      <a className="credit" href={photo.page} target="_blank" rel="noopener noreferrer">{t.photoCredit(photo.artist, photo.licence)}</a>
    </div>
  );
}
