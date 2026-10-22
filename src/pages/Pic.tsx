import type { CSSProperties } from 'react';
import type { ShownPhoto } from '../facts';
import pageCrops from './pageCrops.json';

// Where the picture sits in its 3:2 or 4:3 frame: the checked focus in src/pages/pageCrops.json (docs/guides.md "Photo crops"). Photos
// without an entry sit at the centre.
const crops = pageCrops as Record<string, { focus: string }>;
const focusOf = (photo: ShownPhoto): CSSProperties | undefined => {
  const f = crops[photo.src.replace(/^.*\/|\.webp$/g, '')]?.focus;
  return f ? { objectPosition: f } : undefined;
};

/** The widest a photo is ever drawn on a guide page (33rem, 528 px): the shipped 800 px files stay sharp at about 1.5x. */
export const PHOTO_MAX_REM = 33;

/** `sizes` for a frame `slot` rem wide on a wide screen: 1.5x that, so the browser takes the 800 px file wherever the frame is wider than
 * 320 px, and the full width on a phone. */
export const sizesFor = (slot: number): string => `(max-width: 47.5em) 150vw, ${Math.round(slot * 1.5 * 16)}px`;

/** A guide photo: a plain image with no hover text (credits are one visible line per set, never a tooltip). */
export function Pic({ photo, slot, alt = '', lazy = true, className }: { photo: ShownPhoto; slot: number; alt?: string; lazy?: boolean; className?: string }) {
  return <img className={className} src={photo.src} srcSet={photo.srcSet} sizes={photo.srcSet ? sizesFor(slot) : undefined} alt={alt} loading={lazy ? 'lazy' : undefined} decoding="async" style={focusOf(photo)} />;
}
